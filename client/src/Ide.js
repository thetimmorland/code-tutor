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
import "ace-builds/src-noconflict/theme-github";

import useStyles from "./useStyles";
import Sketch from "./Sketch";

const socket = new WebSocket(
  (window.location.protocol === "https:" ? "wss://" : "ws://") +
    (process.env.NODE_ENV === "production"
      ? window.location.host
      : "localhost:8080") +
    "/websocket"
);

const connection = new ShareDB.Connection(socket);

const getCode = (docRef) => {
  const { current } = docRef;
  const { data } = current || {};
  const { code } = data || {};
  return code;
};

export default function Ide() {
  const classes = useStyles();

  const { id } = useParams();

  const aceRef = useRef(null);
  const docRef = useRef(null);

  const [opsPending, setOpsPending] = useState(false);
  const [sketch, setSketch] = useState("");

  useEffect(() => {
    const editor = ace.edit(aceRef.current);
    docRef.current = connection.get("collection", id);

    docRef.current.subscribe((err) => {
      if (err) throw err;

      editor.session.setValue(docRef.current.data.code);

      editor.session.on("change", (delta) => {
        if (editor.suppress) {
          return;
        }

        console.log(delta);
        setOpsPending(true);

        setTimeout(function checkOps() {
          if (docRef.current.opsPending) {
            setTimeout(checkOps, 500);
          } else {
            setOpsPending(false);
          }
        }, 1000);

        const op = deltaToOp(editor)(delta);
        docRef.current.submitOp(op);
      });

      docRef.current.on("op", (ops, source) => {
        console.log(source);
        if (!source) {
          // if op is from server
          const deltas = ops.map(opToDelta(editor));

          // supress so deltas don't trigger change event
          editor.suppress = true;
          editor.session.getDocument().applyDeltas(deltas);
          editor.suppress = false;
        }
      });
    });

    return () => {
      docRef.current.destroy();
      editor.destroy();
    };
  }, [id]);

  const startSketch = () => {
    setSketch(getCode(docRef));
  };

  const stopSketch = () => {
    setSketch("");
  };

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

const deltaToOp = (editor) => (delta) => {
  const aceDoc = editor.session.getDocument();
  const start = aceDoc.positionToIndex(delta.start);
  const str = delta.lines.join("\n");

  if (delta.action === "insert") {
    return { p: ["code", start], si: str };
  } else if (delta.action === "remove") {
    return { p: ["code", start], sd: str };
  }
};

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
