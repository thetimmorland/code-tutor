import React, { useState, useEffect } from "react";
import { Divider } from "@material-ui/core";
import Log from "./Log";

const docTemplate = `
<style type="text/css">body { margin: 0px; padding 0px; font-size: 0 }</style>
<script>
window.onerror = function (text, url, row, column, error) {
  const payload = row + ":" + column + " " + text;
  window.parent.postMessage({ source: "code-tutor-bridge", payload }, '*');
  return true;
};
var console = {
  log: function () {
    let payload = "";

    for(idx = 0; idx < arguments.length; idx++) {
      payload += arguments[idx];
    };

    window.parent.postMessage({ source: "code-tutor-bridge", payload }, '*');
  }
};
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
<html><head></head><body></body></html>
`.replace(/(\r\n|\n|\r)/gm, "");

const Sketch = React.memo(({ value }) => {
  const [log, setLog] = useState([]);

  useEffect(() => {
    function eventHandler(message) {
      if (message.data.source === "code-tutor-bridge") {
        const { payload } = message.data;
        console.log(payload);
        setLog((log) => [...log, payload]);
      }
    }

    window.addEventListener("message", eventHandler);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, []);

  useEffect(() => {
    if (value === "") {
      setLog((log) => [...log, "Sketch Stopped."]);
    } else {
      setLog(["Starting Sketch..."]);
    }
  }, [value]);

  const parser = new DOMParser();
  const srcDoc = parser.parseFromString(docTemplate, "text/html");

  const sketch = srcDoc.createElement("script");
  sketch.innerHTML = value || "";
  srcDoc.head.appendChild(sketch);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1 }}>
        <iframe
          className="Sketch"
          title="sketch"
          srcDoc={srcDoc.documentElement.outerHTML}
          frameBorder={0}
          sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms allow-modals"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <Log value={log} />
    </div>
  );
});

export default Sketch;
