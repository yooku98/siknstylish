import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "onDark";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-gold hover:text-ink border border-ink hover:border-gold",
  outline:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-ivory",
  onDark:
    "bg-transparent text-ivory border border-gold hover:bg-gold hover:text-ink",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-7 py-3 text-sm tracking-wide uppercase transition-colors duration-300 rounded-none whitespace-nowrap";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button({
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
  );
}
