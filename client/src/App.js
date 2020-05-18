import React, { useState, useEffect } from "react";
import "./App.css";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";
import useShareDB from "./useShareDB";

export default function App({ id }) {
  const [sketch, setSketch] = useState(sketchTemplate);
  const [frozen, setFrozen] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState([]);

  useShareDB("0");

  useEffect(() => {
    window.addEventListener("message", (message) => {
      if (message.data.source === "code-tutor-bridge") {
        setLog((log) => [...log, message.data.payload]);
      }
    });
  }, []);

  useEffect(() => {
    if (isRunning) {
      setFrozen(sketch.value);
    }
  }, [sketch, isRunning]);

  function handleEdit(value) {
    setSketch("value", value);
  }

  function startSketch() {
    setLog(["Starting Sketch..."]);
    setIsRunning(true);
  }

  function stopSketch() {
    if (isRunning) {
      setIsRunning(false);
      setLog((log) => [...log, "Sketch Stopped"]);
    }
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
        <Editor className="Editor" value={sketch} onChange={handleEdit} />
        <Log className="Log" value={log} />
      </div>
      <div className="Column">
        {isRunning ? <Sketch value={frozen} /> : <div />}
      </div>
    </div>
  );
}
