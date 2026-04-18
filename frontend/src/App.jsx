import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import './App.css';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleDashboardLayout from './components/common/RoleDashboardLayout';
import HomeMarketTicker from './components/common/HomeMarketTicker';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ApprovalPending from './components/auth/ApprovalPending';

import ShetkariDashboard from './components/shetkari/ShetkariDashboard';
import AddCrop from './components/shetkari/AddCrop';
import MyCrops from './components/shetkari/MyCrops';
import ViewBids from './components/shetkari/ViewBids';
import TransactionHistory from './components/shetkari/TransactionHistory';
import MarketPrices from './components/shetkari/MarketPrices';

import VyapariDashboard from './components/vyapari/VyapariDashboard';
import AvailableCrops from './components/vyapari/AvailableCrops';
import PlaceBid from './components/vyapari/PlaceBid';
import MyBids from './components/vyapari/MyBids';
import PurchaseHistory from './components/vyapari/PurchaseHistory';

import KarmachariDashboard from './components/karmachari/KarmachariDashboard';
import UserManagement from './components/karmachari/UserManagement';
import AllTransactions from './components/karmachari/AllTransactions';
import Reports from './components/karmachari/Reports';
import UpdateMarketPrices from './components/karmachari/UpdateMarketPrices';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_30%),linear-gradient(180deg,_#f6fff3_0%,_#eef8f1_48%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(135deg,rgba(34,197,94,0.16),rgba(22,101,52,0))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(2,6,23,0))]" />
      <div className="absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10 float-soft" />

      <div className="container relative mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl reveal-up">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/70 dark:text-emerald-200">
              {t('home.badge')}
            </span>
            <h1
              className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
              data-testid="home-page"
            >
              {t('home.marathiTitle')}
            </h1>
            <h2 className="mt-4 max-w-2xl text-2xl font-semibold text-emerald-900 sm:text-3xl dark:text-emerald-200">
              {t('home.englishTitle')}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">{t('home.description1')}</p>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">{t('home.description2')}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 btn-sheen"
              >
                {t('home.loginCta')}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white/85 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white dark:border-emerald-900/60 dark:bg-slate-900/75 dark:text-emerald-100 dark:hover:bg-slate-900 btn-sheen"
              >
                {t('home.registerCta')}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_20px_55px_rgba(2,6,23,0.4)] surface-lift reveal-up reveal-delay-1">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{t('home.stats.availabilityTitle')}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('home.stats.availabilityText')}</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_20px_55px_rgba(2,6,23,0.4)] surface-lift reveal-up reveal-delay-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{t('home.stats.rolesTitle')}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('home.stats.rolesText')}</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_20px_55px_rgba(2,6,23,0.4)] surface-lift reveal-up reveal-delay-3">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{t('home.stats.marketTitle')}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('home.stats.marketText')}</p>
              </div>
            </div>
          </div>

          <div className="relative reveal-up reveal-delay-2">
            <div className="absolute -left-8 top-8 hidden h-24 w-24 rounded-full bg-amber-300/40 blur-2xl lg:block float-soft" />
            <div className="absolute -right-6 bottom-10 hidden h-32 w-32 rounded-full bg-emerald-300/40 blur-2xl lg:block float-soft" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-slate-900 px-6 py-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:px-8 sm:py-8 dark:border-slate-700/60 dark:bg-slate-950 dark:shadow-[0_32px_90px_rgba(2,6,23,0.55)] surface-lift">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_30%),linear-gradient(180deg,_rgba(16,185,129,0.22),_transparent_60%)]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">{t('home.panel.tag')}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{t('home.panel.title')}</h3>
                  </div>
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100">
                    {t('home.panel.badge')}
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur surface-lift">
                    <p className="text-sm text-emerald-100">{t('home.panel.farmerTitle')}</p>
                    <p className="mt-2 text-lg font-semibold">{t('home.panel.farmerText')}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur surface-lift">
                    <p className="text-sm text-amber-100">{t('home.panel.traderTitle')}</p>
                    <p className="mt-2 text-lg font-semibold">{t('home.panel.traderText')}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur surface-lift">
                    <p className="text-sm text-sky-100">{t('home.panel.officerTitle')}</p>
                    <p className="mt-2 text-lg font-semibold">{t('home.panel.officerText')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 reveal-up reveal-delay-1">
          <HomeMarketTicker />
        </section>

        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group rounded-[28px] border border-emerald-100 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_22px_55px_rgba(2,6,23,0.35)] surface-lift reveal-up reveal-delay-1">
            <div className="inline-flex rounded-2xl bg-emerald-100 px-4 py-3 text-2xl text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200">{t('home.cards.farmerLabel')}</div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{t('home.cards.farmerTitle')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('home.cards.farmerText')}</p>
          </div>
          <div className="group rounded-[28px] border border-amber-100 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_22px_55px_rgba(2,6,23,0.35)] surface-lift reveal-up reveal-delay-2">
            <div className="inline-flex rounded-2xl bg-amber-100 px-4 py-3 text-2xl text-amber-950 dark:bg-amber-950/60 dark:text-amber-200">{t('home.cards.traderLabel')}</div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{t('home.cards.traderTitle')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('home.cards.traderText')}</p>
          </div>
          <div className="group rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_22px_55px_rgba(2,6,23,0.35)] surface-lift reveal-up reveal-delay-3">
            <div className="inline-flex rounded-2xl bg-sky-100 px-4 py-3 text-2xl text-sky-950 dark:bg-sky-950/60 dark:text-sky-200">{t('home.cards.officerLabel')}</div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{t('home.cards.officerTitle')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('home.cards.officerText')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App flex min-h-screen flex-col bg-transparent">
          <Navbar />
          <Toaster position="top-right" richColors />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/approval-pending" element={<ApprovalPending />} />

              <Route
                path="/shetkari"
                element={
                  <ProtectedRoute allowedRoles={['shetkari']}>
                    <RoleDashboardLayout role="shetkari" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<ShetkariDashboard />} />
                <Route path="add-crop" element={<AddCrop />} />
                <Route path="my-crops" element={<MyCrops />} />
                <Route path="bids/:cropId" element={<ViewBids />} />
                <Route path="transactions" element={<TransactionHistory />} />
                <Route path="market-prices" element={<MarketPrices />} />
              </Route>

              <Route
                path="/vyapari"
                element={
                  <ProtectedRoute allowedRoles={['vyapari']}>
                    <RoleDashboardLayout role="vyapari" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<VyapariDashboard />} />
                <Route path="crops" element={<AvailableCrops />} />
                <Route path="place-bid/:cropId" element={<PlaceBid />} />
                <Route path="my-bids" element={<MyBids />} />
                <Route path="purchases" element={<PurchaseHistory />} />
              </Route>

              <Route
                path="/karmachari"
                element={
                  <ProtectedRoute allowedRoles={['karmachari']}>
                    <RoleDashboardLayout role="karmachari" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<KarmachariDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="transactions" element={<AllTransactions />} />
                <Route path="reports" element={<Reports />} />
                <Route path="market-prices" element={<UpdateMarketPrices />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
