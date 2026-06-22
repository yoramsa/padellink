export default function EmptyNotice({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-or/50 bg-white/60 p-10 text-center">
      <p className="text-marine/60">{label}</p>
    </div>
  );
}
