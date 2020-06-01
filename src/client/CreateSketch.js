import axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function CreateSketch() {
  const [id, setId] = useState();

  useEffect(() => {
    axios.get("/api/createSketch").then((res) => {
      setId(res.data);
    });
  }, []);

  return id ? <Redirect to={id} /> : null;
}
