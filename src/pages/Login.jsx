import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [captcha, setCaptcha] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1e23]">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl">
        
        {/* LEFT SIDE IMAGE + TITLE */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to <span className="text-blue-400">IDify Portal</span></h1>
          <p className="text-sm opacity-80">Smart Campus & Student Life Platform</p>

          <div className="mt-10">
            <div className="border border-white/20 rounded-lg px-4 py-2 text-sm">
              <p className="font-semibold text-blue-300 mb-2">ANNOUNCEMENTS</p>
              <ul className="text-white/80 text-xs space-y-1 list-disc pl-4">
                <li>Use your Enrollment Number as Login ID</li>
                <li>Stay tuned for campus updates here</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN BOX */}
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-center mb-6">Sign In to Your Account</h2>

          {/* Only Student (Parent Removed) */}
          <div className="flex items-center gap-2 justify-center text-sm mb-4">
            <input type="radio" checked readOnly />
            <span className="font-semibold">Student</span>
          </div>

          <label className="text-xs font-semibold">Enrollment Number</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Enrollment Number"
            className="mt-1 mb-4"
          />

          {/* Captcha Box */}
          <div className="text-center border rounded-lg py-3 font-mono text-lg tracking-wide bg-gray-100">
            epkxc
          </div>

          <Input placeholder="Enter the text shown in image" className="mt-2 mb-6" />

          <Button className="w-full rounded-lg">LOGIN</Button>

          <p className="text-[10px] text-gray-500 text-center mt-4">
            By continuing, you agree to the campus usage policies.
          </p>
        </div>
      </div>
    </div>
  );
}