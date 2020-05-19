import React, { useReducer, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

import Sketch from "./Sketch";
import Editor from "./Editor";
import Log from "./Log";

import "./App.css";

const socket = new ReconnectingWebSocket(
  process.env.NODE_ENV === "production"
    ? `wss://tim-code-tutor.herokuapp.com`
    : `ws://localhost:8080`
);

const initialState = {
  socket: null,
  sketch: "",
  editor: "",
  log: [],
};

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case "startSketch":
      return { ...state, sketch: state.editor, log: ["Starting Sketch..."] };

    case "stopSketch":
      return {
        ...state,
        sketch: null,
        log: [...state.log, "Stopping Sketch..."],
      };

    case "setEditor":
      return { ...state, editor: action.value };

    case "appendLog":
      return { ...state, log: [...state.log, action.value] };

    default:
      throw new Error();
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.onmessage = (msg) => {
      dispatch({ type: "setEditor", value: msg.data });
    };
  }, []);

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
        <Editor value={state.editor} socket={socket} />
        <Log className="Log" value={state.log} />
      </div>
      <div className="Column">
        <Sketch value={state.sketch} dispatch={dispatch} />
      </div>
    </div>
  );
}
