import React from "react";

interface CircleWithInnerProps {
  label: string;
  background: string;
  width: number;
  height: number;
}

const CircleWithInner: React.FC<CircleWithInnerProps> = ({ label, background, width, height }) => {
  const fontSize = Math.floor(width * 0.2); // font size proporsional dengan lebar

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: `${width}px`,
        height: `${height}px`,
        border: "2px solid #e0e0e0",
        borderRadius: "50%",
        backgroundColor: "transparent",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.08)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: `${0.8 * width}px`,
          height: `${0.8 * height}px`,
          background: `linear-gradient(135deg, ${background}, #ffffff)`,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          animation: "pulse 2s infinite ease-in-out, fadeIn 0.8s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: `${fontSize}px`,
            fontWeight: 700,
            textAlign: "center",
            background: "linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 6px rgba(0,0,0,0.2)",
            animation: "bounceIn 1s ease",
          }}
        >
          {label}
        </h3>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0.5; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default CircleWithInner;
