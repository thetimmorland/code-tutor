import React, { useState, useEffect } from "react";

import ShareDB from "sharedb/lib/client";
import WebSocket from "reconnecting-websocket";

const server = "ws://localhost:8080";

const sketchTemplate = `var lastPrint;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  lastPrint = millis();
}

function draw() {
  // put drawing code here
  background(220);
  circle(mouseX, mouseY, 100);

  if (millis() - lastPrint > 1000) {
    print("X: ", mouseX, " Y: ", mouseY);
    lastPrint = millis();
  }
}`;

export default function useShareDB({ id }) {
  const socket = new WebSocket(server);
  const connection = new ShareDB.Connection(socket);
  const doc = connection.get("collection", id);
  doc.fetch();

  console.log(doc);

  const [value, setValue] = useState();
}
