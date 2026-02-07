// Demo/sample data for testing the interface without Shopify
import { addDays, subDays, format } from 'date-fns';

export const generateDemoStore = () => ({
  id: 'demo-store-1',
  name: 'Demo Fashion Store',
  shopifyDomain: 'demo-store.myshopify.com',
  currency: 'USD',
  lastSyncedAt: new Date().toISOString(),
});

export const generateDemoMetrics = (days: number = 30) => {
  const dailyMetrics = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const revenue = Math.random() * 5000 + 2000; // $2000-$7000
    const cost = revenue * (0.4 + Math.random() * 0.2); // 40-60% of revenue
    const adSpend = Math.random() * 500 + 200; // $200-$700
    const shippingCost = Math.random() * 200 + 100; // $100-$300
    const profit = revenue - cost - adSpend - shippingCost;
    const margin = (profit / revenue) * 100;

    dailyMetrics.push({
      date: format(date, 'yyyy-MM-dd'),
      revenue: Math.round(revenue * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      adSpend: Math.round(adSpend * 100) / 100,
      shippingCost: Math.round(shippingCost * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      orderCount: Math.floor(Math.random() * 30 + 10), // 10-40 orders
    });
  }

  return dailyMetrics;
};

export const generateDemoOrders = () => {
  const orders = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const totalPrice = Math.random() * 300 + 50; // $50-$350
    const totalCost = totalPrice * (0.4 + Math.random() * 0.2);
    const shippingCost = Math.random() * 15 + 5;
    const profit = totalPrice - totalCost - shippingCost;
    const margin = (profit / totalPrice) * 100;

    orders.push({
      id: `demo-order-${i + 1}`,
      orderNumber: `#${1000 + i}`,
      totalPrice: Math.round(totalPrice * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      createdAt: subDays(today, Math.floor(Math.random() * 7)).toISOString(),
    });
  }

  return orders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const generateDemoTotals = (dailyMetrics: any[]) => {
  const totals = dailyMetrics.reduce((acc, day) => ({
    revenue: acc.revenue + day.revenue,
    cost: acc.cost + day.cost,
    adSpend: acc.adSpend + day.adSpend,
    shippingCost: acc.shippingCost + day.shippingCost,
    profit: acc.profit + day.profit,
    orderCount: acc.orderCount + day.orderCount,
  }), {
    revenue: 0,
    cost: 0,
    adSpend: 0,
    shippingCost: 0,
    profit: 0,
    orderCount: 0,
  });

  return {
    ...totals,
    revenue: Math.round(totals.revenue * 100) / 100,
    cost: Math.round(totals.cost * 100) / 100,
    adSpend: Math.round(totals.adSpend * 100) / 100,
    shippingCost: Math.round(totals.shippingCost * 100) / 100,
    profit: Math.round(totals.profit * 100) / 100,
    margin: Math.round((totals.profit / totals.revenue) * 100 * 100) / 100,
  };
};
