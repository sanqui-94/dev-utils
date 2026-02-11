"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = "strategies" | "jwt-decoder" | "uuid-generator" | "json-prettifier";

interface AppNavBarProps {
  selectedItem?: NavItem;
}

const pathToNavItem: Record<string, NavItem> = {
  "/": "strategies",
  "/strategies": "strategies",
  "/jwt-decoder": "jwt-decoder",
  "/uuid-generator": "uuid-generator",
  "/json-prettifier": "json-prettifier",
};

export default function AppNavBar({ selectedItem }: AppNavBarProps) {
  const pathname = usePathname();
  const activeItem = pathToNavItem[pathname] ?? selectedItem ?? "strategies";

  return (
    <NavigationMenu className="mb-8 border-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              className={`${navigationMenuTriggerStyle()} ${activeItem === "strategies" ? "bg-primary text-primary-foreground font-semibold" : ""}`}
              href="/strategies"
              aria-current={activeItem === "strategies" ? "page" : undefined}
            >
              Strategies
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              className={`${navigationMenuTriggerStyle()} ${activeItem === "jwt-decoder" ? "bg-primary text-primary-foreground font-semibold" : ""}`}
              href="/jwt-decoder"
              aria-current={activeItem === "jwt-decoder" ? "page" : undefined}
            >
              JWT Codec
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              className={`${navigationMenuTriggerStyle()} ${activeItem === "uuid-generator" ? "bg-primary text-primary-foreground font-semibold" : ""}`}
              href="/uuid-generator"
              aria-current={activeItem === "uuid-generator" ? "page" : undefined}
            >
              UUID Generator
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              className={`${navigationMenuTriggerStyle()} ${activeItem === "json-prettifier" ? "bg-primary text-primary-foreground font-semibold" : ""}`}
              href="/json-prettifier"
              aria-current={activeItem === "json-prettifier" ? "page" : undefined}
            >
              JSON Prettifier
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
