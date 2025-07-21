// src/app/auth/login/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login attempted with: ' + email + ' and ' + password);
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl border border-gray-700">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-400">
            Don&apos;t have an account?{' '} {/* BARIS 74: UBAH ' menjadi &apos; */}
            <Link
              href="/auth/signup"
              className="font-medium text-amber-500 hover:text-amber-400"
            >
              Sign up
            </Link>
          </p>
        </div>
        {/* BARIS 198: Anda tidak memiliki 198 baris di sini dalam kode yang Anda berikan,
            tapi jika ada string dengan " atau ' dalam JSX, terapkan hal yang sama.
            Misalnya, jika ada seperti ini:
            <p>Ini adalah "sebuah contoh".</p>
            Ubah menjadi:
            <p>Ini adalah &quot;sebuah contoh&quot;.</p>
        */}
        <div className="mt-4 text-center text-sm">
          <Link
            href="/"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}