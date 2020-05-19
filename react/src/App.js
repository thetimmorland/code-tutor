import React, { useReducer } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

import "./App.css";

const initialState = {
  editor: "",
  sketch: "",
  log: [],
};

const socket = new ReconnectingWebSocket(
  process.env.NODE_ENV === "production"
    ? "ws://tim-code-tutor.herokuapp.com/socket"
    : "ws://localhost:8080/socket"
);

function reducer(state, action) {
  switch (action.type) {
    case "startSketch":
      socket.send("bruh");
      return { ...state, sketch: state.editor, log: ["Starting Sketch..."] };

    case "stopSketch":
      return {
        ...state,
        sketch: null,
        log: [...state.log, "Stopping Sketch..."],
      };

    case "setEditor":
      return {
        ...state,
        editor: action.value,
      };

    case "log":
      return { ...state, log: [...state.log, action.message] };

    default:
      throw new Error();
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <div className="Column">
        <div className="ButtonBar">
          <button
            className="StartButton"
            onClick={() => dispatch({ type: "startSketch" })}
          >
            {"\u25B6"}
          </button>
          <button
            className="StopButton"
            onClick={() => dispatch({ type: "stopSketch" })}
          >
            {"\u25A0"}
          </button>
        </div>
        <Editor value={state.editor} dispatch={dispatch} />
        <Log className="Log" value={state.log} />
      </div>
      <div className="Column">
        <Sketch value={state.sketch} dispatch={dispatch} />
      </div>
    </div>
  );
}
