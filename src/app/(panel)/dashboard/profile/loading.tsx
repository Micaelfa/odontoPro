"use client";

import { BlinkBlur } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
    </div>
  );
}