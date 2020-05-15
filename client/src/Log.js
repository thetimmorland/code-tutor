import React, { useEffect, useRef } from "react";

export default function Log(props) {
  const log = props.value || [];
  var logEnd = useRef(null);

  useEffect(() => {
    logEnd.scrollIntoView();
  });

  return (
    <div className={props.className}>
      {log.map((entry, idx) => (
        <p key={idx}>{entry}</p>
      ))}
      <div
        ref={(el) => {
          logEnd = el;
        }}
      />
    </div>
  );
}
