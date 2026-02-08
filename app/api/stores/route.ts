import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  console.log('🔵 Fetching stores for user:', session?.user?.id);
  
  if (!session?.user?.id) {
    console.log('🔴 No session in stores API');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stores = await prisma.store.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        shopifyDomain: true,
        lastSyncedAt: true,
        createdAt: true
      }
    });

    console.log('✅ Found stores:', stores.length, stores.map(s => s.shopifyDomain));

    return NextResponse.json({ stores });
  } catch (error) {
    console.error('🔴 Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
