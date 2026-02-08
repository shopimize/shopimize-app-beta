import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/compliance/gdpr';

/**
 * GDPR Article 15: Right of Access
 * Allows users to download all their personal data
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Log the data export request
    await createAuditLog(prisma, {
      userId: session.user.id,
      action: 'data_export',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        brands: {
          include: {
            stores: {
              include: {
                orders: {
                  take: 1000, // Limit to prevent huge exports
                  orderBy: { createdAt: 'desc' },
                },
                products: {
                  take: 1000,
                },
              },
            },
            channels: true,
          },
        },
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...userDataWithoutPassword } = userData;

    // Structure the export
    const dataExport = {
      exportDate: new Date().toISOString(),
      exportType: 'GDPR Article 15 - Right of Access',
      personalData: {
        id: userDataWithoutPassword.id,
        email: userDataWithoutPassword.email,
        name: userDataWithoutPassword.name,
        createdAt: userDataWithoutPassword.createdAt,
        updatedAt: userDataWithoutPassword.updatedAt,
        lastLoginAt: userDataWithoutPassword.lastLoginAt,
      },
      gdprConsent: {
        gdprConsent: userDataWithoutPassword.gdprConsent,
        gdprConsentDate: userDataWithoutPassword.gdprConsentDate,
        marketingConsent: userDataWithoutPassword.marketingConsent,
        dataProcessingConsent: userDataWithoutPassword.dataProcessingConsent,
      },
      brands: userDataWithoutPassword.brands.map(brand => ({
        id: brand.id,
        name: brand.name,
        createdAt: brand.createdAt,
        stores: brand.stores.map(store => ({
          id: store.id,
          platform: store.platform,
          name: store.name,
          domain: store.domain,
          createdAt: store.createdAt,
          orderCount: store.orders.length,
          productCount: store.products.length,
          // Note: Full order/product lists can be requested separately
        })),
        channels: brand.channels,
      })),
      subscription: userDataWithoutPassword.subscription ? {
        plan: userDataWithoutPassword.subscription.plan,
        status: userDataWithoutPassword.subscription.status,
        currentPeriodStart: userDataWithoutPassword.subscription.currentPeriodStart,
        currentPeriodEnd: userDataWithoutPassword.subscription.currentPeriodEnd,
      } : null,
      notice: {
        message: 'This export contains all personal data we hold about you.',
        retention: 'You can request deletion of this data at any time via the data deletion request.',
        contact: 'For questions, contact privacy@shopimize.com',
      },
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(dataExport, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="shopimize-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
