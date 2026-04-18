import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const ApprovalPending = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const role = location.state?.role;

  const message =
    role === 'karmachari'
      ? t('approvalPending.officerMessage')
      : t('approvalPending.defaultMessage');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#f8fff7_0%,_#eef7f1_46%,_#f8fafc_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <div className="absolute left-[10%] top-16 h-48 w-48 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-500/12 float-soft" />
      <div className="absolute bottom-10 right-[10%] h-56 w-56 rounded-full bg-amber-200/35 blur-3xl dark:bg-amber-500/10 float-soft" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-[30px] border border-white/70 bg-white/88 p-8 text-center shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/82 dark:shadow-[0_28px_80px_rgba(2,6,23,0.5)] reveal-up surface-lift">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-900/40">
            {t('approvalPending.icon')}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {t('approvalPending.badge')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">
            {t('approvalPending.title')}
          </h1>

          <p className="mt-4 text-lg font-semibold text-emerald-900 dark:text-emerald-200">
            {t('approvalPending.marathiLine')}
          </p>
          <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
            {message}
          </p>

          <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-left dark:border-emerald-900/50 dark:bg-emerald-950/25">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              {t('approvalPending.nextStepsTitle')}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
              {t('approvalPending.nextStepsText')}
            </p>
          </div>

          <Link
            to="/login"
            className="mt-8 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 btn-sheen"
          >
            {t('approvalPending.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPending;
