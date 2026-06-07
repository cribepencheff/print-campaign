"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NavLink = {
  label: string;
  href: string;
};

export function Navigation({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Öppna meny"
        className="fixed top-4 right-4 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <Menu size={20} />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogBackdrop
          transition
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition duration-300 data-closed:opacity-0"
        />

        <DialogPanel
          transition
          className="fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl flex flex-col transition duration-300 ease-in-out data-closed:translate-x-full"
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Stäng meny"
            className="self-end m-4 flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black transition-colors"
          >
            <X size={20} />
          </button>

          <nav className="flex flex-col gap-2 px-8 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-bold tracking-tight text-gray-900 hover:text-gray-500 transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  );
}
