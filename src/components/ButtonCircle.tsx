import React, { useMemo } from "react";

type CircleButtonProps = {
  isAnswered: boolean;
  isActive: boolean;
  number: number;
  width: number;
  height: number;
  fontSize: number;
};

const CircleButton: React.FC<CircleButtonProps> = React.memo(
  ({ isAnswered, isActive, number, height, width, fontSize }) => {
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
    };

    if (isAnswered) {
      styles.background = "#69CA87";
      styles.color = "#fff";
    } else if (isActive) {
      styles.background = "#fff";
      styles.border = "0.5px solid #c6c6c6";
      styles.color = "#000";
    } else {
      styles.background = "#c6c6c6";
      styles.color = "#000";
    }

    return <button style={styles}>{number}</button>;
  }
);

CircleButton.displayName = "CircleButton";

export default CircleButton;
