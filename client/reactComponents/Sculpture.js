import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';
import TextDisplay from './TextDisplay';

class Sculpture extends React.Component {
  constructor(props) {
    super(props);
    this.pedestalHeight = 0.6;
    this.pedestalWidth = 2.5;
    this.pedestalDepth = 1;
    const positionArray = props.position.split(' ');
    positionArray[1] = Number(positionArray[1]) + this.pedestalHeight / 2;
    this.position = positionArray.join(' ');
    this.rotation = this.props.rotation || '0 0 0';
    //would be great to set dynamically based on size of model...
  }

  render () {
    return (
      <a-entity class='modelEntity'
        static-body
        position={this.position}
        rotation={this.rotation}>
        <a-box class='pedestal'
          position='0 0 0'
          height={this.pedestalHeight} width={this.pedestalWidth} depth={this.pedestalDepth}
          material={`src:#marbleSurface; repeat:${this.pedestalWidth} ${this.pedestalDepth};
           side:double; metalness:0.1`}
          learningTool
        />
        <a-collada-model src={this.props.modelSrc}
          position={`-0.2 ${this.pedestalHeight / 2} 0.1`}
        />
      </a-entity>
    );
  }
}

module.exports = Sculpture;



