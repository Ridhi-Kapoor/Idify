import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react"; // ✅ added
import { ensureSignedIn } from "@/lib/firebase"; // ✅ added
import PortalLayout from "@/layouts/PortalLayout";

import Dashboard from "@/pages/Dashboard";
import Discounts from "@/pages/Discounts";
import Access from "@/pages/Access";
import Community from "@/pages/Community";
import Rewards from "@/pages/Rewards";
import Settings from "@/pages/Settings";
import MapApp from "@/pages/Map";

export default function App() {

  // ✅ silently sign in with Firebase (no UI change)
  useEffect(() => {
    ensureSignedIn();
  }, []);

  return (
    <Routes>
      <Route element={<PortalLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path="/access" element={<Access />} />
        <Route path="/community" element={<Community />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<MapApp />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
