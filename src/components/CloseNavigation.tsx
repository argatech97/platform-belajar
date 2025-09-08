"use client";

import { useRouter } from "next/navigation";
import React from "react";

type CloseNavigationProps = {
  backgroundColor?: string;
  disableBorder?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function CloseNavigation({
  backgroundColor,
  disableBorder,
  children,
  onClick,
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
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <span
        onClick={() => (onClick ? onClick() : router.back())}
        style={{ marginRight: "10px", cursor: "pointer" }}
      >
        ✖
      </span>
      {children}
    </div>
  );
}
