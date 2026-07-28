export type MeasurementOption = {
  title: string;
  description: string;
};

export const measurementOptions: MeasurementOption[] = [
  {
    title: "Visit Our Studio",
    description:
      "Come in for a precise, hands-on measurement session at our Accra studio — ideal for first-time clients and bridal pieces.",
  },
  {
    title: "Home Measurement",
    description:
      "Where available, we can arrange a measurement visit to you. Ask us about availability and any travel fee for your area when booking.",
  },
  {
    title: "Submit Your Own Measurements",
    description:
      "Based abroad or unable to visit? Follow our measurement guide below and submit your numbers when you book — we'll confirm anything that looks off before we cut fabric.",
  },
];

export const measurementGuideSteps = [
  {
    title: "What you'll need",
    detail:
      "A soft measuring tape, a mirror, and — ideally — a second person to help. Wear fitted clothing (or the undergarments you'd normally wear under the finished piece).",
  },
  {
    title: "Bust / Chest",
    detail:
      "Measure around the fullest part of your bust/chest, keeping the tape level and snug but not tight.",
  },
  {
    title: "Waist",
    detail:
      "Measure around the narrowest part of your natural waistline, usually just above the belly button.",
  },
  {
    title: "Hips",
    detail:
      "Measure around the fullest part of your hips, roughly 20cm below your waistline.",
  },
  {
    title: "Shoulder to Waist / Shoulder to Floor",
    detail:
      "For tops and dresses, measure from the shoulder seam down to the waist; for gowns, continue down to the desired hem length.",
  },
  {
    title: "Arm Length & Sleeve",
    detail:
      "Measure from the shoulder seam to the wrist (or desired sleeve end), and separately around the fullest part of the upper arm.",
  },
];
