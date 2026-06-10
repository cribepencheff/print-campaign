"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiInstagram } from "react-icons/si";
import { Button } from "@/components/Button";

type NavLink = {
  label: string;
  href: string;
};

export function Navigation({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Öppna meny"
        className="flex items-center justify-center p-sp-sm rounded-full bg-white cursor-pointer focus:outline-none focus-visible:ring-2"
      >
        <Menu size={20} />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogBackdrop
          transition
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition duration-300 data-closed:opacity-0"
        />

        <DialogPanel
          transition
          className="fixed top-0 right-0 z-50 h-full md:w-120 w-full bg-white shadow-2xs flex flex-col transition duration-300 ease-in-out data-closed:translate-x-full gap-2 p-sp-xl pb-sp-lg xl:p-sp-xxl xl:pb-sp-xl"
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Stäng meny"
            className="absolute right-sp-lg top-sp-sm p-sp-sm flex items-center justify-center rounded-full not-md:bg-yellow hover:bg-yellow cursor-pointer focus:outline-none focus-visible:ring-2"
          >
            <X size={20} />
          </button>

          <nav className="flex flex-col pt-40">
            <AnimatePresence>
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    delay: 0.2 + i * 0.07,
                    duration: 0.55,
                  }}
                >
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`${pathname === link.href ? "text-purple" : ""} flex flex-row items-center gap-sp-xs text-3xl md:text-4xl hover:opacity-60 pt-sp-xs transition-opacity heading`}
                  >
                    {pathname === link.href && (
                      // eslint-disable-next-line @next/next/no-img-element -- SVG, next/image doesn't support it
                      <img
                        src="/assets/ornament-red.svg"
                        alt="Antirasistisk valstuga logotyp"
                        className="h-4"
                      />
                    )}
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>

          <div className="mt-auto flex flex-col gap-sp-md">
            <p className="text-sm text-center max-w-11/12 m-auto">
              Följ oss på instagram för att hålla dig uppdaterad om tid & plats
              för våra stopp!
            </p>
            <Button
              variant="outline"
              href="https://www.instagram.com/skyddsrummet_"
              targetBlank
              icon={<SiInstagram size={20} />}
            >
              skyddsrummet_
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
