import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

export default function App() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const canvasRef = useRef(null)

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (!code || !canvasRef ) return;

    const canvas = canvasRef.current;

    try {
      eval(code);
      setError("Success!")
    } catch (err) {
      console.log(err);
      setError(err.toString())
    }
  }, [code]);

  return (
    <div style={{ margin: 10 }}>
      <div style={{display: "flex", alignItems: "flex-start"}}>
        <AceEditor
          mode="javascript"
          theme="github"
          value={code}
          onChange={(code) => setCode(code)}
          style={{ margin: 10 }}
        />
        <canvas
          ref={canvasRef}
          style={{ margin: 10, border: "1px solid black" }}
        />
      </div>
      <div style={{height: 250, width: "100%", overflow: "auto", backgroundColor: "gray"}}>
        {error ? error : "Ready to Run"}
      </div>
    </div>
  );
}
