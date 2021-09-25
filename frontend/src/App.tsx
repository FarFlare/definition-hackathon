import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import chainStore from 'src/stores/chainStore';

import { routes } from "./routes/index";

const App = () => {
  useEffect(() => {
    const init = async () => {
      await chainStore.loadWeb3();
      await chainStore.loadBlockChain();
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Router>
      <Switch>
        {routes.map(({ path, component }) => (
          <Route path={path} component={component} />
        ))}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
