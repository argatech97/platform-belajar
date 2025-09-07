import React, { useState, useCallback, memo } from "react";

export const TogglePasswordInput = memo(function TogglePasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);

  const toggleShow = useCallback(() => setShow((s) => !s), []);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          paddingRight: "40px",
        }}
      />
      <span
        onClick={toggleShow}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {show ? "🙈" : "👁️"}
      </span>
    </div>
  );
});
