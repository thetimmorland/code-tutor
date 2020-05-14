import React, { forwardRef } from "react";

const errorHijacker = `
    // catch reference errors, via http://stackoverflow.com/a/12747364/2994108
    window.onerror = function (msg, url, lineNumber, columnNo, error) {
        window.parent.postMessage({error: {msg, lineNumber, columnNo}}, '*');
      return false;
    };
  `;

const Sketch = forwardRef((props, ref) => {
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

  const code = srcDoc.createElement("script");
  code.innerHTML = props.value;
  srcDoc.head.appendChild(code);

  const onError = srcDoc.createElement("script");
  onError.innerHTML = errorHijacker;
  srcDoc.head.appendChild(onError);

  return (
    <iframe
      ref={ref}
      title="sketch"
      srcDoc={srcDoc.documentElement.outerHTML}
      frameBorder={0}
      style={{ width: "100%", height: "100%" }}
      sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms allow-modals"
    />
  );
})

export default Sketch;
