import { Route, Router } from 'preact-router';

import Home from './components/Home';
import Station from './components/Station';

import './style';

const Root = () => (
  <Router>
    <Route path="/" component={Home} />
    <Route path="/stations/:stationId" component={Station} />
  </Router>
);

export default Root;
