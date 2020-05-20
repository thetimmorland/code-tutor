import React, { useRef, useEffect } from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver.js";

import socketIO from "socket.io-client";

import { diffChars } from "diff";

const socket = new socketIO(
  process.env.NODE_ENV === "production"
    ? `tim-code-tutor.herokuapp.com`
    : `localhost:8080`
);

export default function Editor(props) {
  const code = useRef(props.code);

  useEffect(() => {
    socket.on("change", []);
  });

  useEffect(() => {
    code.current = props.code;
  }, [props]);

  useEffect(() => {
    socket.on("sync", (newCode) => {
      props.setCode((code) => ({ ...code, editor: newCode }));
    });

    socket.on("insert", ([offset, value]) => {});

    socket.on("remove", ([offset, value]) => {});
  });

  const handleChange = (newCode) => {
    const diff = diffChars(code.current, newCode);

    let offset = 0;
    diff.forEach(({ count, value, added, removed }) => {
      if (added) {
        socket.emit("insert", [offset, value]);
      } else if (removed) {
        socket.emit("remove", [offset, value]);
      }

      if (!removed) {
        offset += count;
      }
    });

    props.setCode((code) => ({ ...code, editor: newCode }));
  };

  return (
    <AceEditor
      mode="javascript"
      theme="github"
      value={props.code}
      tabSize={2}
      debounceChangePeriod={500}
      onChange={handleChange}
      annotations={[]}
      width="100%"
      height="100%"
    />
  );
}
