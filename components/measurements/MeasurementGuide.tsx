import { measurementGuideSteps } from "@/lib/measurements";

export default function MeasurementGuide() {
  return (
    <ol className="flex flex-col gap-8">
      {measurementGuideSteps.map((step, i) => (
        <li key={step.title} className="flex gap-5">
          <span className="font-serif text-2xl text-gold shrink-0 w-8">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-lg text-ink">{step.title}</h3>
            <p className="text-ink/70 text-sm leading-relaxed">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
