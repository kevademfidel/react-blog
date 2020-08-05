import React from 'react';
import { Route, Switch } from 'react-router-dom';
import About from './about';
import Home from './home';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </div>
  );
}

export default App;
