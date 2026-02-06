import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const days = parseInt(searchParams.get('days') || '30');

  if (!storeId) {
    return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
  }

  try {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: session.user.id
      }
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const startDate = startOfDay(subDays(new Date(), days));
    const endDate = endOfDay(new Date());

    // Get daily metrics
    const dailyMetrics = await prisma.dailyMetric.findMany({
      where: {
        storeId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate totals
    const totals = dailyMetrics.reduce((acc, metric) => {
      return {
        revenue: acc.revenue + metric.revenue,
        cost: acc.cost + metric.cost,
        adSpend: acc.adSpend + metric.adSpend,
        shippingCost: acc.shippingCost + metric.shippingCost,
        profit: acc.profit + metric.profit,
        orderCount: acc.orderCount + metric.orderCount
      };
    }, {
      revenue: 0,
      cost: 0,
      adSpend: 0,
      shippingCost: 0,
      profit: 0,
      orderCount: 0
    });

    const avgMargin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0;

    // Get recent orders for activity feed
    const recentOrders = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      totals: {
        ...totals,
        margin: avgMargin
      },
      dailyMetrics: dailyMetrics.map(m => ({
        date: m.date.toISOString().split('T')[0],
        revenue: m.revenue,
        cost: m.cost,
        adSpend: m.adSpend,
        profit: m.profit,
        margin: m.margin,
        orderCount: m.orderCount
      })),
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        totalPrice: o.totalPrice,
        profit: o.profit,
        margin: o.margin,
        createdAt: o.createdAt.toISOString()
      })),
      store: {
        name: store.name,
        lastSynced: store.lastSyncedAt?.toISOString()
      }
    });

  } catch (error) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
