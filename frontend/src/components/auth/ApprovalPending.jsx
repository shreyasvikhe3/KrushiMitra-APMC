import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ApprovalPending = () => {
  const location = useLocation();
  const message = location.state?.message || 'Your request is sent to the officer. Contact APMC for approval.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Registration Request Sent</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          {message}
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ApprovalPending;
