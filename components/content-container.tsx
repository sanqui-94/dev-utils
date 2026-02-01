import { NavItem } from "./app-nav-bar";
import StrategyCard from "./strategies/card";
import JwtDecoderComponent from "./jwt-decoder/jwt-decoder";
import QrScannerComponent from "./qr-scanner/qr-scanner";

interface ContentContainerProps {
  selectedItem: NavItem;
}

interface ContentConfig {
  component: React.ComponentType;
  title: string;
  description?: string;
}

// Extensible mapping system for nav items to components with metadata
const contentComponents: Record<NavItem, ContentConfig> = {
  'strategies': {
    component: StrategyCard,
    title: "Oblique Strategies",
    description: "A different approach to creative problem solving"
  },
  'jwt-decoder': {
    component: JwtDecoderComponent,
    title: "JWT Token Decoder",
    description: "Decode and inspect JSON Web Tokens"
  },
  'qr-scanner': {
    component: QrScannerComponent,
    title: "QR Code Scanner",
    description: "Scan and manage QR codes"
  },
};

export default function ContentContainer({ selectedItem }: ContentContainerProps) {
  const contentConfig = contentComponents[selectedItem];
  
  if (!contentConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Content Not Available
          </h2>
          <p className="text-sm text-muted-foreground">
            The requested section is not yet implemented.
          </p>
        </div>
      </div>
    );
  }

  const { component: Component, title, description } = contentConfig;

  return (
    <div className="w-full space-y-6">
      {/* Content Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex justify-center">
        <Component />
      </div>
    </div>
  );
}
