import React, { useState, useEffect } from "react";

import "./App.css";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

const sketchTemplate = `var lastPrint;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  lastPrint = millis();
}

function draw() {
  // put drawing code here
  background(220);
  circle(mouseX, mouseY, 100);

  if (millis() - lastPrint > 1000) {
    print("X: ", mouseX, " Y: ", mouseY);
    lastPrint = millis();
  }
}`;

export default function App() {
  const [code, setCode] = useState({
    editor: sketchTemplate, // state of the editor
    sketch: "", // saved state of editor before run
  });

  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState([]);

  useEffect(() => {
    window.addEventListener("message", (message) => {
      if (message.data.source === "code-tutor-bridge") {
        setLog((log) => [...log, message.data.payload]);
      }
    });
  }, []);

  function handleEdit(value) {
    setCode((code) => ({ ...code, editor: value }));
  }

  function startSketch() {
    setCode((code) => ({ ...code, sketch: code.editor }));
    setLog(["Starting Sketch..."]);
    setIsRunning(true);
  }

  function stopSketch() {
    setIsRunning(false);
    setLog((log) => [...log, "Sketch Stopped"]);
  }

  return (
    <div className="App">
      <div className="Column">
        <div className="ButtonBar">
          <button className="StartButton" onClick={startSketch}>
            {"\u25B6"}
          </button>
          <button className="StopButton" onClick={stopSketch}>
            {"\u25A0"}
          </button>
        </div>
        <Editor className="Editor" value={code.editor} onChange={handleEdit} />
        <Log className="Log" value={log} />
      </div>
      <div className="Column">
        {isRunning ? <Sketch value={code.sketch} /> : <div />}
      </div>
    </div>
  );
}
