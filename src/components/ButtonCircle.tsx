import React, { useMemo } from "react";

type CircleButtonProps = {
  isAnswered: boolean;
  isActive: boolean;
  number: number;
  width: number;
  height: number;
  fontSize: number;
  onClick?: () => void;
};

const CircleButton: React.FC<CircleButtonProps> = React.memo(
  ({ isAnswered, isActive, number, height, width, fontSize, onClick }) => {
    const styles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: "50%",
      fontSize: `${fontSize}px`,
      fontWeight: 500,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease-in-out",
      flexShrink: 0,
    };

    if (isActive) {
      styles.background = "#fff";
      styles.border = "0.5px solid #c6c6c6";
      styles.color = "#000";
    } else if (isAnswered) {
      styles.background = "#69CA87";
      styles.color = "#fff";
    } else {
      styles.background = "#c6c6c6";
      styles.color = "#000";
    }

    return (
      <button onClick={onClick} style={styles}>
        {number}
      </button>
    );
  }
);

CircleButton.displayName = "CircleButton";

export default CircleButton;
