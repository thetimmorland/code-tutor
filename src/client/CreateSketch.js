import React, { useState, useEffect } from "react";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import { Redirect } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function CreateSketch() {
  const classes = useStyles();
  const [id, setId] = useState();

  useEffect(() => {
    axios.get("/api/createSketch").then((res) => {
      setId(res.data);
    });
  }, []);

  return id ? (
    <Redirect to={id} />
  ) : (
    <Backdrop className={classes.backdrop} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
