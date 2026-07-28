type Props = {
  label: string;
  aspect?: string;
  className?: string;
};

export default function PlaceholderImage({
  label,
  aspect = "aspect-[4/5]",
  className = "",
}: Props) {
  return (
    <div
      className={`${aspect} ${className} relative flex flex-col items-center justify-center gap-3 border border-ink/15 bg-[repeating-linear-gradient(135deg,rgba(10,10,10,0.04)_0px,rgba(10,10,10,0.04)_1px,transparent_1px,transparent_12px)] bg-ink/[0.03] text-center px-4`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-8 w-8 text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
        />
        <circle cx="12" cy="13" r="3.25" />
      </svg>
      <span className="text-ink/50 text-xs uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
}
