import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';

class Sculpture extends React.Component {
  constructor(props) {
    super(props);
    this.pedastalHeight = 0.6;
    this.pedestalWidth = 2.5;
    this.pedestalDepth = 1;
    
    //would be great to set dynamically based on size of model...
  }

  render () {
    return (
      <a-entity class='modelEntity'
        position={this.props.position}>
        <a-box class='pedestal'
          position='0 0 0'
          height={this.pedastalHeight} width={this.pedestalWidth} depth={this.pedestalDepth}
          color='brown'
          learningTool
        />
        <a-collada-model src={this.props.modelSrc}
          position={`-0.2 ${this.pedastalHeight / 2} 0.1`}
        />
      </a-entity>
    );
  }
}

module.exports = Sculpture;



