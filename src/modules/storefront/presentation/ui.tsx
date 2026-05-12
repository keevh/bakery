import Link from "next/link";
import type { ReactNode } from "react";

export function PillButton({
  text,
  color = "bg-[#FFDC39]",
  className = "",
  onClick,
  href,
}: {
  text: ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const classes = `${color} inline-flex rounded-full border-2 border-[#3C2317] px-6 py-2 font-bold uppercase tracking-wide text-[#3C2317] shadow-[2px_2px_0px_0px_#3C2317] transition-transform hover:-translate-y-1 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {text}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {text}
    </button>
  );
}

export function Sticker({
  text,
  color = "bg-[#9BE1E8]",
  className = "",
}: {
  text: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-black uppercase tracking-normal text-white shadow-md ${color} ${className}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
