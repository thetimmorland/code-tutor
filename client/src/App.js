import React, { useState } from "react";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

export default function App() {
  const [code, setCode] = useState(
    "function setup() {\n" +
      "  // put setup code here\n" +
      "  createCanvas(400, 400);\n" +
      "}\n" +
      "\n" +
      "function draw() {\n" +
      "  // put drawing code here\n" +
      "  background(220);\n" +
      "  circle(mouseX, mouseY, 100);\n" +
      "}\n"
  );

  const [log, setLog] = useState([]);

  const handleChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div
        style={{
          flex: 0.5,
          margin: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 0.75 }}>
          <Editor value={code} onChange={handleChange} />
        </div>
        <div style={{ flex: 0.25 }}>
          <Log value={log} />
        </div>
      </div>
      <div style={{ flex: 0.5, margin: 4 }}>
        <Sketch value={code} />
      </div>
    </div>
  );
}
