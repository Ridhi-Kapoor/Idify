import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import DiscountMap from "@/components/ui/DiscountMap.jsx";

const discounts = [
  { name: "Java Café", offer: "15% off", distance: "200 m", tag: "Cafe",      lat: 28.5453, lng: 77.1926 },
  { name: "PaperTrail Stationery", offer: "10% off", distance: "350 m", tag: "Stationery", lat: 28.5461, lng: 77.1914 },
  { name: "GreenWheels", offer: "₹20 off rides", distance: "0.8 km", tag: "Transport",    lat: 28.5470, lng: 77.1902 },
  { name: "CineHub", offer: "Student Fri – ₹99", distance: "1.2 km", tag: "Cinema",       lat: 28.5491, lng: 77.1890 },
];

export default function Discounts() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Nearby Student Discounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* List + search */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Search places, offers…" />
              <Button variant="secondary">Search</Button>
            </div>
            <div className="space-y-3">
              {discounts.map((d, i) => (
                <div key={i} className="border rounded-2xl p-3 hover:shadow-sm transition">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{d.name}</div>
                    <Badge className="rounded-xl">{d.offer}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> {d.distance}
                    <Badge variant="outline" className="rounded-xl">{d.tag}</Badge>
                  </div>
                  <Button size="sm" className="mt-3 rounded-xl">Get Directions</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 border rounded-2xl p-3 bg-gradient-to-br from-slate-50 to-white">
            <DiscountMap places={discounts} />
            <p className="text-xs text-muted-foreground mt-2">Tip: Share new discounts in Community to verify & pin.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}