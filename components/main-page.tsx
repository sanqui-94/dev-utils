"use client";

import { useState } from "react";
import AppNavBar, { NavItem } from "./app-nav-bar";
import ContentContainer from "./content-container";

export default function MainPage() {
  const [selectedItem, setSelectedItem] = useState<NavItem>("strategies");

  return (
    <main className="min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center m-8">
        Welcome to Dev Utils
      </h1>
      <div className="flex justify-center pt-8">
        <AppNavBar selectedItem={selectedItem} onItemSelect={setSelectedItem} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <ContentContainer selectedItem={selectedItem} />
        </div>
      </div>
    </main>
  );
}
