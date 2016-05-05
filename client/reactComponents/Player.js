require('aframe');
import React from 'react'

const Player = () => (
  <a-entity position='0 1.8 0'>
    <a-entity id='player' camera look-controls wasd-controls spawner='mixin: laser; on: click' click-listener/>
  </a-entity>
);

module.exports = Player;

