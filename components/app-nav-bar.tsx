import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export type NavItem = "strategies" | "jwt-decoder" | "qr-scanner";

interface AppNavBarProps {
  selectedItem: NavItem;
  onItemSelect: (item: NavItem) => void;
}

export default function AppNavBar({
  selectedItem,
  onItemSelect,
}: AppNavBarProps) {
  return (
    <NavigationMenu className="mb-8 border-2">
      <NavigationMenuList>
        <NavigationMenuItem
          className={`${navigationMenuTriggerStyle()} ${selectedItem === "strategies" ? "bg-accent" : ""}`}
          onClick={() => onItemSelect("strategies")}
        >
          Strategies
        </NavigationMenuItem>
        <NavigationMenuItem
          className={`${navigationMenuTriggerStyle()} ${selectedItem === "jwt-decoder" ? "bg-accent" : ""}`}
          onClick={() => onItemSelect("jwt-decoder")}
        >
          JWT Decoder
        </NavigationMenuItem>
        <NavigationMenuItem
          className={`${navigationMenuTriggerStyle()} ${selectedItem === "qr-scanner" ? "bg-accent" : ""}`}
          onClick={() => onItemSelect("qr-scanner")}
        >
          QR Scanner
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
