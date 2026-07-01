import Link from 'next/link';

export const metadata = {
  title: 'Login – SPRO Dashboard',
  description: 'Sign in to your SPRO Dashboard account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_55%,_#e2e8f0)] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-200 backdrop-blur">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-lg font-semibold text-white shadow-lg shadow-sky-200">
            S
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue your operations dashboard</p>
        </div>

        <form action="/home" method="get" className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email or Username</label>
            <input
              id="email"
              name="email-username"
              type="text"
              autoFocus
              placeholder="Enter your email or username"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-sky-500 focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link href="/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
