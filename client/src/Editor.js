import React from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver.js";

export default function Editor(props) {
  return (
    <AceEditor
      mode="javascript"
      theme="github"
      focus={true}
      value={props.value}
      tabSize={2}
      onChange={props.onChange}
      annotations={[]}
      width="100%"
      height="100%"
    />
  );
}
