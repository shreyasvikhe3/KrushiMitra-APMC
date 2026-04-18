import React, { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import GoogleAuthButton from './GoogleAuthButton';

const Login = () => {
  const { t } = useTranslation();
  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigateByRole = useCallback((role) => {
    if (role === 'shetkari') {
      navigate('/shetkari/dashboard');
    } else if (role === 'vyapari') {
      navigate('/vyapari/dashboard');
    } else if (role === 'karmachari') {
      navigate('/karmachari/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      toast.success(t('auth.loginSuccess'));
      navigateByRole(result.data.role);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = useCallback(async (googleResponse) => {
    if (!googleResponse?.credential) {
      toast.error('Google sign-in did not return a valid credential');
      return;
    }

    setGoogleLoading(true);
    const result = await googleAuth({
      credential: googleResponse.credential,
      createIfMissing: true,
      role: 'shetkari'
    });

    if (result.success) {
      if (result.data?.isApproved) {
        toast.success(t('auth.loginSuccess'));
        navigateByRole(result.data.role);
      } else {
        toast.success(result.data?.message || 'Google account created successfully');
        navigate('/approval-pending', { state: { role: result.data?.role } });
      }
    } else {
      toast.error(result.error);
    }

    setGoogleLoading(false);
  }, [googleAuth, navigateByRole, t]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#f8fff7_0%,_#eef7f1_46%,_#f8fafc_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <div className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/12 float-soft" />
      <div className="absolute bottom-10 right-[10%] h-56 w-56 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10 float-soft" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_40%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_460px]">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/65 dark:text-emerald-200">
                Secure access
              </span>
              <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                Welcome back to {t('app.title')}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Sign in to continue managing crops, bids, prices, and APMC operations from one clean dashboard.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_20px_45px_rgba(2,6,23,0.4)]">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Live market access</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Track updated officer-set market prices and ongoing activity.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_20px_45px_rgba(2,6,23,0.4)]">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Role-based workflow</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Farmers, traders, and officers each get the right tools after login.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="w-full border-white/70 bg-white/88 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-[0_28px_80px_rgba(2,6,23,0.5)] reveal-up surface-lift">
            <CardHeader className="space-y-2">
              <CardTitle className="text-center font-display text-3xl font-bold text-slate-900 dark:text-white">
                {t('app.title')}
              </CardTitle>
              <CardDescription className="text-center text-base text-slate-600 dark:text-slate-300">
                {t('auth.login')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 dark:text-slate-200">
                    {t('auth.username')}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={t('auth.username')}
                    className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-200">
                    {t('auth.password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t('auth.password')}
                    className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button type="submit" className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 btn-sheen" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.loginButton')}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              <GoogleAuthButton
                onCredentialResponse={handleGoogleLogin}
                disabled={googleLoading}
              />
              <p className="mt-3 text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
                New Google emails will create a farmer account automatically. Trader and officer accounts should still use the registration form.
              </p>

              <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/register" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                  {t('auth.register')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
