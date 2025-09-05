const CircleWithInner = ({
  label,
  background,
  width,
  height,
}: {
  background: string;
  width: number;
  height: number;
  label: string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #c6c6c6",
        borderRadius: "50%",
        backgroundColor: "transparent",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${0.8 * width}px`,
          height: `${0.8 * height}px`,
          backgroundColor: background,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 1,
        }}
      >
        <h3 style={{ color: "white", margin: 0 }}>{label}</h3>
      </div>
    </div>
  );
};

export default CircleWithInner;
