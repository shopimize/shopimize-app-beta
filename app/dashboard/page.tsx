'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface Metrics {
  totals: {
    revenue: number;
    profit: number;
    margin: number;
    orderCount: number;
    cost: number;
    adSpend: number;
  };
  dailyMetrics: Array<{
    date: string;
    revenue: number;
    profit: number;
    margin: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalPrice: number;
    profit: number;
    margin: number;
    createdAt: string;
  }>;
  store: {
    name: string;
    lastSynced?: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStores();
    }
  }, [status]);

  useEffect(() => {
    if (selectedStore) {
      fetchMetrics();
    }
  }, [selectedStore]);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      const data = await response.json();
      setStores(data.stores || []);
      if (data.stores?.length > 0) {
        setSelectedStore(data.stores[0].id);
      } else {
        setLoading(false); // Stop loading if no stores
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false); // Stop loading on error
    }
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/metrics?storeId=${selectedStore}&days=30`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncOrders = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: selectedStore }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchMetrics();
      }
    } catch (error) {
      console.error('Error syncing orders:', error);
    } finally {
      setSyncing(false);
    }
  };

  const connectShopify = async () => {
    const shop = prompt('Enter your Shopify store domain (e.g., mystore.myshopify.com):');
    if (!shop) return;

    try {
      const response = await fetch(`/api/integrations/shopify/connect?shop=${shop}`);
      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting Shopify:', error);
    }
  };

  const connectGoogleAds = async () => {
    if (!selectedStore) return;

    try {
      const response = await fetch(`/api/integrations/google-ads/connect?storeId=${selectedStore}`);
      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting Google Ads:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <span className="text-2xl font-bold text-gray-900">ProfitTracker</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ProfitTracker</h1>
          <p className="text-gray-600 mb-8">Connect your Shopify store to get started</p>
          <button
            onClick={connectShopify}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition font-medium"
          >
            Connect Shopify Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-gray-900">ProfitTracker</span>
            <div className="flex items-center gap-4">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={syncOrders}
            disabled={syncing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Orders'}
          </button>
          <button
            onClick={connectGoogleAds}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            Connect Google Ads
          </button>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-2">Total Revenue</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${metrics.totals.revenue.toFixed(2)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-2">Total Profit</div>
                <div className="text-3xl font-bold text-green-600">
                  ${metrics.totals.profit.toFixed(2)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-2">Profit Margin</div>
                <div className="text-3xl font-bold text-purple-600">
                  {metrics.totals.margin.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-2">Total Orders</div>
                <div className="text-3xl font-bold text-gray-900">
                  {metrics.totals.orderCount}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profit Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Profit"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="divide-y">
                {metrics.recentOrders.map(order => (
                  <div key={order.id} className="p-6 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">Order #{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${order.totalPrice.toFixed(2)}</div>
                      <div className="text-sm text-green-600">
                        Profit: ${order.profit.toFixed(2)} ({order.margin.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
