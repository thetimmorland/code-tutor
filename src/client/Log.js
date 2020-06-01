import React, { useState, useEffect, useRef } from "react";

export default function Log({ value }) {
  const [atBottom, setAtBottom] = useState(true);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      if (atBottom) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }
  }, [value, logRef, atBottom]);

  const handleScroll = (event) => {
    const { target } = event;
    setAtBottom(target.scrollTop === target.scrollHeight - target.offsetHeight);
  };

  return (
    <div className="Log" ref={logRef} onScroll={handleScroll}>
      {(value || []).map((entry, idx) => (
        <pre key={idx}>{entry}</pre>
      ))}
      <div />
    </div>
  );
}
