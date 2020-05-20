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

export default function Editor({ code, setCode }) {
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    socket.on("sync", (newCode) => {
      setCode((code) => ({ ...code, editor: newCode }));
    });

    socket.on("insert", ({ offset, value }) => {
      console.log(offset, value);
      setCode((code) => {
        try {
          const front = code.editor.slice(0, offset);
          const back = code.editor.slice(offset);
          return { ...code, editor: front + value + back };
        } catch (err) {
          console.log(err);
          return code;
        }
      });
    });

    socket.on("remove", ({ offset, count, value }) => {
      setCode((code) => {
        try {
          const front = code.editor.slice(0, offset);
          const back = code.editor.slice(offset + count);
          return { ...code, editor: front + back };
        } catch (err) {
          console.log(err);
          return code;
        }
      });
    });
  }, [setCode]);

  const handleChange = (newCode) => {
    const diff = diffChars(codeRef.current, newCode);

    let offset = 0;
    diff.forEach(({ count, value, added, removed }) => {
      if (added) {
        socket.emit("insert", { offset, value });
      } else if (removed) {
        socket.emit("remove", { offset, count, value });
      }

      if (!removed) {
        offset += count;
      }
    });

    setCode((code) => ({ ...code, editor: newCode }));
  };

  return (
    <AceEditor
      mode="javascript"
      theme="github"
      value={code}
      tabSize={2}
      onChange={handleChange}
      annotations={[]}
      width="100%"
      height="100%"
    />
  );
}
