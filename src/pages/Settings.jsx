import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle"; // your toggle

export default function Settings() {
  const enroll = localStorage.getItem("enroll") || "ID-STUDENT";
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <div className="font-medium">Profile</div>
          <div className="text-muted-foreground">Enrollment: {enroll}</div>
        </div>
        <div>
          <div className="font-medium mb-2">Theme</div>
          <ThemeToggle />
        </div>
        <Button className="rounded-xl" onClick={() => alert("Saved!")}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}