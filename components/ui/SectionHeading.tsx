type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  const alignClasses = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClasses}`}>
      {eyebrow && (
        <span className="text-gold text-xs sm:text-sm font-sans uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="text-ink/70 text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
