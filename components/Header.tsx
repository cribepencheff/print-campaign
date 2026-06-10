"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation } from "@/components/Navigation";

export function Header({
  links,
}: {
  links?: { label: string; href: string }[];
}) {
  const pathname = usePathname();

  function handleLogoClick(e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();

      window.scrollTo({ top: 0 });

      window.history.replaceState(null, "", "/");
    }
  }

  return (
    <header className="fixed w-full top-0 z-1 py-sp-sm px-sp-sm lg:px-sp-lg flex items-start justify-between">
      <Link
        href="/"
        className="bg-white/80 backdrop-blur-xs rounded-full border-2 border-white"
        onClick={handleLogoClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG, next/image doesn't support it */}
        <img
          src="/brand/logo_v1.svg"
          alt="Antirasistisk valstuga logotyp"
          className="h-16 md:h-20 animate-[spin_15s_linear_infinite] hover:[animation-play-state:paused]"
        />
      </Link>
      {links && <Navigation links={links} />}
    </header>
  );
}
