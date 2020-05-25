import React from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver.js";

export default function Editor({ value, handleChange }) {
  return (
    <AceEditor
      mode="javascript"
      theme="github"
      value={value}
      tabSize={2}
      onChange={handleChange}
      annotations={[]}
      width="100%"
      height="100%"
    />
  );
}
