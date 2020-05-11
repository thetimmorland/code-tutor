import React, { useState, useEffect, useRef } from "react";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-javascript";

import constructApi from "./constructApi";

export default function App() {
  const [code, setCode] = useState("");
  const [log, setLog] = useState("");

  const [api, setApi] = useState([]);
  const [handlers, setHandlers] = useState({});

  const [worker, setWorker] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const funcs = [
      function setHeight(height) {
        if (height) {
          canvas.height = height;
        }
      },

      function setWidth(width) {
        if (width) {
          canvas.width = width;
        }
      },
    ];

    const [newApi, newHandlers] = constructApi(funcs)
    setApi(newApi);
    setHandlers(newHandlers);
  }, [canvasRef]);

  const run = () => {
    if (worker) worker.terminate();

    const blob = new Blob([code, ...api], { type: "text/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    setWorker(new Worker(workerUrl));
  };

  useEffect(() => {
    if (!worker) return;

    worker.addEventListener("message", ({ data }) => {
      console.log(data);
      console.log(handlers);
      handlers[data.name](...data.params);
    });

    worker.addEventListener("error", (event) => {
      console.log(event);
    });
  }, [worker]);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: 10 }}>
      <AceEditor
        value={code}
        mode="javascript"
        onChange={(code) => setCode(code)}
        style={{ marginRight: 10 }}
      />
      <div>
        <div style={{ marginBottom: 5 }}>
          <button style={{ marginRight: 5 }} onClick={run}>
            Run
          </button>
        </div>
        <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
      </div>
    </div>
  );
}
