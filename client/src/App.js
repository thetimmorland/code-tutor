import React, { useState } from "react";

import "./App.css";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

export default function App() {
  const [code, setCode] = useState(
    "function setup() {\n" +
      "  // put setup code here\n" +
      "  createCanvas(windowWidth, windowHeight);\n" +
      "}\n" +
      "\n" +
      "function draw() {\n" +
      "  // put drawing code here\n" +
      "  background(220);\n" +
      "  circle(mouseX, mouseY, 100);\n" +
      "}\n"
  );

  const [log, setLog] = useState(["test", "test2"]);

  const handleChange = (newCode) => {
    setCode(newCode);
  };

  const runSketch = () => {};

  const stopSketch = () => {};

  return (
    <div className="App">
      <div className="Column">
        <div className="ButtonBar">
          <button className="StartButton" onClick={runSketch}>
            {"\u25B6"}
          </button>
          <button className="StopButton" onClikc={stopSketch}>
            {"\u25A0"}
          </button>
        </div>
        <Editor className="Editor" value={code} onChange={handleChange} />
        <Log className="Log" value={log} />
      </div>
      <div className="Column">
        <Sketch code={code} />
      </div>
    </div>
  );
}
