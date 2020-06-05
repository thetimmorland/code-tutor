import React, { useState, useEffect, useRef } from "react";

import { ListItem, ListItemText } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { FixedSizeList } from "react-window";

const useStyles = makeStyles((theme) => ({
  primary: {
    fontFamily: "monospace",
    whiteSpace: "pre-line",
  },
}));

export default function Log({ value }) {
  const classes = useStyles();

  return (
    <FixedSizeList height={200} itemSize={32} itemCount={value.length}>
      {({ index, style }) => (
        <ListItem style={style} key={index}>
          <ListItemText
            primary={value[index]}
            primaryTypographyProps={{ className: classes.primary }}
          />
        </ListItem>
      )}
    </FixedSizeList>
  );
}
