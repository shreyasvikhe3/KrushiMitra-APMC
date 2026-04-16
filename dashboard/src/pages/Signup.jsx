import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const initialForm = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  address: '',
  role: 'superadmin'
};

const Signup = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [statusError, setStatusError] = useState('');
  const [canBootstrapAdmin, setCanBootstrapAdmin] = useState(false);

  const { bootstrapAdmin, getBootstrapStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBootstrapStatus = async () => {
      try {
        const response = await getBootstrapStatus();
        setCanBootstrapAdmin(Boolean(response.canBootstrapAdmin));
        setStatusError('');
      } catch (err) {
        setCanBootstrapAdmin(false);
        setStatusError('Unable to check admin sign-up availability right now. Make sure the backend is running and reachable.');
      } finally {
        setCheckingStatus(false);
      }
    };

    loadBootstrapStatus();
  }, [getBootstrapStatus]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await bootstrapAdmin(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to create the admin account.');
    } finally {
      setLoading(false);
    }
  };

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
            Dashboard signup
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white">
            Create the first dashboard admin on your own terms
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Use this one-time setup screen to create the first admin or superadmin account for the dashboard when no admin account exists yet.
          </p>
        </div>

        <div className="w-full rounded-[32px] border border-white/70 bg-white/88 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/82 dark:shadow-[0_28px_80px_rgba(2,6,23,0.5)]">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-700/20">
              <ShieldCheck className="text-white" size={30} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">Create Dashboard Admin</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Set up your own admin or superadmin account for dashboard access.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          {checkingStatus ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              Checking sign-up availability...
            </div>
          ) : statusError ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {statusError}
              </div>
              <Link
                to="/"
                className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/70"
              >
                Back to Login
              </Link>
            </div>
          ) : canBootstrapAdmin ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                No admin account exists in the database yet. This form can be used once to create your own admin or superadmin login.
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
                <select value={form.role} onChange={(e) => handleChange('role', e.target.value)} className={inputClasses}>
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
                <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required className={inputClasses} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
                <input type="text" value={form.username} onChange={(e) => handleChange('username', e.target.value)} required className={inputClasses} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required className={inputClasses} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required className={inputClasses} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Address</label>
                <input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className={inputClasses} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                <input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required minLength={6} className={inputClasses} />
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 py-3 font-semibold text-white shadow-md shadow-emerald-700/20 transition hover:translate-y-[-1px] disabled:opacity-50">
                {loading ? 'Creating account...' : 'Create Admin Account'}
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                Admin sign-up is no longer available because an admin or superadmin account already exists.
              </div>
              <Link
                to="/"
                className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/70"
              >
                Back to Login
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
