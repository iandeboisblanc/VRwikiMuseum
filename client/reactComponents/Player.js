import React from 'react'

const Player = (props) => {
  var position = props.position || '0 1.8 0';
  return (
    <a-entity position={position} 
      limitPlayer={`xBounds:${props.xBounds}; yBounds:${props.yBounds}; zBounds:${props.zBounds}`}>
      <a-camera id='player' look-controls wasd-controls/>
    </a-entity>
  )
};

module.exports = Player;

AFRAME.registerComponent('limitPlayer', {
  schema: {
    xBounds: {default: ''},
    yBounds: {default: ''},
    zBounds: {default: ''}
  },

  init: function () {
    console.log(this);
    console.log(this.data.xBounds, this.data.yBounds, this.data.zBounds);
    this.camera = this.el.sceneEl.querySelector('#player');
    //this.data.bounds;
  },

  tick: function () {
    var cameraPosition = this.camera.components.position.data;
    // if(cameraPosition.x > )
    //if camera intersects with threshhold, trigger event (link)
  }
})

