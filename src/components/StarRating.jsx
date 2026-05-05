export default function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => !readOnly && onChange && onChange(i)}
          style={{
            cursor: readOnly ? "default" : "pointer",
            color: i <= value ? "#f59e0b" : "rgba(255,255,255,0.15)",
            fontSize: 14,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
