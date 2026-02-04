'use client';

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg">
              <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Project Billing System
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Track time, manage projects, calculate billing
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm py-8 px-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Demo accounts: admin@demo.com / employee@demo.com (password: demo123)
        </p>
      </div>
    </div>
  );
}
