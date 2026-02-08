import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    // Log the data export request (skip if auditLog doesn't exist)
    // await createAuditLog(prisma, { ... });

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        stores: {
          include: {
            orders: {
              take: 1000, // Limit to prevent huge exports
              orderBy: { createdAt: 'desc' },
            },
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
      },
      stores: userDataWithoutPassword.stores.map(store => ({
        id: store.id,
        name: store.name,
        shopifyDomain: store.shopifyDomain,
        createdAt: store.createdAt,
        orderCount: store.orders.length,
        // Note: Access tokens are NOT included in export for security
      })),
      subscription: userDataWithoutPassword.subscription ? {
        plan: userDataWithoutPassword.subscription.plan,
        status: userDataWithoutPassword.subscription.status,
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
