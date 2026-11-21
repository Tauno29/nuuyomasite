import Link from "next/link";

type LogoProps = {
  name?: string;
  shortName?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
  href?: string;
};

const sizes = {
  sm: { img: "h-9 w-9", text: "text-[20px]" },
  md: { img: "h-11 w-11", text: "text-[27px]" },
  lg: { img: "h-16 w-16", text: "text-4xl" },
};

export default function Logo({
  name = "Nuuyoma Senior Secondary School",
  shortName = "Nuuyoma SSS",
  size = "md",
  light = false,
  href = "/",
}: LogoProps) {
  const s = sizes[size];
  return (
    <Link href={href} className="flex items-center gap-3" aria-label={`${name} home`}>
      <img src="/assets/school-crest.webp" alt={`${name} crest`} className={`${s.img} shrink-0 rounded-full object-cover`} />
      <span className={`display ${s.text} font-semibold tracking-tight ${light ? "text-white" : "text-[#0f172a]"}`}>
        {shortName}
      </span>
    </Link>
  );
}
