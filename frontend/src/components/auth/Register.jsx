import React, { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import GoogleAuthButton from './GoogleAuthButton';

const Register = () => {
  const { t } = useTranslation();
  const { register, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    role: ''
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.role) {
      toast.error(t('auth.selectRole'));
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      toast.success(result.data.message || t('auth.registerSuccess'));
      if (result.data.isApproved) {
        navigateByRole(result.data.role);
      } else {
        navigate('/approval-pending', { state: { message: result.data.message } });
      }
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  const handleGoogleRegister = useCallback(async (googleResponse) => {
    if (!formData.role) {
      toast.error('Select a role before continuing with Google');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Phone number is required for Google registration');
      return;
    }

    if (!googleResponse?.credential) {
      toast.error('Google sign-in did not return a valid credential');
      return;
    }

    setGoogleLoading(true);
    const result = await googleAuth({
      credential: googleResponse.credential,
      createIfMissing: true,
      role: formData.role,
      phone: formData.phone,
      address: formData.address,
      fullName: formData.fullName,
      username: formData.username
    });

    if (result.success) {
      toast.success(result.data.message || 'Google account connected successfully');
      if (result.data.isApproved) {
        navigateByRole(result.data.role);
      } else {
        navigate('/approval-pending', { state: { message: result.data.message } });
      }
    } else {
      toast.error(result.error);
    }

    setGoogleLoading(false);
  }, [formData, googleAuth, navigateByRole]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(180deg,_#f8fff7_0%,_#eef7f1_46%,_#f8fafc_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <div className="absolute left-[10%] top-16 h-56 w-56 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-500/12" />
      <div className="absolute bottom-10 right-[8%] h-64 w-64 rounded-full bg-sky-200/35 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_40%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full items-center gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden xl:block">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/65 dark:text-emerald-200">
                Join the platform
              </span>
              <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                Create your KrushiMitra workspace
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Register once and start using a cleaner digital flow for farmer listings, trader bids, and officer operations.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_20px_45px_rgba(2,6,23,0.4)]">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Simple onboarding</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Choose your role and get access to the tools designed for your workflow.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_20px_45px_rgba(2,6,23,0.4)]">
                  <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Responsive and modern</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Your account works across mobile, tablet, and desktop with multilingual support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="w-full border-white/70 bg-white/88 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-[0_28px_80px_rgba(2,6,23,0.5)]">
            <CardHeader className="space-y-2">
              <CardTitle className="text-center font-display text-3xl font-bold text-slate-900 dark:text-white">
                {t('app.title')}
              </CardTitle>
              <CardDescription className="text-center text-base text-slate-600 dark:text-slate-300">
                {t('auth.register')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-200">
                      {t('auth.fullName')}
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={t('auth.fullName')}
                      className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>

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
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('auth.email')}
                      className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 dark:text-slate-200">
                      {t('auth.phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('auth.phone')}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-200">
                      {t('auth.confirmPassword')}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder={t('auth.confirmPassword')}
                      className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-slate-700 dark:text-slate-200">
                      {t('auth.address')}
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t('auth.address')}
                      className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="role" className="text-slate-700 dark:text-slate-200">
                      {t('auth.role')}
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white">
                        <SelectValue placeholder={t('auth.selectRole')} />
                      </SelectTrigger>
                      <SelectContent className="dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        <SelectItem value="shetkari">{t('roles.shetkari')}</SelectItem>
                        <SelectItem value="vyapari">{t('roles.vyapari')}</SelectItem>
                        <SelectItem value="karmachari">{t('roles.karmachari')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.registerButton')}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  Or register with
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              <GoogleAuthButton
                onCredentialResponse={handleGoogleRegister}
                text="signup_with"
                disabled={googleLoading}
              />
              <p className="mt-3 text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
                Choose your role and phone number first. We will create the account using your Google email.
              </p>

              <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                  {t('auth.login')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
