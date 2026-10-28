import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline";

const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-none px-4 py-2 text-base leading-[22px] font-semibold transition-colors duration-200 motion-reduce:transition-none lg:min-h-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-hover",
  dark: "bg-ink text-white hover:bg-black",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
};

export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

interface ButtonLinkProps extends Omit<
  ComponentProps<"a">,
  "href" | "className"
> {
  href: string;
  variant?: Variant;
  className?: string;
}

/**
 * Tautan bergaya tombol. Tautan internal memakai `next/link`,
 * tautan eksternal dibuka di tab baru dengan `rel` yang aman.
 */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const styles = buttonStyles(variant, className);
  const isExternal = /^(https?:)?\/\//.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (
    href.startsWith("#") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:")
  ) {
    return (
      <a href={href} className={styles} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles} {...props}>
      {children}
    </Link>
  );
}
