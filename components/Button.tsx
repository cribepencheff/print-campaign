import { Button as HUIButton } from "@headlessui/react";
import { cloneElement, isValidElement } from "react";

type Variant = "primary" | "accent" | "outline";
type Size = "small" | "default";

type IconProps = {
  size?: number;
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactElement<IconProps>;
  children: React.ReactNode;
  href?: string;
  targetBlank?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-purple",
  accent: "bg-purple text-white",
  outline: "bg-transparent text-black hover:bg-purple/10",
};

const sizes: Record<Size, string> = {
  small: "py-1.75 px-2.75 text-sm",
  default: "p-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "default",
  children,
  className,
  href,
  targetBlank,
  icon,
  ...props
}: ButtonProps) {
  const baseClasses =
    "w-full no-underline flex gap-sp-xs justify-center items-center heading rounded border border-black shadow-[0px_0px_0px_#000] hover:shadow-[2px_2px_0px_#000] translate-0 hover:-translate-0.5 transition-[transform, shadow, bg-color] duration-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed";

  const renderedIcon = isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<IconProps>, {
        size: size === "small" ? 14 : 20,
      })
    : icon;

  if (href) {
    return (
      // <a> used to avoid Next.js router cache interfering with hash navigation
      <a
        href={href}
        target={targetBlank ? "_blank" : undefined}
        rel={targetBlank ? "noopener noreferrer" : undefined}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      >
        {icon ? <span className="-ml-0.5">{renderedIcon}</span> : null}
        {children}
      </a>
    );
  }

  return (
    <HUIButton
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...props}
    >
      {icon ? <span className="-ml-0.5">{renderedIcon}</span> : null}
      {children}
    </HUIButton>
  );
}
