'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function ExportDataPage() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Data</h2>
          <p className="text-gray-600 mb-4">
            Coming in Phase 5: Export your data to CSV, Excel, or PDF for analysis and tax reporting
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
