import React, { useEffect, useRef } from "react";
import { diffChars } from "diff";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver.js";

import { useShare } from "./Share";

export default function Editor() {
  const { value, submitOp } = useShare();
  const { code } = value || {};
  const codeRef = useRef(null);

  useEffect(() => {
    codeRef.current = code;
  }, [value]);

  const handleChange = (newValue) => {
    console.log(newValue);
    const diff = diffChars(codeRef.current, newValue.replace(/\r\n/g, "\n"));

    let offset = 0;
    diff.forEach(({ count, value, added, removed }) => {
      if (added) {
        submitOp({ p: ["code", offset], si: value });
      } else if (removed) {
        submitOp({ p: ["code", offset], sd: value });
      }

      if (!removed) offset += count;
    });
  };

  return (
    <AceEditor
      mode="javascript"
      theme="github"
      defaultValue={code}
      value={code}
      tabSize={2}
      onChange={handleChange}
      debounceChangePeriod={50}
      annotations={[]}
      width="100%"
      height="100%"
    />
  );
}
