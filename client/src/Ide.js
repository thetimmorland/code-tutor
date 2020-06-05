import React, { useState, useEffect, useRef } from "react";

import { AppBar, Toolbar, IconButton, Grid, Paper } from "@material-ui/core";

import { PlayArrow, Stop } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { useShare } from "./Share";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  main: {
    flexGrow: 1,
    display: "flex",
  },
  appBarSpacer: {
    flexGrow: 0,
    flexShrink: 0,
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    display: "flex",
  },
  leftColumn: {
    flexGrow: 0.5,
    display: "flex",
    flexDirection: "column",
  },
  rightColumn: {
    flexGrow: 0.5,
    display: "flex",
    flexDirection: "column",
  },
  editorContainer: {
    flexGrow: 0.8,
  },
  logContainer: {
    flexGrow: 0.2,
  },
  paper: {
    height: "100%",
  },
}));

export default function Ide() {
  const classes = useStyles();
  const { value } = useShare() || {};
  const { code } = value || {};
  const codeRef = useRef(null);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const [sketch, setSketch] = useState("");
  const [log, setLog] = useState([]);

  const startSketch = () => {
    setSketch(codeRef.current);
  };

  const stopSketch = () => {
    setSketch("");
  };

  useEffect(() => {
    if (sketch) {
      setLog(["Starting Sketch..."]);
    } else {
      setLog((log) => [...log, "Sketch Stopped."]);
    }
  }, [sketch]);

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" color="inherit" onClick={startSketch}>
            <PlayArrow />
          </IconButton>
          <IconButton color="inherit" onClick={stopSketch}>
            <Stop />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <div className={classes.appBarSpacer} />
        <div className={classes.content}>
          <div className={classes.leftColumn}>
            <div className={classes.editorContainer}>
              <Paper className={classes.paper} variant="outlined">
                <Editor />
              </Paper>
            </div>
            <div className={classes.logContainer}>
              <Paper className={classes.paper} variant="outlined">
                <Log value={log} />
              </Paper>
            </div>
          </div>
          <div className={classes.rightColumn}>
            <Paper className={classes.paper} variant="outlined">
              <Sketch value={sketch} setLog={setLog} />
            </Paper>
          </div>
        </div>
      </main>
    </div>
  );
}
