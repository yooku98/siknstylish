export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Consultation",
    description:
      "We start with a conversation — your occasion, your style, your budget and timeline — in person at our studio or over a virtual call.",
  },
  {
    step: 2,
    title: "Measurements",
    description:
      "Precise measurements are taken at our studio, at your home, or submitted by you using our measurement guide.",
  },
  {
    step: 3,
    title: "Design Discussion",
    description:
      "We translate your vision into a design — silhouette, detailing, and construction — refined together until it feels right.",
  },
  {
    step: 4,
    title: "Fabric Selection",
    description:
      "You choose from curated fabrics and embellishments, or supply your own, guided by what will bring the design to life.",
  },
  {
    step: 5,
    title: "Production",
    description:
      "Your piece is cut and constructed by hand in our studio, with regular updates as it takes shape.",
  },
  {
    step: 6,
    title: "Fitting",
    description:
      "One or more fittings ensure the final garment sits exactly as it should before it leaves our hands.",
  },
  {
    step: 7,
    title: "Delivery",
    description:
      "Your finished piece is pressed, packaged and delivered — ready for its moment.",
  },
];
