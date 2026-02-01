"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function QrScannerComponent() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<string[]>([]);

  // Example of component-level data management
  useEffect(() => {
    // Load scan history from database
    // This is where you'd fetch user's previous scans
    console.log("QR Scanner component mounted - ready for DB integration");
    
    // Example: Load scan history from database
    // const loadScanHistory = async () => {
    //   const history = await fetchScanHistory();
    //   setScanHistory(history);
    // };
    // loadScanHistory();
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    // In a real implementation, this would access the camera
    // For now, we'll simulate a scan after a delay
    setTimeout(() => {
      const mockScanResult = "https://example.com/qr-code-result";
      setScannedData(mockScanResult);
      setScanHistory(prev => [mockScanResult, ...prev.slice(0, 9)]); // Keep last 10
      setIsScanning(false);
      
      // Here you would save the scan result to database
      // saveScanResult(mockScanResult);
    }, 2000);
  };

  const clearHistory = () => {
    setScanHistory([]);
    // Also clear from database
    // clearScanHistoryFromDB();
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">QR Code Scanner</h3>
          
          {!isScanning ? (
            <Button onClick={startScanning} size="lg">
              Start Scanning
            </Button>
          ) : (
            <div className="p-8 border-2 border-dashed border-muted-foreground rounded-lg">
              <div className="text-muted-foreground">Scanning for QR code...</div>
              <div className="mt-2 text-sm">Point your camera at a QR code</div>
            </div>
          )}
        </div>
        
        {scannedData && (
          <div>
            <Label>Latest Scan Result:</Label>
            <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
              {scannedData}
            </div>
          </div>
        )}
        
        {scanHistory.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Scan History:</Label>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear History
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {scanHistory.map((scan, index) => (
                <div key={index} className="bg-muted p-2 rounded text-sm font-mono break-all">
                  {scan}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
