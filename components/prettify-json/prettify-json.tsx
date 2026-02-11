"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const errorMessage =
  "there was an unexpected error with the conversion, please try again later.";

type CopyStatus = "idle" | "copied" | "failed";

export default function PrettifyJson() {
  const [input, setInput] = useState("");
  const [lastAttemptedInput, setLastAttemptedInput] = useState("");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const hasInput = input.trim().length > 0;
  const isPrettifyDisabled = !hasInput;

  const handlePrettify = () => {
    if (!hasInput) return;
    if (input === lastAttemptedInput) return;

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setLastAttemptedInput(formatted);
      setError("");
      setCopyStatus("idle");
    } catch {
      setError(errorMessage);
      setLastAttemptedInput(input);
    }
  };

  const handleCopy = async () => {
    if (!hasInput) return;

    try {
      await navigator.clipboard.writeText(input);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  const handleClear = () => {
    setInput("");
    setLastAttemptedInput("");
    setError("");
    setCopyStatus("idle");
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold" htmlFor="json-prettifier">
            JSON INPUT
          </Label>
          <Textarea
            id="json-prettifier"
            placeholder="Paste JSON to prettify..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
              setCopyStatus("idle");
            }}
            className="min-h-60 font-mono whitespace-pre-wrap"
          />
        </div>

        {error ? (
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePrettify} disabled={isPrettifyDisabled}>
            Prettify
          </Button>
          <Button variant="secondary" onClick={handleCopy} disabled={!hasInput}>
            {copyStatus === "copied"
              ? "Copied!"
              : copyStatus === "failed"
              ? "Copy failed"
              : "Copy"}
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={!hasInput}>
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
