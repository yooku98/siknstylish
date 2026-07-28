import { processSteps } from "@/lib/process";

export default function ProcessTimeline() {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      {processSteps.map((step) => (
        <li key={step.step} className="flex flex-col gap-3">
          <span className="font-serif text-4xl text-gold">
            {String(step.step).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-xl text-ink">{step.title}</h3>
          <p className="text-ink/70 text-sm leading-relaxed">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
