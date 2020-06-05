import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";

import WebSocket from "reconnecting-websocket";
import ShareDB from "sharedb/lib/client";
import { useParams, Redirect } from "react-router-dom";

const socket = new WebSocket(
  (window.location.protocol === "https:" ? "wss://" : "ws://") +
    (process.env.NODE_ENV == "production"
      ? window.location.host
      : "localhost:8080") +
    "/websocket"
);

const connection = new ShareDB.Connection(socket);

const ShareContext = createContext(null);

export function useShare() {
  return useContext(ShareContext);
}

export default function Share({ children }) {
  const { id } = useParams();
  const [value, setValue] = useState();
  const docRef = useRef(null);

  useEffect(() => {
    docRef.current = connection.get("collection", id);

    docRef.current.subscribe((err) => {
      if (err) throw err;

      setValue({ ...docRef.current.data });

      docRef.current.on("op", () => {
        setValue({ ...docRef.current.data });
      });
    });

    return () => {
      docRef.current.destroy();
    };
  }, [id]);

  const submitOp = (op) => {
    console.log(op);
    docRef.current.submitOp(op);
  };

  if (docRef.current && !docRef.current.type) {
    return <Redirect to="/" />;
  }

  return (
    docRef.current && (
      <ShareContext.Provider value={{ value, submitOp }}>
        {children}
      </ShareContext.Provider>
    )
  );
}
