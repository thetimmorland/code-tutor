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
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
  },
  appBarSpacer: {
    flexGrow: 0,
    flexShrink: 0,
    ...theme.mixins.toolbar,
  },
  content: {
    display: "flex",
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    height: "100%",
    padding: theme.spacing(2),
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
          <Grid container spacing={2}>
            <Grid item xs={6} container direction="column" spacing={2}>
              <Grid item style={{ height: "75%" }}>
                <Paper className={classes.paper} variant="outlined">
                  <Editor />
                </Paper>
              </Grid>
              <Grid item style={{ height: "25%" }}>
                <Paper className={classes.paper} variant="outlined">
                  <Log value={log} />
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper} variant="outlined">
                <Sketch value={sketch} setLog={setLog} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
  );
}
