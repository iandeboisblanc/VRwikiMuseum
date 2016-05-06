require('aframe');
import React from 'react'
import {render} from 'react-dom'

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.position = this.props.position.split(' ').map((value, i) => {
      return i == 1 ? value + props.height : value;
    }).join(' ');
  }

  render () {
    return (
      <a-entity class='portal' 
        position={this.position} 
        rotation='0 30 0' color='blue'
        //hideRoom={'camera:' + this.props.player}
        >
        <a-plane class='portalThreshhold' 
          // material='transparent:true;' 
          height={this.props.height} 
          width={this.props.width} 
        />
        <a-plane 
          material='transparent:true;' height={this.props.height} width='2' 
          rotation='0 90 0' position={this.props.width / 2 + ' 0 -1'} 
        />
        <a-plane 
          material='transparent:true;' height={this.props.height} width='2' 
          rotation='0 90 0' position={-this.props.width / 2 + ' 0 -1'} 
        />
        <a-box class='portalInterior'
          position='0 0 -1'
          material='color:red;side:back' height={this.props.height} width={this.props.width} depth='2' 
        />
      </a-entity>
    );
  }
}

module.exports = Portal;


/*

AFRAME.registerComponent('hideRoom', {
  schema: {
    camera: { default: '' }
  },

  init: function () {
    this.camera = this.el.sceneEl.querySelector(this.data.camera);
    // this.portalPosition = this.el.object3D;
    var threshhold = this.el.firstChild;
    var mesh = threshhold.getObject3D('mesh');
    var object3D = threshhold.object3D;
    object3D.updateMatrixWorld();
    var localNormal = mesh.geometry.attributes.normal;
    console.log('vector', localNormal, '3D', object3D);
    // var normalVector = new THREE.Vector3(localNormal[0],localNormal[1],localNormal[2]);
    var normalVector = object3D.localToWorld(localNormal);
    console.log('yo', normalVector);

    //get normal unit vector from doorway (in global zone)
    //get vector from scene origin to doorway
    //get vector from scene origin to player
    //subtract two above vectors to get vector from doorway to player
    //project resulting vector onto normal unit vector
      //if positive, player is in front
      //if negative, player is behind--hide room
  },

  tick: function () {
    var cameraPosition = this.camera.components.position.data;
    // if(cameraPosition.x > )
  }
});

*/
