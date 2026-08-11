import {
  measurementPrepTip,
  maleMeasurementFields,
  femaleMeasurementFields,
} from "@/lib/measurements";

function FieldList({
  title,
  fields,
}: {
  title: string;
  fields: { key: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <ul className="flex flex-col gap-2">
        {fields.map((field) => (
          <li
            key={field.key}
            className="text-ink/70 text-sm py-2 border-b border-ink/10"
          >
            {field.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MeasurementGuide() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-5">
        <span className="font-serif text-2xl text-gold shrink-0 w-8">01</span>
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-lg text-ink">What You&apos;ll Need</h3>
          <p className="text-ink/70 text-sm leading-relaxed">{measurementPrepTip}</p>
        </div>
      </div>

      <div className="flex gap-5">
        <span className="font-serif text-2xl text-gold shrink-0 w-8">02</span>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-lg text-ink">Measurements We Need</h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              The exact list depends on the piece — here&apos;s our full
              measurement specification for reference.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <FieldList title="Male" fields={maleMeasurementFields} />
            <FieldList title="Female" fields={femaleMeasurementFields} />
          </div>
        </div>
      </div>
    </div>
  );
}
