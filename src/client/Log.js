import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  list: {
    height: "100%",
    overflow: "auto",
  },
  text: {
    fontFamily: "monospace",
    whiteSpace: "pre-line",
  },
}));

export default function Log({ value }) {
  const classes = useStyles();
  const [atBottom, setAtBottom] = useState(true);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      if (atBottom) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }
  }, [value, logRef, atBottom]);

  const handleScroll = (event) => {
    const { target } = event;
    setAtBottom(target.scrollTop === target.scrollHeight - target.offsetHeight);
  };

  return (
    <List className={classes.list} ref={logRef} onScroll={handleScroll}>
      {(value || []).map((entry, idx) => (
        <ListItem dense divider key={idx}>
          <ListItemText
            primaryTypographyProps={{ className: classes.text }}
            primary={entry}
          />
        </ListItem>
      ))}
    </List>
  );
}
