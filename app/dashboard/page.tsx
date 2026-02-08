'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface Metrics {
  totals: {
    revenue: number;
    profit: number;
    margin: number;
    orderCount: number;
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
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

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
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
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

  if (stores.length === 0 && !loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Shopimize!</h2>
            <p className="text-gray-600 mb-8">Connect your Shopify store to start tracking your profits</p>
            <button
              onClick={() => window.location.href = '/api/integrations/shopify/connect'}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Connect Shopify Store
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading || !metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <div className="text-gray-600">Loading metrics...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Store Selector */}
      {stores.length > 1 && (
        <div className="mb-6">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Revenue</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${metrics.totals.revenue.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Profit</span>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${metrics.totals.profit.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Profit Margin</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {metrics.totals.margin.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Orders</span>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {metrics.totals.orderCount}
          </div>
        </div>
      </div>

      {/* Profit Over Time Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profit Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.dailyMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              stroke="#9ca3af"
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
              labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Profit</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Margin</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <span className={order.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${order.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <span className={order.margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {order.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-500">
                    {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
