"use client";

import { useMemo, useState } from "react";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";


export default function JwtDecoderComponent() {
  const [token, setToken] = useState("");
  const [headerTab, setHeaderTab] = useState<"json" | "claims">("json");
  const [payloadTab, setPayloadTab] = useState<"json" | "claims">("json");


  const decodedHeader = useMemo(() => {
    if (!token) return null;
    try {
      return decodeProtectedHeader(token);
    } catch {
      return null;
    }
  }, [token]);

  const decodedPayload = useMemo(() => {
    if (!token) return null;
    try {
      return decodeJwt(token);
    } catch {
      return null;
    }
  }, [token]);

  const formatJson = (value: unknown) => {
    if (!value) return "";
    return JSON.stringify(value, null, 2);
  };

  const toClaims = (value: Record<string, unknown> | null) => {
    if (!value) return [] as Array<[string, unknown]>;
    return Object.entries(value);
  };

  const getStatusIcon = (ok: boolean | null) => {
    if (ok === true) return <CheckCircle className="text-emerald-500" size={16} />;
    if (ok === false) return <XCircle className="text-red-500" size={16} />;
    return <MinusCircle className="text-muted-foreground" size={16} />;
  };

  const isWellFormed = token.split(".").length === 3;

  return (
    <Card className="w-full p-6">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">ENCODED VALUE</Label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Valid JWT</span>
                {getStatusIcon(isWellFormed ? true : false)}
              </div>
            </div>
            <Textarea
              id="jwt-input"
              placeholder="Paste a JWT to decode and verify..."
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
              }}
              className="min-h-55 font-mono whitespace-pre-wrap break-all overflow-x-hidden [overflow-wrap:anywhere]"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setToken("")}>Clear</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">DECODED HEADER</Label>
                <div className="flex items-center gap-2">
                  <Button size="xs" variant={headerTab === "json" ? "secondary" : "outline"} onClick={() => setHeaderTab("json")}>JSON</Button>
                  <Button size="xs" variant={headerTab === "claims" ? "secondary" : "outline"} onClick={() => setHeaderTab("claims")}>CLAIMS TABLE</Button>
                </div>
              </div>
              <div className="mt-3">
                {headerTab === "json" ? (
                  <pre className="bg-muted p-3 text-xs rounded-md overflow-auto min-h-[120px]">
                    {formatJson(decodedHeader)}
                  </pre>
                ) : (
                  <div className="space-y-2 text-xs">
                    {toClaims(decodedHeader as Record<string, unknown> | null).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between border-b pb-1">
                        <span className="font-semibold">{key}</span>
                        <span className="text-muted-foreground break-all text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">DECODED PAYLOAD</Label>
                <div className="flex items-center gap-2">
                  <Button size="xs" variant={payloadTab === "json" ? "secondary" : "outline"} onClick={() => setPayloadTab("json")}>JSON</Button>
                  <Button size="xs" variant={payloadTab === "claims" ? "secondary" : "outline"} onClick={() => setPayloadTab("claims")}>CLAIMS TABLE</Button>
                </div>
              </div>
              <div className="mt-3">
                {payloadTab === "json" ? (
                  <pre className="bg-muted p-3 text-xs rounded-md overflow-auto min-h-[160px]">
                    {formatJson(decodedPayload)}
                  </pre>
                ) : (
                  <div className="space-y-2 text-xs">
                    {toClaims(decodedPayload as Record<string, unknown> | null).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between border-b pb-1">
                        <span className="font-semibold">{key}</span>
                        <span className="text-muted-foreground break-all text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
