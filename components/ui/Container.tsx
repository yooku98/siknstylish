import { HTMLAttributes } from "react";

export default function Container({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12 ${className}`}
      {...props}
    />
  );
}
