"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition duration-200 data-closed:opacity-0"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-sp-md">
        <DialogPanel
          transition
          className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-sp-xl transition duration-200 data-closed:opacity-0 data-closed:scale-95"
        >
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="absolute right-sp-sm top-sp-sm p-sp-sm flex items-center justify-center rounded-full hover:bg-yellow cursor-pointer focus:outline-none focus-visible:ring-2"
          >
            <X size={20} />
          </button>

          {title && (
            <DialogTitle as="h2" className="text-3xl mb-4 pr-10">
              {title}
            </DialogTitle>
          )}

          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
