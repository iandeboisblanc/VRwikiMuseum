require('aframe');
import React from 'react'
import {render} from 'react-dom'

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.position = this.props.position.split(' ').map((value, i) => {
      return i == 1 ? value + props.height/2 : value;
    }).join(' ');
  }

  render () {
    return (
      <a-entity class='portal' 
        position={this.position} 
        rotation='0 30 0'
        //hideRoom={'camera:' + this.props.player}
        >
        <a-plane class='portalThreshhold' 
          // material='transparent:true;'
          color='yellow' 
          height={this.props.height} 
          width={this.props.width} 
          enterDoor='camera: #player'
        />
        <a-box class='portalFrame'
          position={-this.props.width/2 + ' 0 0'}
          color='brown'
          height={this.props.height}
          width='0.1'
          depth='0.03' 
        />
        <a-box class='portalFrame'
          position={this.props.width/2 + ' 0 0'}
          color='brown'
          height={this.props.height}
          width='0.1'
          depth='0.03' 
        />
        <a-box class='portalFrame'
          position={'0 ' + this.props.height/2 + ' 0'}
          color='brown'
          height='0.1'
          width={0.2 + Number(this.props.width)}
          depth='0.03' 
        />

        {/*
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
        */}
      </a-entity>
    );
  }
}

module.exports = Portal;


AFRAME.registerComponent('enterDoor', {
  schema: {
    camera: {default: ''}
  },

  init: function () {
    // console.log(this.data.camera);
    this.el.sceneEl.object3D.updateMatrixWorld();
    //get camera:
    this.camera = this.el.sceneEl.querySelector(this.data.camera);
    //get threshhold
    var el = this.el;
    console.log(this.el.object3D.position);
    console.log(this.el.object3D.matrixWorld);
    //get dimensions/edges of threshhold
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( this.el.object3D.matrixWorld )
    console.log(vector);
  },

  tick: function () {
    var cameraPosition = this.camera.components.position.data;
    // if(cameraPosition.x > )
    //if camera intersects with threshhold, trigger event (link)
  }
})


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
