'use client';

import { BillingSummary } from '@/types';

interface BillingSummaryProps {
  summary: BillingSummary;
}

export default function BillingSummary({ summary }: BillingSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalHours.toFixed(2)}h</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ${summary.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Hours by User</h4>
        <div className="space-y-2">
          {summary.hoursByUser.map((user) => (
            <div key={user.name} className="flex justify-between text-sm">
              <span className="text-gray-600">{user.name}</span>
              <span className="font-medium">{user.hours.toFixed(2)}h</span>
            </div>
          ))}
          {summary.hoursByUser.length === 0 && (
            <p className="text-gray-500 text-sm">No data</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Hours by Date</h4>
        <div className="space-y-1">
          {Object.entries(summary.hoursByDate)
            .slice(0, 7)
            .map(([date, hours]) => (
              <div key={date} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="font-medium">{hours.toFixed(2)}h</span>
              </div>
            ))}
          {Object.keys(summary.hoursByDate).length === 0 && (
            <p className="text-gray-500 text-sm">No data</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          Time Logs: {summary.timeLogCount} • Billing Rate: ${summary.billingRate}/hr
        </p>
      </div>
    </div>
  );
}
