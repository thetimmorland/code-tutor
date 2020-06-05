import React, { useState, useEffect, useRef } from "react";

import { AppBar, Toolbar, IconButton, Paper } from "@material-ui/core";

import { PlayArrow, Stop, CallReceived } from "@material-ui/icons";

import { useShare } from "./Share";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
  },
  main: {
    flexGrow: 1,
    display: "flex",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  content: {
    display: "flex",
    flexGrow: 1,
    flexBasis: "auto",
  },
  column: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  paper: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
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
      <div className={classes.appBarSpacer} />
      <main className={classes.main}>
        <div className={classes.column}>
          <Paper
            className={classes.paper}
            style={{ flexGrow: 1 }}
            variant="outlined"
            square
          >
            <Editor />
          </Paper>
          <Paper className={classes.paper} variant="outlined" square>
            <Log value={log} />
          </Paper>
        </div>
        <div className={classes.column}>
          <Paper
            className={classes.paper}
            style={{ flexGrow: 1 }}
            variant="outlined"
            square
          >
            <Sketch value={sketch} setLog={setLog} />
          </Paper>
        </div>
      </main>
    </div>
  );
}
