import React, { useEffect, useRef } from "react";

export default function Log(props) {
  const log = props.value || [];

  return (
    <div className={props.className}>
      {log.map((entry, idx) => (
        <pre key={idx}>{entry}</pre>
      ))}
      <div />
    </div>
  );
}
