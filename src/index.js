import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {createStore } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import craps from './reducers';
import Craps from './containers/Craps';
import './index.css';

let store = createStore(craps);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Craps} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
