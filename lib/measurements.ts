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
      "Based abroad or unable to visit? We'll send you a measurement guide to help — follow it, submit your numbers when you book, and we'll confirm anything that looks off before we cut fabric.",
  },
];

export const measurementPrepTip =
  "A soft measuring tape, a mirror, and — ideally — a second person to help. Wear fitted clothing (or the undergarments you'd normally wear under the finished piece).";

export type MeasurementField = {
  key: string;
  label: string;
};

export const maleMeasurementFields: MeasurementField[] = [
  { key: "acrossBack", label: "Across Back" },
  { key: "chest", label: "Chest" },
  { key: "aroundBody", label: "Around Body" },
  { key: "neck", label: "Neck" },
  { key: "sleeveLength", label: "Sleeve Length" },
  { key: "aroundSleeve", label: "Around Sleeve" },
  { key: "shirtLength", label: "Shirt Length" },
  { key: "waist", label: "Waist" },
  { key: "thigh", label: "Thigh" },
  { key: "base", label: "Base" },
  { key: "trouserLength", label: "Trouser Length / Shorts Length" },
  { key: "crotch", label: "Crotch" },
  { key: "seat", label: "Seat" },
];

export const femaleMeasurementFields: MeasurementField[] = [
  { key: "acrossBack", label: "Across Back" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "upperBust", label: "Upper Bust" },
  { key: "lowerBust", label: "Lower Bust" },
  { key: "hip", label: "Hip" },
  { key: "shoulderToBust", label: "Shoulder to Bust" },
  { key: "shoulderToWaistFront", label: "Shoulder to Waist (Front)" },
  { key: "shoulderToWaistBack", label: "Shoulder to Waist (Back)" },
  { key: "shoulderToUpperBust", label: "Shoulder to Upper Bust" },
  { key: "shoulderToLowerBust", label: "Shoulder to Lower Bust" },
  { key: "nippleToNipple", label: "Nipple to Nipple" },
  { key: "blouseLength", label: "Blouse Length" },
  { key: "hipDepth", label: "Hip Depth" },
  { key: "trueWaist", label: "True Waist" },
  { key: "skirtLength", label: "Skirt Length" },
  { key: "trouserLength", label: "Trouser Length" },
  { key: "dressLength", label: "Dress Length" },
  { key: "thigh", label: "Thigh" },
  { key: "crotch", label: "Crotch" },
  { key: "seat", label: "Seat" },
  { key: "base", label: "Base" },
];
