import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Rewards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" /> Redeem Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Free Coffee @ Java Café</span>
            <Button size="sm" className="rounded-xl">Redeem (300)</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Printing Credits (10 pages)</span>
            <Button size="sm" variant="secondary" className="rounded-xl">Redeem (150)</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>TechFest Pass</span>
            <Button size="sm" variant="outline" className="rounded-xl">Save (500)</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Points Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div>Total points: <span className="font-bold">860</span></div>
          <div className="text-muted-foreground">You’re 40 points away from a free coffee.</div>
        </CardContent>
      </Card>
    </div>
  );
}