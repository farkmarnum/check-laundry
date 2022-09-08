import { Route, Router } from 'preact-router';
import { createHashHistory } from 'history';

import Home from './components/Home';
import Station from './components/Station';

import './style';

const Root = () => (
  // @see https://github.com/preactjs/preact-router/issues/423
  <Router history={createHashHistory() as any}>
    <Route path="/" component={Home} />
    <Route path="/stations/:stationId" component={Station} />
  </Router>
);

export default Root;
