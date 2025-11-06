import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Megaphone } from "lucide-react";

const seed = [
  { id: 1, user: "AK", text: "Java Café: 20% off every Monday w/ ID!", up: 42 },
  { id: 2, user: "RS", text: "Free printing (10 pages) during Hack Week.", up: 35 },
  { id: 3, user: "MT", text: "EcoRide adds extra 5% with Green Pass.", up: 18 },
];

export default function Community() {
  const [feed, setFeed] = useState(seed);
  const [text, setText] = useState("");

  const post = () => {
    if (!text.trim()) return;
    setFeed([{ id: Date.now(), user: "YOU", text, up: 0 }, ...feed]);
    setText("");
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Community Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Share a new benefit or deal…" />
          <Button className="rounded-xl" onClick={post}><Megaphone className="h-4 w-4 mr-2" />Post</Button>
        </div>

        {feed.map(item => (
          <div key={item.id} className="border rounded-2xl p-3 flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-200 grid place-items-center text-xs font-semibold">{item.user}</div>
            <div className="flex-1">
              <div className="text-sm">{item.text}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.up} upvotes • verified by community</div>
            </div>
            <Button size="sm" variant="secondary" className="rounded-xl" onClick={() => {
              setFeed(feed.map(f => f.id === item.id ? { ...f, up: f.up + 1 } : f));
            }}>Upvote</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}