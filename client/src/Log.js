import React from "react";
import { Typography } from "@material-ui/core";
import { FixedSizeList } from "react-window";

export default function Log({ value }) {
  return (
    <>
      <FixedSizeList
        className="Log"
        height={200}
        itemSize={24}
        itemCount={value.length}
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-line",
        }}
      >
        {({ index, style }) => (
          <Typography
            key={index}
            style={{
              ...style,
              fontFamily: "monospace",
              whiteSpace: "pre-line",
            }}
          >
            {value[index]}
          </Typography>
        )}
      </FixedSizeList>
    </>
  );
}
