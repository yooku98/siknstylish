"use client";

import { FormEvent, useState } from "react";
import { collections } from "@/lib/collections";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("error");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", accessKey);
    formData.append("subject", "New Consultation Booking Request — Sik n Stylish");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setStatus(result.success ? "success" : "error");
      if (result.success) (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-gold bg-gold/10 p-8 text-center flex flex-col gap-2">
        <h3 className="font-serif text-xl text-ink">Request Received</h3>
        <p className="text-ink/70 text-sm">
          Thank you — we'll be in touch shortly to confirm your consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Full Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone / WhatsApp" name="phone" type="tel" required />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="garmentCategory">
            Garment Category
          </label>
          <select
            id="garmentCategory"
            name="garmentCategory"
            required
            className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
          >
            <option value="">Select a category</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name} ({c.startingFrom})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="consultationType">
            Consultation Type
          </label>
          <select
            id="consultationType"
            name="consultationType"
            required
            className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
          >
            <option value="In-Person">In-Person, at the studio</option>
            <option value="Virtual">Virtual Consultation</option>
          </select>
        </div>
        <Field label="Preferred Date" name="preferredDate" type="date" required />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="preferredTime">
            Preferred Time
          </label>
          <select
            id="preferredTime"
            name="preferredTime"
            required
            className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink/70" htmlFor="notes">
          Tell Us About Your Occasion
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="e.g. Wedding on 12 Dec, looking for a beaded gown..."
          className="border border-ink/20 bg-ivory px-4 py-3 text-sm resize-none focus:outline-none focus:border-gold"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong sending your request. Please try again, or
          reach us directly on WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Request Consultation"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-ink/70" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
      />
    </div>
  );
}
