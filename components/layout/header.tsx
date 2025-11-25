"use client";

import ModeToggle from "@/components/theme/mode-toggle";
import MainNav from "./main-nav";
import Logo from "./logo";
import SearchToggle from "./search-toggle"; 

export function Header() {
  return (
    <header className="top-0 z-50 w-full border-b">
      <div className="flex h-14 items-center px-14">
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
