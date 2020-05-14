import React from "react";

export default function Log(props) {
  return (
    <div className={props.className}>
      {(props.value || []).map((entry, idx) => (
        <p key={idx}>{`${entry.lineNumber}:${entry.columnNo} ${entry.msg}`}</p>
      ))}
    </div>
  );
}
