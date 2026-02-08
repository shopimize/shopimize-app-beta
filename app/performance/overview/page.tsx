'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function PerformanceOverviewPage() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
          <p className="text-gray-600 mb-4">
            Coming in Phase 2: Detailed performance analytics with date range filters and trend analysis
          </p>
          <p className="text-sm text-gray-500">
            For now, check out the Dashboard for your key metrics
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
