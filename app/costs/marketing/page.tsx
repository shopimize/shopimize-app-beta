'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function MarketingSpendPage() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketing Spend</h2>
          <p className="text-gray-600 mb-4">
            Coming Soon: Track ad spend across Google Ads, Facebook Ads, and calculate ROAS
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
