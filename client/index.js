import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import AFRAME from 'aframe';

var drawComponent = require('aframe-draw-component').component;
AFRAME.registerComponent('draw', drawComponent);
require('aframe-htmltexture-component');

import WikiPage from './reactComponents/WikiPage'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={WikiPage}>
      <Route path='/wiki/:page' component={WikiPage} />
    </Route>
  </Router>
, document.getElementById('app'));
