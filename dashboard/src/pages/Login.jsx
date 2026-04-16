import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canBootstrapAdmin, setCanBootstrapAdmin] = useState(false);

  const { login, googleLogin, getBootstrapStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBootstrapStatus = async () => {
      try {
        const response = await getBootstrapStatus();
        setCanBootstrapAdmin(Boolean(response.canBootstrapAdmin));
      } catch (err) {
        setCanBootstrapAdmin(false);
      }
    };

    loadBootstrapStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(async (googleResponse) => {
    setError('');

    if (!googleResponse?.credential) {
      setError('Google sign-in did not return a valid credential.');
      return;
    }

    setLoading(true);

    try {
      await googleLogin(googleResponse.credential);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  }, [googleLogin, navigate]);

  const inputClasses =
    'w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-900/40';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_24%),linear-gradient(180deg,_#f7fff5_0%,_#eef8f1_46%,_#f8fafc_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <div className="absolute left-[8%] top-20 h-52 w-52 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/12" />
      <div className="absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
      <div className="relative mx-auto flex max-w-6xl justify-end pb-4">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <div className="hidden lg:block">
          <span className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/70 dark:text-emerald-200">
            Admin control center
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white">
            A more polished dashboard for market operations
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Manage users, bids, prices, reports, and transactions from one refined admin workspace with responsive access.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Secure admin access</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Sign in with your admin or superadmin credentials to continue.
              </p>
            </div>
            <div className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">First-time setup</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Create the first admin or superadmin yourself when the dashboard has no admin accounts yet.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[32px] border border-white/70 bg-white/88 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/82 dark:shadow-[0_28px_80px_rgba(2,6,23,0.5)]">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-700/20">
              <LogIn className="text-white" size={30} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">KrushiMitra</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Sign in with your admin or superadmin account
            </p>
            <div className="mt-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
              >
                Go to Sign Up
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Email or Username</label>
              <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required placeholder="Enter email or username" className={inputClasses} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className={inputClasses} />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 py-3 font-semibold text-white shadow-md shadow-emerald-700/20 transition hover:translate-y-[-1px] disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <GoogleAuthButton onCredentialResponse={handleGoogleLogin} disabled={loading} />
            <p className="text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
              Only existing admin or superadmin accounts can access the dashboard with Google.
            </p>
          </form>

          <div className="mt-6">
            {canBootstrapAdmin ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                  No admin account exists yet. Create your first admin or superadmin account.
                </div>
                <Link
                  to="/signup"
                  className="block w-full rounded-2xl border border-emerald-300 bg-white px-4 py-3 text-center font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900/70 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
                >
                  Create Admin Account
                </Link>
              </div>
            ) : (
              <p className="text-center text-xs text-slate-600 dark:text-slate-400">
                Use an existing admin or superadmin account to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
