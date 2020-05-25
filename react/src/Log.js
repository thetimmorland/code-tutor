import React from "react";

export default function Log({ value }) {
  return (
    <div className="Log">
      {(value || []).map((entry, idx) => (
        <pre key={idx}>{entry}</pre>
      ))}
      <div />
    </div>
  );
}
