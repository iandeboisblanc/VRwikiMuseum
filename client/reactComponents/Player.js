import React from 'react'

const Player = () => (
  <a-entity position='0 1.8 0'>
    <a-entity id='player' look-controls wasd-controls/>
  </a-entity>
);

module.exports = Player;

