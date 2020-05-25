import React, { useState, useEffect, useRef } from "react";

import useShareDB from "./useShareDB.js";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

import "./App.css";

export default function App() {
  const [code, handleChange] = useShareDB("0");
  const codeRef = useRef(null);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const [sketch, setSketch] = useState("");
  const [log, setLog] = useState([]);

  const startSketch = () => {
    setSketch(codeRef.current);
  };

  const stopSketch = () => {
    setSketch("");
  };

  useEffect(() => {
    if (sketch) {
      setLog(["Starting Sketch..."]);
    } else {
      setLog((log) => [...log, "Sketch Stopped."]);
    }
  }, [sketch]);

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
        <Editor value={code} handleChange={handleChange} />
        <Log value={log} />
      </div>
      <div className="Column">
        <Sketch value={sketch} setLog={setLog} />
      </div>
    </div>
  );
}
