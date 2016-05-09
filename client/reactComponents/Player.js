import React from 'react'

const Player = (props) => {
  var position = props.position || '0 1.8 0';
  return (
    <a-entity id='cameraParent' wasd-controls position={position} >
      <a-camera id='player' look-controls 
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
    var parentEl = this.el.sceneEl.querySelectorAll('#cameraParent')[0];
    var parentPosition = parentEl.components.position.data;
    if(this.xBounds) {
      if(cameraPosition.x < this.xBounds[0] || cameraPosition.x > this.xBounds[1]) {
        console.log('Out of xBounds');
        // console.log(cameraPosition, parentPosition);
        var boundedPosition = Math.min(Math.max(this.xBounds[0], cameraPosition.x), this.xBounds[1]);
        parentEl.setAttribute('position', `${boundedPosition} ${parentPosition.y} ${parentPosition.z}`);
        this.el.setAttribute('position', `${boundedPosition} ${cameraPosition.y} ${cameraPosition.z}`);
      }
    }
    if(this.yBounds) {
      if(cameraPosition.y < this.yBounds[0] || cameraPosition.y > this.yBounds[1]) {
        console.log('Out of yBounds');
        var boundedPosition = Math.min(Math.max(this.yBounds[0], cameraPosition.y), this.yBounds[1]);
        parentEl.setAttribute('position', `${parentPosition.x} ${boundedPosition} ${parentPosition.z}`);
        this.el.setAttribute('position', `${cameraPosition.x} ${boundedPosition} ${cameraPosition.z}`);
      }
    }
    if(this.zBounds) {
      if(cameraPosition.z < this.zBounds[0] || cameraPosition.z > this.zBounds[1]) {
        console.log('Out of zBounds');
        var boundedPosition = Math.min(Math.max(this.zBounds[0], cameraPosition.z), this.zBounds[1]);
        parentEl.setAttribute('position', `${parentPosition.x} ${parentPosition.y} ${boundedPosition}`);
        this.el.setAttribute('position', `${cameraPosition.x} ${cameraPosition.y} ${boundedPosition}`);
      }
    }
  }
})

