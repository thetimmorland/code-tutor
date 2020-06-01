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
  `{window.location.protocol === "https" ? "wss" : ws}://${window.location.host}/socket`
);

const connection = new ShareDB.Connection(socket);

const ShareContext = createContext(null);

export function useShare() {
  return useContext(ShareContext);
}

export default function Share({ children }) {
  const { id } = useParams();

  const [docExists, setDocExists] = useState(true);
  const [value, setValue] = useState({ code: "" });

  const docRef = useRef(null);

  useEffect(() => {
    if (id) {
      const document = connection.get("collection", id);

      document.subscribe((err) => {
        if (err) console.log(err);

        if (document.type === null) {
          // if document does not exist
          setDocExists(false);
        } else {
          docRef.current = document;
          setValue(document.data);
        }
      });

      document.on("op", (op, source) => {
        setValue(document.data);
      });

      return () => {
        document.destroy();
      };
    }
  }, [id]);

  const submitOp = (newValue, op) => {
    if (docRef.current) {
      docRef.current.submitOp(op);
      setValue(newValue);
    }
  };

  if (!docExists) {
    return <Redirect to="/" />;
  }

  return (
    <ShareContext.Provider value={{ value, submitOp }}>
      {children}
    </ShareContext.Provider>
  );
}
