import type { MeasurementOption } from "@/lib/measurements";

export default function MeasurementOptionCard({ option }: { option: MeasurementOption }) {
  return (
    <div className="flex flex-col gap-3 border border-ink/10 p-8">
      <h3 className="font-serif text-xl text-ink">{option.title}</h3>
      <p className="text-ink/70 text-sm leading-relaxed">{option.description}</p>
    </div>
  );
}
