import React, { useEffect, useRef } from "react";
import { diffChars } from "diff";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver.js";

import { useShare } from "./Share";

export default function Editor() {
  const { value, submitOp } = useShare();
  const codeRef = useRef(null);

  useEffect(() => {
    codeRef.current = value.code;
  }, [value]);

  const handleChange = (newCode) => {
    const diff = diffChars(codeRef.current, newCode);

    let offset = 0;
    diff.forEach(({ count, value, added, removed }) => {
      if (added) {
        submitOp(
          { ...value, code: newCode },
          { p: ["code", offset], si: value }
        );
      } else if (removed) {
        submitOp(
          { ...value, code: newCode },
          { p: ["code", offset], sd: value }
        );
      }

      if (!removed) offset += count;
    });
  };

  return (
    <AceEditor
      mode="javascript"
      theme="github"
      value={value.code}
      tabSize={2}
      onChange={handleChange}
      annotations={[]}
      width="100%"
      height="100%"
    />
  );
}
