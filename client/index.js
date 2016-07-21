import React from 'react';
import ReactDOM from 'react-dom';
import AFRAME from 'aframe';
import WikiPage from './reactComponents/WikiPage'

var drawComponent = require('aframe-draw-component').component;
AFRAME.registerComponent('draw', drawComponent);
require('aframe-htmltexture-component');

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

ReactDOM.render(
  <div>
    <WikiPage isTouch={isTouch} />
  </div>
, document.getElementById('app'));
