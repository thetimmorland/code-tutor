import React, { useState } from "react";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

import "./App.css";

export default function App() {
  const [code, setCode] = useState({ editor: "", sketch: "" });
  const [log, setLog] = useState([]);

  const startSketch = () => {
    setCode((code) => ({ ...code, sketch: code.editor }));
    setLog(["Starting Sketch...."]);
  };

  const stopSketch = () => {
    setCode((code) => ({ ...code, sketch: "" }));
    setLog((log) => [...log, "Stopping Sketch..."]);
  };

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
        <Editor code={code.editor} setCode={setCode} />
        <Log className="Log" value={log} />
      </div>
      <div className="Column">
        <Sketch code={code.sketch} setLog={setLog} />
      </div>
    </div>
  );
}
