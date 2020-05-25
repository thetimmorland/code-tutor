import { useEffect, useRef, useState } from "react";
import ShareDB from "sharedb/lib/client";
import { diffChars } from "diff";

const socket = new WebSocket(
  process.env.NODE_ENV === "production"
    ? `wss://tim-code-tutor.herokuapp.com`
    : `ws://localhost:8080`
);

const connection = new ShareDB.Connection(socket);

export default function useShareDB() {
  const docRef = useRef(null);
  const valueRef = useRef(null);

  const [value, setValue] = useState("");

  useEffect(() => {
    const document = connection.get("collection", "0");

    document.fetch((err) => {
      if (!document.type) {
        document.create({ value: "test" }, (err) => {
          console.log(err);
        });
      }
    });

    document.subscribe((err) => {
      if (!err) {
        docRef.current = document;
        setValue(document.data.value);
      } else {
        console.log(err);
      }
    });

    document.on("op", (op, source) => {
      docRef.current = document;
      setValue(document.data.value);
    });

    return () => {
      document.destroy();
    };
  }, []);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleChange = (newValue) => {
    const diff = diffChars(valueRef.current, newValue);

    let offset = 0;
    diff.forEach(({ count, value, added, removed }) => {
      if (added) {
        docRef.current.submitOp({ p: ["value", offset], si: value });
      } else if (removed) {
        docRef.current.submitOp({ p: ["value", offset], sd: value });
      }

      if (!removed) offset += count;
    });

    setValue(newValue);
  };

  return [value, handleChange];
}
