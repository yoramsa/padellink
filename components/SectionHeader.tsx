import Link from "next/link";

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-title text-3xl font-bold text-marine sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-marine/60">{subtitle}</p>}
        <div className="gold-rule mt-3 h-0.5 w-24" />
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden shrink-0 text-sm font-semibold text-azur hover:text-marine sm:block"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
