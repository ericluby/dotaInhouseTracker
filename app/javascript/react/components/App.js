import React from "react"
import { Route, Switch, BrowserRouter } from "react-router-dom"

import InhouseIndexContainer from './InhouseIndexContainer'
import GetMatchIDForm from './GetMatchIDForm'
import MainContainer from './MainContainer'

export const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path = "/" component={MainContainer}/>
      </Switch>
    </BrowserRouter>
  )
}

export default App
