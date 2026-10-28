import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Tingkat heading. Satu halaman hanya boleh punya satu `h1`. */
  as?: "h1" | "h2";
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-2 text-sm font-bold tracking-wider uppercase",
            isDark ? "text-surface" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "font-heading text-2xl leading-tight font-bold text-balance",
          isDark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-3 text-base text-pretty",
            align === "center" && "mx-auto max-w-2xl",
            isDark ? "text-surface" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
