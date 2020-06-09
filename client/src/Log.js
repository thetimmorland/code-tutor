import React from "react";
import { VariableSizeList as List } from "react-window";
import {
  Checkbox,
  Typography,
  FormControlLabel,
  Divider,
  Grid,
} from "@material-ui/core";

export default function Log({ value }) {
  const rootRef = React.useRef(null);
  const [windowWidth, setWindowWidth] = React.useState(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  React.useEffect(() => {
    // listen to resize events so log messages can recalculate their height
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (autoScroll) {
      rootRef.current.scrollToItem(value.length - 1);
    }
  }, [autoScroll, value]);

  // sizes (heights) for each log message
  const sizeMap = React.useRef({});

  const setSize = React.useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    rootRef.current.resetAfterIndex(index);
  }, []);

  const getSize = React.useCallback(
    (index) => sizeMap.current[index] || 50,
    []
  );

  const handleCheckBox = (event) => {
    setAutoScroll(event.target.checked);
  };

  return (
    <div>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <Typography variant="h6" color="primary">
            Console
          </Typography>
        </Grid>
        <Grid item>
          <FormControlLabel
            checked={autoScroll}
            onChange={handleCheckBox}
            control={<Checkbox color="primary" />}
            label="Autoscroll"
            labelPlacement="start"
          />
        </Grid>
      </Grid>
      <Divider />
      <List
        ref={rootRef}
        height={200}
        width="100%"
        itemCount={value.length}
        itemSize={getSize}
        style={{
          fontFamily: "monospace",
        }}
      >
        {({ index, style }) => (
          <div style={style}>
            <Message
              message={value[index]}
              index={index}
              setHeight={setSize}
              width={windowWidth}
            />
          </div>
        )}
      </List>
    </div>
  );
}

function Message({ message, index, setHeight, width }) {
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    // on initial render and resize set own height
    setHeight(index, rootRef.current.getBoundingClientRect().height);
  }, [setHeight, index, width]);

  return (
    <div ref={rootRef}>
      <Typography
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-line",
        }}
      >
        {message}
      </Typography>
      <Divider />
    </div>
  );
}
