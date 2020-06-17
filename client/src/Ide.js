import React, { useState, useEffect, useRef } from "react";

import {
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Link,
} from "@material-ui/core";
import { PlayArrow, Stop, LibraryBooks } from "@material-ui/icons";

import WebSocket from "reconnecting-websocket";
import ShareDB from "sharedb/lib/client";
import { useParams, Redirect } from "react-router-dom";

import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/webpack-resolver"; // needed for webpack

import useStyles from "./useStyles";
import Sketch from "./Sketch";

const socket = new WebSocket(
  // set websocket protocol depending on ssl status of page
  (window.location.protocol === "https:" ? "wss://" : "ws://") +
    // set websocket location depending on nodeENV
    (process.env.NODE_ENV === "production"
      ? window.location.host
      : "localhost:8080") +
    "/websocket"
);

const connection = new ShareDB.Connection(socket);

// helper function to extract code from a shareDb docRef
const getCode = (docRef) => {
  const { current } = docRef;
  const { data } = current || {};
  const { code } = data || {};
  return code || "";
};

export default function Ide() {
  const classes = useStyles();

  const { id } = useParams(); // doc id

  const aceRef = useRef(null); // points to editor
  const docRef = useRef(null); // points to sharedb doc

  const [opsPending, setOpsPending] = useState(false); // indicates save status

  useEffect(() => {
    // create editor object and apply settings
    const editor = ace.edit(aceRef.current);
    editor.setOptions({
      mode: "ace/mode/javascript",
      tabSize: 2,
      useSoftTabs: 2,
    });

    docRef.current = connection.get("collection", id);

    docRef.current.subscribe((err) => {
      if (err) throw err;

      // set editor to inital state`
      editor.session.setValue(docRef.current.data.code);

      editor.session.on("change", function handleEditorDelta(delta) {
        // if delta emitted due to remote change do nothing
        if (editor.suppress) {
          return;
        }

        const op = deltaToOp(editor)(delta);
        docRef.current.submitOp(op);

        setOpsPending(true);

        // clear previous timeout if this function was called again before the last one finished
        if (typeof handleEditorDelta.timeout != "undefined") {
          clearTimeout(handleEditorDelta.timeout);
        }

        // setup recursive timeout to check every second if ops have been sent yet
        handleEditorDelta.timeout = setTimeout(function updateOpsPending() {
          if (docRef.current.pendingOps.length === 0) {
            setOpsPending(false);
          } else {
            handleEditorDelta.timeout = setTimeout(updateOpsPending, 1000);
          }
        }, 1000);
      });

      docRef.current.on("op", (ops, source) => {
        // only apply ops which are remote
        if (!source) {
          const { session } = editor;

          // prepare for application of operations to editor by:
          // 1. setting global variable which prevents the delta handler from emitting events
          // 2. creating a new undo group which can be ignored and kept off the local undo stack

          editor.suppress = true;
          const remoteChange = session.$undoManager.startNewGroup();

          const deltas = ops.map(opToDelta(editor));
          session.getDocument().applyDeltas(deltas);

          session.$undoManager.markIgnored(remoteChange);
          editor.suppress = false;
        }
      });
    });

    return () => {
      docRef.current.destroy();
      editor.destroy();
    };
  }, [id]);

  useEffect(() => {
    // warn on page close if ops are pending
    if (opsPending) {
      function handleUnload(event) {
        event.preventDefault();
        event.returnValue = "Changes you made may not be saved.";
      }
      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [opsPending]);

  const [sketch, setSketch] = useState(""); // frozen state of code sent to sketch runner

  const startSketch = () => {
    setSketch(getCode(docRef));
  };

  const stopSketch = () => {
    setSketch("");
  };

  // if doc doesn't exist redirect
  if (docRef.current && !docRef.current.type) {
    return <Redirect to="/" />;
  }

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={startSketch}>
            <PlayArrow />
          </IconButton>
          <IconButton color="inherit" onClick={stopSketch}>
            <Stop />
          </IconButton>
          <Link
            color="inherit"
            href="https://p5js.org/reference/"
            target="_blank"
          >
            <IconButton color="inherit">
              <LibraryBooks />
            </IconButton>
          </Link>
          <div className={classes.toolBarSpacer} />
          {opsPending && (
            <CircularProgress
              className={classes.appBarSpinner}
              size={20}
              color="inherit"
            />
          )}
          <Typography className={classes.appBarText}>
            {opsPending ? "Saving" : "Saved"}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacer} />
      <main className={classes.main}>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper} variant="outlined" square>
              <div style={{ height: "100%", width: "100%" }} ref={aceRef} />
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper} variant="outlined" square>
              <Sketch value={sketch} />
            </Paper>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

// converts an ace editor delta object to a sharedb operation
const deltaToOp = (editor) => (delta) => {
  const aceDoc = editor.session.getDocument();
  const start = aceDoc.positionToIndex(delta.start);
  const str = delta.lines.join("\n");

  if (delta.action === "insert") {
    return { p: ["code", start], si: str };
  } else if (delta.action === "remove") {
    return { p: ["code", start], sd: str };
  } else {
    throw new Error(`Invalid Delta: ${JSON.stringify(delta)}`);
  }
};

// converts a sharedb operation to an ace editor delta object
const opToDelta = (editor) => (op) => {
  console.log(op);
  const index = op.p[1];

  const { si, sd } = op;

  const start = editor.session.doc.indexToPosition(index, 0);
  let end;
  let action;
  let lines;

  if (si) {
    action = "insert";
    lines = si.split("\n");
    if (lines.length === 1) {
      end = {
        row: start.row,
        column: start.column + si.length,
      };
    } else {
      end = {
        row: start.row + (lines.length - 1),
        column: lines[lines.length - 1].length,
      };
    }
  } else if (sd) {
    action = "remove";
    lines = sd.split("\n");
    const count = lines.reduce(
      (total, line) => total + line.length,
      lines.length - 1
    );
    end = editor.session.doc.indexToPosition(index + count, 0);
  } else {
    throw new Error(`Invalid Operation: ${JSON.stringify(op)}`);
  }

  return { start, end, action, lines };
};
