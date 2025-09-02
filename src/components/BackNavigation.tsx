"use client";

import { useRouter } from "next/navigation";
import React from "react";

type BackNavigationProps = {
  label: string;
  backgroundColor?: string;
  color?: string;
  disableBorder?: boolean;
};

export default function BackNavigation({
  label,
  backgroundColor,
  color,
  disableBorder,
}: BackNavigationProps) {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: backgroundColor ? backgroundColor : "#fff",
        borderBottom: !disableBorder ? "0.5px solid #c6c6c6" : "none",
        padding: "15px",
        cursor: "pointer",
      }}
      onClick={() => router.back()}
    >
      {/* Panah kiri pakai inline SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke={color ? color : "black"}
        strokeWidth="2"
        style={{ marginRight: "10px" }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span style={{ fontSize: "16px", color: color ? color : "black", fontWeight: "bold" }}>
        {label}
      </span>
    </div>
  );
}
