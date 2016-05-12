import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';

class PageModel extends React.Component {
  constructor(props) {
    super(props);
    var loader = new THREE.ColladaLoader();
    loader.load('/assets/stegoceras.dae', function (result) {
      // scene.add(result.scene);
      console.log(result);
    });
  }

  render () {
    return (
      <a-entity class='portal'
        position={this.props.position}
      >
      </a-entity>
    );
  }
}

module.exports = PageModel;


