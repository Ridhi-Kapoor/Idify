// src/layouts/PortalLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard, MapPin, ShieldCheck, Users, Gift, Settings,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/discounts", label: "Nearby Discounts", icon: MapPin },
  { to: "/access", label: "Access", icon: ShieldCheck },
  { to: "/community", label: "Community", icon: Users },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function PortalLayout() {
  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100"
      style={{
        background:
          "radial-gradient(40rem 40rem at -20% -10%, #dbeafe40, transparent), radial-gradient(40rem 40rem at 120% -10%, #fce7f340, transparent)",
      }}
    >
      {/* Header */}
      <header className="h-16 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 grid place-items-center text-sm font-bold">
              ID
            </div>
            <div className="leading-tight">
              <div className="text-sm opacity-90">IDify • Smart Campus</div>
              <div className="text-lg font-semibold tracking-tight">Student Portal</div>
            </div>
          </div>
          <div className="text-sm opacity-90">Nov ’25 • v1.0</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 flex gap-4 py-4">
        {/* Sidebar (glass) */}
        <aside className="w-64 rounded-2xl backdrop-blur bg-white/60 dark:bg-slate-800/60 shadow-sm border border-white/50 dark:border-slate-700/40">
          <nav className="p-3 space-y-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition",
                    "hover:bg-black/5 dark:hover:bg-white/5",
                    isActive
                      ? "bg-black/5 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10"
                      : "",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}