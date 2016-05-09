import React from 'react'

const Player = (props) => {
  var position = props.position || '0 1.8 0';
  return (
    <a-entity position={position} >
      <a-camera id='player' look-controls wasd-controls
        limitPlayer={`xBounds:${props.xBounds}; yBounds:${props.yBounds}; zBounds:${props.zBounds}`}
      />
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
    // console.log(this.data.xBounds, this.data.yBounds, this.data.zBounds);
    for(var property in this.data) {
      if(this.data[property] !== 'undefined') {
        this[property] = this.data[property].split(',').map((value) => Number(value));
      }
      // console.log(property, this[property]);
    }
  },

  tick: function () {
    var cameraPosition = this.el.components.position.data;
    if(this.xBounds) {
      if(cameraPosition.x < this.xBounds[0] || cameraPosition.x > this.xBounds[1]) {
        console.log('Out of xBounds');
      }
    }
    if(this.yBounds) {
      if(cameraPosition.y < this.yBounds[0] || cameraPosition.y > this.yBounds[1]) {
        console.log('Out of yBounds');
      }
    }
    if(this.zBounds) {
      if(cameraPosition.z < this.zBounds[0] || cameraPosition.z > this.zBounds[1]) {
        console.log('Out of zBounds');
      }
    }
  }
})

