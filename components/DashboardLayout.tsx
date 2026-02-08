'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't show sidebar on settings page (it has its own layout)
  if (pathname === '/settings') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {pathname === '/dashboard' && 'Dashboard'}
                {pathname === '/performance/overview' && 'Performance Overview'}
                {pathname === '/performance/orders' && 'Orders'}
                {pathname === '/performance/products' && 'Products'}
                {pathname === '/performance/channels' && 'Channels'}
                {pathname === '/costs/breakdown' && 'Cost Breakdown'}
                {pathname === '/costs/products' && 'Product Costs'}
                {pathname === '/costs/marketing' && 'Marketing Spend'}
                {pathname === '/reports/export' && 'Export Data'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {session?.user?.email}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Orders
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
