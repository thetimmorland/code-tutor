import React from "react";

export default function Sketch({ value, style }) {
  const p5 = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js";
  const head = `<head><script src="${p5}"></script><script>${value}</script></head>`;
  const srcDoc = `<html>${head}<body></body></html>`;

  return (
    <iframe
      title="sketch"
      srcDoc={srcDoc}
      frameBorder={0}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
