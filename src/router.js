import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Funds from './routes/funds_route';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/funds" exact component={Funds} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
