import React, { useState, useEffect } from "react";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver.js";

function Sketch({ code, style }) {
  const p5 = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js";
  const srcDoc =
    "<html><head><script src=" +
    p5 +
    "></script><script>" +
    code +
    "</script></head><body></body></html>";

  return <iframe style={style} srcDoc={srcDoc} frameBorder={0} />;
}

function Console({ log, style }) {
  return (
    <div style={style}>
      <ul>
        {log.forEach((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const template =
    "function setup() {\n" +
    "  // put setup code here\n" +
    "  createCanvas(400, 400);\n" +
    "}\n" +
    "\n" +
    "function draw() {\n" +
    "  // put drawing code here\n" +
    "  background(220);\n" +
    "};\n";

  const [code, setCode] = useState(template);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 0.75, display: "flex" }}>
        <AceEditor
          language="javascript"
          value={code}
          onChange={(code) => {
            setCode(code);
          }}
          style={{ flex: 0.5, margin: 5 }}
        />
        <Sketch code={code} style={{ flex: 0.5, margin: 5 }} />
      </div>
      <Console log={["test"]} style={{ flex: 0.25, margin: 5 }} />
    </div>
  );
}
