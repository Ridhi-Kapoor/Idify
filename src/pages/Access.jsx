import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { ShieldCheck, Ticket } from "lucide-react";

const qrPayload = (extra) => ({
  sid: "IDIFY-2023CS0417",
  scope: ["LIB", "LAB", "EVENT"],
  extra,
  ts: Date.now(),
});

export default function Access() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Access Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>✔️ Library • 10:24 AM • Gate A</div>
          <div>✔️ ECE Lab • 11:40 AM • Door 03</div>
          <div>✔️ Auditorium • 02:10 PM • Event Pass</div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5" /> Event Pass</CardTitle>
        </CardHeader>
        <CardContent className="grid place-items-center">
          <div className="rounded-xl p-4 border bg-white">
            <QRCode value={JSON.stringify(qrPayload("TechFest-25"))} size={160} />
          </div>
          <Button className="w-full mt-3 rounded-xl">Download Pass</Button>
        </CardContent>
      </Card>
    </div>
  );
}