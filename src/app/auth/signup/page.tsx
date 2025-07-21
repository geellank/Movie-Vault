// src/app/auth/signup/page.jsx

'use client'; // This directive makes the component a Client Component,
              // allowing the use of hooks like useState and useEffect.

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ini adalah placeholder. Di masa depan, di sinilah Anda akan
    // memanggil fungsi pendaftaran Firebase Anda, misalnya:
    // createUserWithEmailAndPassword(auth, email, password);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert('Sign Up attempted with: ' + email);
    console.log('Sign Up attempt:', { email, password });

    // Untuk saat ini, tidak ada logika pendaftaran sebenarnya.
    // Anda bisa mengarahkan pengguna ke halaman login atau home setelah "percobaan"
    // pendaftaran jika diinginkan.
    // router.push('/auth/login'); // Contoh: Arahkan ke halaman login
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl border border-gray-700">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">Sign Up</h2>
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
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-amber-500 hover:text-amber-400"
            >
              Login
            </Link>
          </p>
        </div>
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