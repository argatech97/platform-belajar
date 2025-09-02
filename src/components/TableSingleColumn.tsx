import React from "react";

interface Items {
  title: string;
  description: string;
  action?: () => void;
}

interface TableSingleColumnProps {
  primaryColor?: string;
  secondaryColor?: string;
  title: string;
  items: Items[];
}

export default function TableSingleColumn({
  title,
  items,
  primaryColor,
  secondaryColor,
}: TableSingleColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: primaryColor || "#E6FFEE",
        borderRadius: "8px",
        border: `solid 0.5px #c6c6c6`,
      }}
    >
      <h3 style={{ color: "black", padding: "10px" }}>{title}</h3>
      <div
        style={{
          borderRadius: "8px",
          borderTop: `solid 0.5px #c6c6c6`,
          padding: "10px 20px",
          background: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 0px" }}>
          {items.length > 0 &&
            items.map((item, index) => {
              return (
                <div key={index} onClick={item.action}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.5,
                      padding: "0px 5px",
                      cursor: "pointer",
                    }}
                  >
                    <p style={{ fontWeight: "bold", color: secondaryColor || "#69CA87" }}>
                      {item.title}
                    </p>
                    <p style={{ color: "black", fontSize: "15px" }}>{item.description}</p>
                  </div>
                  {index + 1 !== items.length ? (
                    <div style={{ marginTop: "10px", borderTop: "solid 0.1px #c6c6c6" }} />
                  ) : (
                    ""
                  )}{" "}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
