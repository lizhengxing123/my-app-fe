"use client";

import ModeToggle from "@/components/theme/mode-toggle";
import MainNav from "./main-nav";
import Logo from "./logo";
import SearchToggle from "../search/search-toggle";

export function Header() {
  return (
    <header className="site-header fixed left-0 top-0 z-2 w-full border-b bg-background">
      <div className="flex h-16 items-center px-14">
        <div className="flex items-center gap-4">
          <Logo />
          <MainNav />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <SearchToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
