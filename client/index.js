import React from 'react';
import ReactDOM from 'react-dom';
import AFRAME from 'aframe';

var drawComponent = require('aframe-draw-component').component;
AFRAME.registerComponent('draw', drawComponent);
require('aframe-htmltexture-component');

import MuseumScene from './reactComponents/MuseumScene'

ReactDOM.render(
  <div>
    <MuseumScene/>
  </div>
, document.getElementById('app'));
