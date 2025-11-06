// src/pages/Dashboard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import QRCode from "react-qr-code";
import {
  Wallet, BarChart3, Calendar, Bell, QrCode, Gift, Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const savingsData = [
  { month: "Jun", saved: 1800 },
  { month: "Jul", saved: 2100 },
  { month: "Aug", saved: 1200 },
  { month: "Sep", saved: 2400 },
  { month: "Oct", saved: 3000 },
  { month: "Nov", saved: 2650 },
];

const qrPayload = {
  sid: "IDIFY-2023CS0417",
  scope: ["LIB", "LAB", "EVENT"],
  ts: Date.now(),
};

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border shadow-sm backdrop-blur",
        "bg-white/70 dark:bg-slate-800/60",
        "border-white/60 dark:border-slate-700/40",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-4">
      {/* Hero banner */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-semibold leading-tight">Welcome back 👋</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Track your points, perks and passes at a glance.
              </div>
            </div>
          </div>
          <Button className="rounded-xl">View Rewards</Button>
        </div>
      </GlassCard>

      {/* Stats row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Points */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-indigo-600" /> Campus Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                860
              </div>
              <Badge variant="secondary" className="rounded-xl">+40 this week</Badge>
            </div>
            <div className="mt-3">
              <Progress value={72} />
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                72% to next reward: Free Coffee
              </p>
            </div>
          </CardContent>
        </GlassCard>

        {/* Savings chart */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-violet-600" /> Savings (6 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="saved" stroke="#8b5cf6" fill="url(#gradDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </GlassCard>

        {/* Smart Pass */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-fuchsia-600" /> Smart Pass
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-xl p-3 border bg-white grid place-items-center">
              <QRCode
                value={JSON.stringify(qrPayload)}
                size={120}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <div className="text-sm">
              <p className="text-slate-600 dark:text-slate-300">Scan for library, labs & events</p>
              <Button size="sm" className="rounded-xl mt-2">Add to Wallet</Button>
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Quick actions / Today / Announcements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Button variant="secondary" className="rounded-xl">View Discounts</Button>
            <Button variant="secondary" className="rounded-xl">Rewards</Button>
            <Button variant="secondary" className="rounded-xl">Access Logs</Button>
            <Button variant="secondary" className="rounded-xl">Community</Button>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" /> Today
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>10:00 • DBMS Lecture • Block A</div>
            <div>13:00 • AI Club Meetup • Auditorium</div>
            <div>16:30 • Gym Slot</div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-fuchsia-600" /> Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>Library extends hours during exams.</div>
            <div>EcoRide: extra 5% off with Green Pass.</div>
            <div>TechFest tickets open Friday.</div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Reward banner */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl grid place-items-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Gift className="h-6 w-6" />
            </div>
            <div className="text-sm">
              <div className="font-medium">You’re close to a reward</div>
              <div className="text-slate-600 dark:text-slate-300">Redeem a coffee at 900 points</div>
            </div>
          </div>
          <Button className="rounded-xl">Open Rewards</Button>
        </div>
      </GlassCard>
    </div>
  );
}