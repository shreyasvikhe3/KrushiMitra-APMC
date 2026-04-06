import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Wheat,
  Gavel,
  Receipt,
  TrendingUp,
  Settings,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { key: 'dashboard', path: '/', icon: LayoutDashboard },
    { key: 'users', path: '/users', icon: Users },
    { key: 'crops', path: '/crops', icon: Wheat },
    { key: 'bids', path: '/bids', icon: Gavel },
    { key: 'transactions', path: '/transactions', icon: Receipt },
    { key: 'marketPrices', path: '/market-prices', icon: TrendingUp },
    { key: 'settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-[linear-gradient(180deg,#052e16_0%,#0f172a_42%,#020617_100%)] text-white shadow-2xl transition-transform duration-300 lg:w-64 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-emerald-300">KrushiMitra</h1>
          <p className="mt-1 text-sm text-slate-400">{t('adminPanel')}</p>
        </div>
        <button
          type="button"
          className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto pb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `mx-3 flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-white shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-400/30'
                  : 'text-slate-200 hover:bg-white/10'
              }`
            }
            data-testid={`sidebar-${item.key.toLowerCase()}`}
          >
            <item.icon size={20} />
            <span>{t(item.key)}</span>
          </NavLink>
        ))}

        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="mx-3 mt-4 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-200 transition-colors hover:bg-white/10"
          data-testid="logout-button"
        >
          <LogOut size={20} />
          <span>{t('logout')}</span>
        </button>
      </nav>

      <div className="border-t border-white/10 bg-slate-950/65 p-6">
        <p className="text-xs text-slate-500">{t('version')}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
