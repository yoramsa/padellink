import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  const textColor = light ? "#FAF8F5" : "#1B2B6B";
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
        <circle cx="32" cy="32" r="28" fill="#1B2B6B" />
        <path
          d="M32 12l5.6 9.7 11.2 0-5.6 9.7 5.6 9.7-11.2 0-5.6 9.7-5.6-9.7-11.2 0 5.6-9.7-5.6-9.7 11.2 0z"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="32" r="5" fill="#7B5EA7" />
      </svg>
      <span
        className="font-title text-2xl font-extrabold tracking-tight"
        style={{ color: textColor }}
      >
        Mazaly
      </span>
    </Link>
  );
}
