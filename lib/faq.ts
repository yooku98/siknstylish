export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "How long does production take?",
    answer:
      "Production takes anywhere from 5 to 21 working days, depending on the complexity of the piece. We'll confirm an exact timeline for your order at your consultation.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship internationally. Get in touch and we'll advise on delivery to your location.",
  },
  {
    question: "What is your payment policy?",
    answer:
      "Payment is made in two installments — 50% before production begins, and the remaining 50% once production is complete.",
  },
  {
    question: "Do you offer alterations?",
    answer:
      "We don't currently offer alterations after a garment has been delivered. Fittings take place during production to make sure everything fits perfectly before it leaves our hands.",
  },
  {
    question: "Can I provide my own fabric?",
    answer: "Yes, you're welcome to provide your own fabric for your piece.",
  },
  {
    question: "What happens if my measurements change?",
    answer:
      "If your measurements change during production — for example due to a change in weight — please call us to let us know as soon as possible, or it can be addressed during your fitting.",
  },
];
