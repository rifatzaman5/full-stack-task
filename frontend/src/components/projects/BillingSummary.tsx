'use client';

import type { BillingSummary } from '@/types';
import { Clock, DollarSign, Users, Calendar } from 'lucide-react';

interface BillingSummaryProps {
  summary: BillingSummary;
}

export default function BillingSummary({ summary }: BillingSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-primary-100 p-2 rounded-lg">
          <DollarSign className="h-5 w-5 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Billing Summary</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4 text-primary-600" />
            <p className="text-xs text-primary-700 font-medium">Total Hours</p>
          </div>
          <p className="text-2xl font-bold text-primary-900">{summary.totalHours.toFixed(2)}h</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-medium">Total Amount</p>
          </div>
          <p className="text-2xl font-bold text-emerald-900">
            ${summary.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="h-4 w-4 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">Hours by User</h4>
        </div>
        <div className="space-y-2">
          {summary.hoursByUser.map((user) => (
            <div key={user.name} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{user.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((user.hours / summary.totalHours) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {user.hours.toFixed(1)}h
                </span>
              </div>
            </div>
          ))}
          {summary.hoursByUser.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No data</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">Hours by Date</h4>
        </div>
        <div className="space-y-2">
          {Object.entries(summary.hoursByDate)
            .slice(0, 7)
            .map(([date, hours]) => (
              <div key={date} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min((hours / summary.totalHours) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 w-10 text-right">
                    {hours.toFixed(1)}h
                  </span>
                </div>
              </div>
            ))}
          {Object.keys(summary.hoursByDate).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No data</p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{summary.timeLogCount} time logs</span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            ${summary.billingRate}/hr
          </span>
        </div>
      </div>
    </div>
  );
}
