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
    var parentPosition = this.el.sceneEl.querySelectorAll('#cameraParent')[0].object3D.position;
    if(this.xBounds) {
      if(cameraPosition.x < this.xBounds[0] || cameraPosition.x > this.xBounds[1]) {
        console.log('Out of xBounds');
        console.log(cameraPosition, parentPosition);
        // console.log(this.el.sceneEl.querySelectorAll('#cameraParent')[0])
        this.el.sceneEl.querySelectorAll('#cameraParent')[0].setAttribute('position', Math.min(Math.max(this.xBounds[0], cameraPosition.x)), this.xBounds[1])
        // parentPosition.set(Math.min(Math.max(this.xBounds[0], cameraPosition.x)), this.xBounds[1]);
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

