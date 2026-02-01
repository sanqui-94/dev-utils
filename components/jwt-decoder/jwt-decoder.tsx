"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function JwtDecoderComponent() {
  const [token, setToken] = useState("");
  const [decodedPayload, setDecodedPayload] = useState<null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Example of how each component can handle its own data interactions
  useEffect(() => {
    // Load any saved tokens or settings from database if needed
    // This is where you'd call your database/API
    console.log("JWT Decoder component mounted - ready for DB integration");
  }, []);

  const decodeToken = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simple JWT decoding logic (client-side)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      const payload = JSON.parse(atob(parts[1]));
      setDecodedPayload(payload);
      
      // Here you could save the decoded result to database if needed
    } catch (err) {
      setError('Invalid JWT token');
      setDecodedPayload(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="jwt-input">JWT Token</Label>
          <Textarea
            id="jwt-input"
            placeholder="Paste your JWT token here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <Button onClick={decodeToken} disabled={!token || isLoading}>
          {isLoading ? "Decoding..." : "Decode JWT"}
        </Button>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        {decodedPayload && (
          <div>
            <Label>Decoded Payload:</Label>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(decodedPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
