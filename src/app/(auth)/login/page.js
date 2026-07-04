import Link from 'next/link';

export const metadata = {
  title: 'Login – SPRO Dashboard',
  description: 'Sign in to your SPRO Dashboard account',
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0" />
      </div>

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/20 bg-white/90 shadow-[0_20px_70px_rgba(2,6,23,0.3)] backdrop-blur-xl lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[280px] overflow-hidden lg:flex">
          <img
            src="/assets/img/backgrounds/login_img.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-100">
              SPRO Operations
            </div>
            <p className="mt-2 max-w-md text-sm text-slate-200/90">
              Monitor progress, review targets, and manage reports from one elegant dashboard.
            </p>
          </div>
        </div>

        <div className="w-full bg-white/95 p-6 sm:p-7 lg:p-8">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-base font-semibold text-white shadow-lg shadow-sky-200">
              SPRO
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue your operations dashboard
            </p>
          </div>

          <form action="/home" method="get" className="mt-6 space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email or Username
              </label>
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
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 lg:text-left">
            New here?{' '}
            <Link href="/register" className="font-semibold text-sky-600 hover:text-sky-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
