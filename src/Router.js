import React from 'react'
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'

import Machines from './Machines'
import Machine from './DrumMachine'

function Main() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Machines} />
          <Route path="/machine/:id" component={Machine} />
        </Switch>
      </div>
    </Router>
  )
}

export default Main