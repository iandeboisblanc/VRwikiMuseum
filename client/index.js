import React from 'react';
import ReactDOM from 'react-dom';
import AFRAME from 'aframe';

var drawComponent = require('aframe-draw-component').component;
AFRAME.registerComponent('draw', drawComponent);
var htmltextureComponent = require('aframe-htmltexture-component').component;
// AFRAME.registerComponent('htmltexture', htmltextureComponent);


import MuseumScene from './reactComponents/MuseumScene'
// require('aframe-htmltexture-component');

ReactDOM.render(
  <div>
    <MuseumScene/>
  </div>
, document.getElementById('app'));
