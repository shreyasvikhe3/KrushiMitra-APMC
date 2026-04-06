import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await forgotPassword(formData.email);

    if (result.success) {
      toast.success(result.data.message);
      setStep(2);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await resetPassword(formData.email, formData.otp, formData.newPassword);

    if (result.success) {
      toast.success(result.data.message);
      navigate('/login');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_24%),linear-gradient(180deg,_#f8fff7_0%,_#eef7f1_46%,_#f8fafc_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <div className="absolute left-[9%] top-20 h-52 w-52 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-500/12" />
      <div className="absolute bottom-10 right-[10%] h-60 w-60 rounded-full bg-sky-200/35 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_40%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_440px]">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/65 dark:text-emerald-200">
                Account recovery
              </span>
              <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                Reset access without losing your workflow
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Verify your email, confirm the OTP, and set a new password to get back into KrushiMitra quickly.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_20px_45px_rgba(2,6,23,0.4)]">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Step 1</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Request an OTP using your registered email address.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_20px_45px_rgba(2,6,23,0.4)]">
                  <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Step 2</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Verify the OTP and create a new secure password.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="w-full border-white/70 bg-white/88 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-[0_28px_80px_rgba(2,6,23,0.5)]">
            <CardHeader className="space-y-2">
              <CardTitle className="text-center font-display text-3xl font-bold text-slate-900 dark:text-white">
                {t('auth.resetPassword')}
              </CardTitle>
              <CardDescription className="text-center text-base text-slate-600 dark:text-slate-300">
                {step === 1 ? t('auth.sendOTP') : t('auth.verifyOTP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
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

                  <Button type="submit" className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800" disabled={loading}>
                    {loading ? t('common.loading') : t('auth.sendOTP')}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-slate-700 dark:text-slate-200">
                      OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      required
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      placeholder="Enter OTP"
                      className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-700 dark:text-slate-200">
                      {t('auth.newPassword')}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder={t('auth.newPassword')}
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

                  <Button type="submit" className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800" disabled={loading}>
                    {loading ? t('common.loading') : t('auth.resetPassword')}
                  </Button>
                </form>
              )}

              <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
                <Link to="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                  {t('common.back')} {t('auth.login')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
