import { Button as HUIButton } from "@headlessui/react";
import Link from "next/link";

type Variant = "primary" | "accent" | "outline";

type ButtonProps = {
  variant?: Variant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  targetBlank?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-purple",
  accent: "bg-red text-black",
  outline: "bg-transparent text-black hover:bg-purple/10",
};

export function Button({
  variant = "primary",
  children,
  className,
  href,
  targetBlank,
  icon,
  ...props
}: ButtonProps) {
  const baseClasses =
    "w-full flex gap-sp-xs justify-center items-center heading text-lg p-3 rounded border border-black shadow-[0px_0px_0px_#000] hover:shadow-[2px_2px_0px_#000] translate-0 hover:-translate-0.5 transition-[transform, shadow, bg-color] duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

  if (href) {
    return (
      <Link
        href={href}
        target={targetBlank ? "_blank" : undefined}
        rel={targetBlank ? "noopener noreferrer" : undefined}
        className={`${baseClasses} ${variants[variant]} ${className ?? ""}`}
      >
        {icon ?? null}
        {children}
      </Link>
    );
  }

  return (
    <HUIButton
      className={`${baseClasses} ${variants[variant]} ${className ?? ""}`}
      {...props}
    >
      {icon ?? null}
      {children}
    </HUIButton>
  );
}
