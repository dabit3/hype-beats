import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Machines from './Machines'
import Machine from './DrumMachine'

function Main() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Machines} />
          <Route path="/machine/:id/:name?" component={Machine} />
        </Switch>
      </div>
    </Router>
  )
}

export default Main