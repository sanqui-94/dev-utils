"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function UUIDGenerator() {
  const [uuid, setUuid] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const generateUuid = () => {
    const next = crypto.randomUUID();
    setUuid(next);
    setCopyStatus("idle");
  };

  const handleCopy = async () => {
    if (!uuid) return;
    try {
      await navigator.clipboard.writeText(uuid);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("failed");
      setTimeout(() => setCopyStatus("idle"), 1500);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">GENERATED UUID</Label>
          <div className="rounded-md border bg-muted p-3 text-xs font-mono min-h-11 break-all">
            {uuid || "Click Generate to create a UUID"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {uuid ? (
            <Button variant="outline" onClick={generateUuid}>
              Generate another
            </Button>
          ) : (
            <Button onClick={generateUuid}>Generate UUID</Button>
          )}
          <Button variant="secondary" onClick={handleCopy} disabled={!uuid}>
            {copyStatus === "copied" ? "Copied!" : copyStatus === "failed" ? "Copy failed" : "Copy"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
