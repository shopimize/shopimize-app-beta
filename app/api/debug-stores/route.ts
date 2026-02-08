import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Diagnostic endpoint to check what stores exist in database
 * Visit: /api/debug-stores
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  try {
    // Get current user info
    const user = session?.user?.id ? await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true }
    }) : null;

    // Get ALL stores in database (for debugging)
    const allStores = await prisma.store.findMany({
      select: {
        id: true,
        userId: true,
        shopifyDomain: true,
        name: true,
        isActive: true,
        createdAt: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get stores for current user
    const myStores = session?.user?.id ? await prisma.store.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        shopifyDomain: true,
        isActive: true,
      }
    }) : [];

    return NextResponse.json({
      currentSession: {
        userId: session?.user?.id || 'No session',
        email: session?.user?.email || 'No session',
      },
      currentUser: user,
      myStores: {
        count: myStores.length,
        stores: myStores
      },
      allStoresInDatabase: {
        count: allStores.length,
        stores: allStores
      },
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
