import React from "react";

interface ICardItem {
  icon: React.ReactNode;
  label: string;
}

interface CardProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  title?: string;
  description?: string;
  items?: ICardItem[];
  backgroundColor?: string;
  color?: string;
  onClick?: () => void;
}

const Card = React.memo(function Card({
  prefix,
  suffix,
  title,
  description,
  items,
  backgroundColor,
  color,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexWrap: "nowrap",
        padding: "15px",
        borderRadius: "8px",
        border: "solid 0.5px #c6c6c6",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        cursor: "pointer",
        backgroundColor: backgroundColor ? backgroundColor : "white",
      }}
    >
      {prefix && <div>{prefix}</div>}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          flexGrow: "1",
        }}
      >
        {title && <h4 style={{ color: color ? color : "black" }}>{title}</h4>}
        {description && (
          <p style={{ color: color ? color : "#555", padding: "5px 0px" }}>{description}</p>
        )}
        {items && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "nowrap" }}>
            {items.map((item, index) => {
              return (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {item.icon}
                  <span style={{ color: "black", transform: "translateY(3px)" }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {suffix && <div>{suffix}</div>}
    </div>
  );
});

export default Card;
