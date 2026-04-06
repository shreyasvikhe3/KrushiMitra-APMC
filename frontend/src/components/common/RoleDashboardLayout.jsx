import React, { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LayoutDashboard,
  Sprout,
  PlusSquare,
  BadgeIndianRupee,
  Gavel,
  ShoppingBag,
  Users,
  Receipt,
  LineChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleConfigs = {
  shetkari: {
    titleKey: 'shetkari.dashboard',
    items: [
      { to: '/shetkari/dashboard', labelKey: 'shetkari.dashboard', icon: LayoutDashboard, end: true },
      { to: '/shetkari/add-crop', labelKey: 'shetkari.addCrop', icon: PlusSquare },
      { to: '/shetkari/my-crops', labelKey: 'shetkari.myCrops', icon: Sprout },
      { to: '/shetkari/market-prices', labelKey: 'shetkari.marketPrices', icon: BadgeIndianRupee },
      { to: '/shetkari/transactions', labelKey: 'shetkari.transactions', icon: Receipt }
    ]
  },
  vyapari: {
    titleKey: 'vyapari.dashboard',
    items: [
      { to: '/vyapari/dashboard', labelKey: 'vyapari.dashboard', icon: LayoutDashboard, end: true },
      { to: '/vyapari/crops', labelKey: 'vyapari.availableCrops', icon: Sprout },
      { to: '/vyapari/my-bids', labelKey: 'vyapari.myBids', icon: Gavel },
      { to: '/vyapari/purchases', labelKey: 'vyapari.purchases', icon: ShoppingBag }
    ]
  },
  karmachari: {
    titleKey: 'karmachari.dashboard',
    items: [
      { to: '/karmachari/dashboard', labelKey: 'karmachari.dashboard', icon: LayoutDashboard, end: true },
      { to: '/karmachari/users', labelKey: 'karmachari.userManagement', icon: Users },
      { to: '/karmachari/transactions', labelKey: 'karmachari.allTransactions', icon: Receipt },
      { to: '/karmachari/market-prices', labelKey: 'karmachari.marketPrices', icon: BadgeIndianRupee },
      { to: '/karmachari/reports', labelKey: 'karmachari.reports', icon: LineChart }
    ]
  }
};

const RoleDashboardLayout = ({ role }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const config = useMemo(() => roleConfigs[role], [role]);

  if (!config) return <Outlet />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_24%),linear-gradient(180deg,_#f7fbf7_0%,_#f8fafc_52%,_#eef6f2_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#111827_100%)]">
      <aside
        className={`fixed inset-y-16 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,251,246,0.98))] shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.98))] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:absolute lg:left-0 lg:top-0 lg:hidden`}
      >
        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">{t(`roles.${role}`)}</p>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t(config.titleKey)}</h2>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-emerald-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {config.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/15'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
            >
              <item.icon size={18} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-emerald-100 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <p className="font-medium text-slate-900 dark:text-white">{user?.fullName}</p>
          <p>{t(`roles.${user?.role}`)}</p>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-30 bg-slate-900/55 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-6 lg:px-4 lg:py-6">
        <aside className="hidden lg:block lg:w-72 lg:shrink-0">
          <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(243,249,244,0.92))] shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.9),rgba(15,23,42,0.92))] dark:shadow-[0_22px_60px_rgba(2,6,23,0.45)]">
            <div className="border-b border-emerald-100 px-5 py-5 dark:border-slate-800">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">{t(`roles.${role}`)}</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{t(config.titleKey)}</h2>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
              {config.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/15'
                        : 'text-slate-700 hover:bg-white hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-emerald-100 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
              <p className="font-medium text-slate-900 dark:text-white">{user?.fullName}</p>
              <p>{t(`roles.${user?.role}`)}</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-[4.5rem] z-20 border-b border-white/70 bg-white/72 px-4 py-3 backdrop-blur-xl lg:top-24 lg:rounded-[28px] lg:border lg:px-6 dark:border-slate-800 dark:bg-slate-950/72">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-700 shadow-sm lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold text-slate-900 dark:text-white">{t(config.titleKey)}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t(`roles.${role}`)}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-5 lg:px-2 lg:py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDashboardLayout;
