import React from "react";
import { VariableSizeList as List } from "react-window";
import { Typography, Divider } from "@material-ui/core";

export default function Log({ value }) {
  const rootRef = React.useRef(null);
  const [windowWidth, setWindowWidth] = React.useState(null);

  React.useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sizeMap = React.useRef({});

  const setSize = React.useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    rootRef.current.resetAfterIndex(index);
  }, []);

  const getSize = React.useCallback(
    (index) => sizeMap.current[index] || 50,
    []
  );

  return (
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
  );
}

function Message({ message, index, setHeight, width }) {
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    setHeight(index, rootRef.current.getBoundingClientRect().height);
  }, [width]);

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
