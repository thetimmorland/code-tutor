import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Share from './Share';
import CreateSketch from './CreateSketch';
import Ide from './Ide';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <CreateSketch />
        </Route>
        <Route path="/:id">
          <Share>
            <Ide />
          </Share>
        </Route>
      </Switch>
    </Router>
  );
}
