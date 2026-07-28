// Answers containing bracketed [PLACEHOLDER] text state real business policy
// (timelines, fees, %) that only SiknStylish can confirm. Replace those
// brackets with real answers before launch — do not publish invented policy.
export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "How long does production take?",
    answer:
      "Production timelines vary by piece and season. [PLACEHOLDER — add your typical turnaround, e.g. \"4–6 weeks for evening wear, 8–12 weeks for bridal.\"] We'll confirm an exact timeline for your order at your consultation.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "[PLACEHOLDER — confirm whether you ship abroad, which countries/regions, and typical shipping cost/time.] Get in touch and we'll advise on delivery to your location.",
  },
  {
    question: "What is your payment policy?",
    answer:
      "[PLACEHOLDER — add your deposit/balance structure, e.g. \"A 50% non-refundable deposit is required to begin production, with the balance due at collection.\"]",
  },
  {
    question: "Do you offer alterations?",
    answer:
      "[PLACEHOLDER — confirm your alterations policy, e.g. whether minor adjustments after delivery are included and for how long.]",
  },
  {
    question: "Can I provide my own fabric?",
    answer:
      "[PLACEHOLDER — confirm whether client-supplied fabric is accepted, any quantity/quality guidelines, and whether it affects pricing or timelines.]",
  },
  {
    question: "What happens if my measurements change?",
    answer:
      "Let us know as soon as possible. [PLACEHOLDER — add your remeasurement/adjustment policy, including any fees if the piece is already in production.]",
  },
];
