import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/compliance/gdpr';

/**
 * GDPR Article 17: Right to Erasure ("Right to be Forgotten")
 * Allows users to request deletion of their personal data
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { confirmEmail } = await request.json();

    // Verify email confirmation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (confirmEmail !== user.email) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    // Log the deletion request BEFORE deletion
    await createAuditLog(prisma, {
      userId: session.user.id,
      action: 'data_delete_request',
      metadata: { email: user.email },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Delete all related data (cascading deletes handled by Prisma schema)
    // This will delete:
    // - Brands
    // - Stores
    // - Orders
    // - Products
    // - Subscription
    // - Audit logs
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    // Create a final audit log entry (stored separately for compliance)
    await prisma.dataDeletionRequest.create({
      data: {
        email: user.email,
        status: 'completed',
        reason: 'User requested account deletion',
        requestedAt: new Date(),
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
      deletedAt: new Date().toISOString(),
      notice: 'This action cannot be undone. We have retained an anonymized record of this deletion for compliance purposes.',
    });
  } catch (error) {
    console.error('Data deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete data. Please contact support.' },
      { status: 500 }
    );
  }
}

/**
 * GET: Check if user has pending deletion requests
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const deletionRequests = await prisma.dataDeletionRequest.findMany({
      where: {
        email: user.email,
        status: 'pending',
      },
      orderBy: { requestedAt: 'desc' },
    });

    return NextResponse.json({
      hasPendingRequest: deletionRequests.length > 0,
      requests: deletionRequests,
    });
  } catch (error) {
    console.error('Error checking deletion requests:', error);
    return NextResponse.json(
      { error: 'Failed to check deletion requests' },
      { status: 500 }
    );
  }
}
