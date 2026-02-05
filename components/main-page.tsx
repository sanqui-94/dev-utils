"use client";

import AppNavBar, { NavItem } from "./app-nav-bar";
import ContentContainer from "./content-container";

interface MainPageProps {
  selectedItem: NavItem;
}

export default function MainPage({ selectedItem }: MainPageProps) {

  return (
    <main className="min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center m-8">
        Welcome to Dev Utils
      </h1>
      <div className="flex justify-center pt-8">
        <AppNavBar selectedItem={selectedItem} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <ContentContainer selectedItem={selectedItem} />
        </div>
      </div>
    </main>
  );
}
