'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { register } from '@/services/authService';
import { RegisterInput } from '@/types';

interface SignupFormData {
  email: string;
  password: string;
  name: string;
  role: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register: registerField, handleSubmit, formState: { errors } } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await register({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role as 'ADMIN' | 'EMPLOYEE',
      });
      localStorage.setItem('auth_token', response.token);
      router.push('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Project Billing System
          </h1>
          <h2 className="mt-6 text-center text-xl font-semibold text-gray-700">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <Input
            label="Full Name"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...registerField('name', { required: 'Name is required' })}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...registerField('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter password (min 6 characters)"
            error={errors.password?.message}
            {...registerField('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              {...registerField('role')}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
