import React, { useState, useEffect, useRef } from "react";

import "./App.css";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

const sketchTemplate = `function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
}
      
function draw() {
  // put drawing code here
  background(220);
  circle(mouseX, mouseY, 100);
}
`

export default function App() {
  const [editor, setEditor] = useState(sketchTemplate);
  const [sketch, setSketch] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState([]);
  const sketchRef = useRef(null);

  function handleEdit(newValue) {
    setIsRunning(false);
    setEditor(newValue);
  }

  useEffect(() => {
    if (isRunning) {
      setSketch(editor);
      setLog([]);
    }
  }, [isRunning, editor])

  useEffect(() => {
    window.addEventListener("message", (message) => {
      if (message.source !== sketchRef.current) {
        if (message.data.error) {
          setLog((log) => [...log, message.data.error]);
        }
      }
    });
  }, [sketchRef]);

  return (
    <div className="App">
      <div className="Column">
        <div className="ButtonBar">
          <button className="StartButton" onClick={() => setIsRunning(true)}>
            {"\u25B6"}
          </button>
          <button className="StopButton" onClick={() => setIsRunning(false)}>
            {"\u25A0"}
          </button>
        </div>
        <Editor
          className="Editor"
          value={editor}
          onChange={handleEdit}
        />
        <Log className="Log" value={log} />
      </div>
      <div className="Column">
        {isRunning ? <Sketch ref={sketchRef} value={sketch} /> : <div />}
      </div>
    </div>
  );
}
