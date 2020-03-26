import * as React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { TodoLists } from './views/Components/index';
import { createBrowserHistory } from 'history';
import './App.css';

const history = createBrowserHistory();

const App = () => (
  <main>
    <Router history={history}>
       <div>
        <Switch>
          <Route exact path='/' component={TodoLists}/>
        </Switch>
       </div>
    </Router>
  </main>
);

export default App;
