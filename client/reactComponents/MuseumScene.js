require('aframe');
import React from 'react';
import Player from './Player'

const MuseumScene = () => (
  <a-scene>
    <a-assets>
    </a-assets>

    <a-sky color='blue'></a-sky>
    <a-sphere position='0 0 -6' />

    <Player/>
  </a-scene>
);

module.exports = MuseumScene;