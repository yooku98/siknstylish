type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  // "dark" for headings placed on bg-ink sections.
  tone?: "light" | "dark";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  tone = "light",
}: Props) {
  const alignClasses = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClasses}`}>
      {eyebrow && (
        <span className="text-gold text-xs sm:text-sm font-sans uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      )}
      <Heading className={`font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight ${tone === "dark" ? "text-ivory" : "text-ink"}`}>
        {title}
      </Heading>
      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${tone === "dark" ? "text-ivory/70" : "text-ink/70"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
