import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getShopifyOrders, calculateOrderCost } from '@/lib/shopify';
import { startOfDay, subDays } from 'date-fns';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { storeId } = await request.json();

    // Get store with decrypted credentials using secure service
    const { getSecureStore } = await import('@/lib/secure-store');
    const store = await getSecureStore(storeId, session.user.id);

    if (!store || !store.credentials.shopifyAccessToken) {
      return NextResponse.json({ error: 'Store not found or missing credentials' }, { status: 404 });
    }

    // Fetch orders from last 30 days or since last sync
    const since = store.lastSyncedAt || subDays(new Date(), 30);
    console.log('[SYNC] Fetching orders since:', since);
    
    const orders = await getShopifyOrders(
      store.shopifyDomain,
      store.credentials.shopifyAccessToken,  // Use decrypted token
      since
    );

    console.log('[SYNC] Found orders from Shopify:', orders.length);
    console.log('[SYNC] Orders:', JSON.stringify(orders, null, 2));

    let processedCount = 0;

    for (const shopifyOrder of orders) {
      // Check if order already exists
      const existingOrder = await prisma.order.findUnique({
        where: { shopifyOrderId: shopifyOrder.id }
      });

      if (existingOrder) continue;

      // Calculate order cost from inventory
      const totalCost = await calculateOrderCost(
        store.shopifyDomain,
        store.shopifyAccessToken,
        shopifyOrder
      );

      const totalPrice = parseFloat(shopifyOrder.total_price);
      const shippingCost = parseFloat(shopifyOrder.total_shipping_price_set?.shop_money?.amount || '0');
      const taxAmount = parseFloat(shopifyOrder.total_tax);
      const discountAmount = parseFloat(shopifyOrder.total_discounts);

      const profit = totalPrice - totalCost - shippingCost;
      const margin = totalPrice > 0 ? (profit / totalPrice) * 100 : 0;

      // Create order record
      await prisma.order.create({
        data: {
          storeId: store.id,
          shopifyOrderId: shopifyOrder.id,
          orderNumber: shopifyOrder.order_number,
          totalPrice,
          totalCost,
          shippingCost,
          taxAmount,
          discountAmount,
          profit,
          margin,
          currency: store.currency,
          financialStatus: shopifyOrder.financial_status,
          fulfillmentStatus: shopifyOrder.fulfillment_status,
          createdAt: new Date(shopifyOrder.created_at),
          processedAt: shopifyOrder.processed_at ? new Date(shopifyOrder.processed_at) : null,
        }
      });

      processedCount++;
    }

    // Update metrics for affected days
    await updateDailyMetrics(store.id, since);

    // Update last synced timestamp
    await prisma.store.update({
      where: { id: store.id },
      data: { lastSyncedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      processedCount,
      totalOrders: orders.length
    });

  } catch (error) {
    console.error('Sync orders error:', error);
    return NextResponse.json(
      { error: 'Failed to sync orders' },
      { status: 500 }
    );
  }
}

async function updateDailyMetrics(storeId: string, since: Date) {
  const orders = await prisma.order.findMany({
    where: {
      storeId,
      createdAt: { gte: since }
    }
  });

  // Group by date
  const dailyData = new Map<string, any>();

  for (const order of orders) {
    const dateKey = startOfDay(order.createdAt).toISOString();
    
    if (!dailyData.has(dateKey)) {
      dailyData.set(dateKey, {
        revenue: 0,
        cost: 0,
        shippingCost: 0,
        profit: 0,
        orderCount: 0
      });
    }

    const day = dailyData.get(dateKey);
    day.revenue += order.totalPrice;
    day.cost += order.totalCost;
    day.shippingCost += order.shippingCost;
    day.profit += order.profit;
    day.orderCount += 1;
  }

  // Upsert daily metrics
  for (const [dateStr, data] of dailyData.entries()) {
    const date = new Date(dateStr);
    const margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;

    await prisma.dailyMetric.upsert({
      where: {
        storeId_date: {
          storeId,
          date
        }
      },
      create: {
        storeId,
        date,
        revenue: data.revenue,
        cost: data.cost,
        shippingCost: data.shippingCost,
        profit: data.profit,
        margin,
        orderCount: data.orderCount
      },
      update: {
        revenue: data.revenue,
        cost: data.cost,
        shippingCost: data.shippingCost,
        profit: data.profit,
        margin,
        orderCount: data.orderCount
      }
    });
  }
}
