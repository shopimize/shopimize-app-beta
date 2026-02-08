import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Admin endpoint to view all users
 * Visit: /api/admin/users
 * 
 * SECURITY WARNING: This should be protected with admin authentication in production!
 * For now, only use in development or delete after checking users.
 */
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        subscription: {
          select: {
            plan: true,
            status: true,
          }
        },
        stores: {
          select: {
            id: true,
            name: true,
            shopifyDomain: true,
            isActive: true,
          }
        },
        _count: {
          select: {
            stores: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        subscription: user.subscription,
        storeCount: user._count.stores,
        stores: user.stores,
      })),
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
