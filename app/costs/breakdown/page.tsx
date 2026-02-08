'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function CostBreakdownPage() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost Breakdown</h2>
          <p className="text-gray-600 mb-4">
            Coming in Phase 4: Visual breakdown of all your costs (COGS, Marketing, Fulfillment, Fees)
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
