import React, { useState, useEffect } from "react";
import Log from "./Log";

// doc template containing error and console hijackers
// template is flattened to a single line so errors in user code have correct line numbers
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
  const [log, setLog] = useState([]); // console state

  useEffect(() => {
    // messages emitted by hijacked console and error events are caught here
    // and applied to log array
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
    // add messages to log when code starts or stops
    if (value === "") {
      setLog((log) => [...log, "Sketch Stopped."]);
    } else {
      setLog(["Starting Sketch..."]);
    }
  }, [value]);

  // insert user code into template
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
          sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms allow-modals"
          style={{
            height: "100%",
            width: "100%",
            border: "1px grey solid",
          }}
        />
      </div>
      <Log value={log} />
    </div>
  );
});

export default Sketch;
