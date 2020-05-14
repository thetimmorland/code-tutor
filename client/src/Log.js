import React from "react";

export default function Log(props) {
  return (
    <div className={props.className}>
      {props.value.map((entry) => (
        <p>{entry}</p>
      ))}
    </div>
  );
}
