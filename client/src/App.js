import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

import CreateSketch from "./CreateSketch";
import Ide from "./Ide";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/">
            <CreateSketch />
          </Route>
          <Route path="/:id">
            <Ide />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
