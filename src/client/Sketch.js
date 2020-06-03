import React, { useEffect } from "react";

const bridgeScript = `
  window.onerror = function (text, url, row, column, error) {
    const payload = row + ":" + column + " " + text;
    window.parent.postMessage({ source: "code-tutor-bridge", payload}, '*');
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
  `.replace(/\n/g, "");

export default function Sketch({ value, setLog }) {
  useEffect(() => {
    function eventHandler(message) {
      if (message.data.source === "code-tutor-bridge") {
        const { payload } = message.data;
        if (typeof payload === "string") {
          setLog((log) => [...log, payload]);
        }
      }
    }

    window.addEventListener("message", eventHandler);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [setLog]);

  const parser = new DOMParser();

  const srcDoc = parser.parseFromString(
    "<html><head></head><body></body></html>",
    "text/html"
  );

  const style = srcDoc.createElement("style");
  style.type = "text/css";
  style.innerHTML = "body { margin: 0px; padding 0px; font-size: 0 }";
  srcDoc.head.appendChild(style);

  const p5 = srcDoc.createElement("script");
  p5.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js";
  srcDoc.head.appendChild(p5);

  const bridge = srcDoc.createElement("script");
  bridge.innerHTML = bridgeScript;
  srcDoc.head.appendChild(bridge);

  const sketch = srcDoc.createElement("script");
  sketch.innerHTML = value;
  srcDoc.head.appendChild(sketch);

  return (
    <div style={{ flexGrow: 1 }}>
      <iframe
        title="sketch"
        srcDoc={srcDoc.documentElement.outerHTML}
        frameBorder={0}
        style={{ width: "100%", height: "100%" }}
        sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms allow-modals"
      />
    </div>
  );
}
