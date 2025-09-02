"use client";

import { useRouter } from "next/navigation";
import React from "react";

type CloseNavigationProps = {
  backgroundColor?: string;
  disableBorder?: boolean;
  children: React.ReactNode;
};

export default function CloseNavigation({
  backgroundColor,
  disableBorder,
  children,
}: CloseNavigationProps) {
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
    >
      <span onClick={() => router.back()} style={{ marginRight: "10px", cursor: "pointer" }}>
        ✖
      </span>
      {children}
    </div>
  );
}
