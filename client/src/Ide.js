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

import { diffChars } from "diff";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver.js";

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

  const docRef = useRef(null);

  const [subscribed, setSubscribed] = useState(false);
  const [opsPending, setOpsPending] = useState(false);
  const [code, setCode] = useState("");
  const [sketch, setSketch] = useState("");

  useEffect(() => {
    docRef.current = connection.get("collection", id);
    let interval;

    docRef.current.subscribe((err) => {
      if (err) throw err;

      setCode(getCode(docRef));

      docRef.current.on("op", (source) => {
        setCode(getCode(docRef));
      });

      setSubscribed(true);
    });

    return () => {
      docRef.current.destroy();
      clearInterval(interval);
    };
  }, [id]);

  const startSketch = () => {
    setSketch(getCode(docRef));
  };

  const stopSketch = () => {
    setSketch("");
  };

  const handleChange = (newCode) => {
    const diff = diffChars(getCode(docRef), newCode);

    let offset = 0;
    diff.forEach(({ count, value, added, removed }) => {
      if (added) {
        docRef.current.submitOp({ p: ["code", offset], si: value });
      } else if (removed) {
        docRef.current.submitOp({ p: ["code", offset], sd: value });
      }

      if (!removed) offset += count;
    });

    if (diff && !opsPending) {
      setOpsPending(true);

      setTimeout(function checkOps() {
        if (docRef.current.opsPending) {
          setTimeout(checkOps, 500);
        } else {
          setOpsPending(false);
        }
      }, 1000);
    }
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
          <IconButton
            color="inherit"
            component={Link}
            href="https://p5js.org/reference/"
            target="_blank"
          >
            <LibraryBooks />
          </IconButton>
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
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper} variant="outlined" square>
              {subscribed && (
                <AceEditor
                  mode="javascript"
                  theme="github"
                  value={code}
                  onChange={handleChange}
                  tabSize={2}
                  height="100%"
                  width="100%"
                />
              )}
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
