import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';

class TextDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.textWidth = props.textWidth || '300';
    this.textHeight = props.textHeight || '300';
    this.depth = props.depth || '0.05';
    //scale compnent relative to text?
  }

  render () {
    return (
      <a-entity class='textDisplay' 
        position={this.props.position || '0 0 0'} 
        rotation={this.props.rotation || '0 0 0'}
        >
        <a-box
          width={this.props.width || '5.1'}
          height={this.props.height || '5.1'}
          depth={this.depth}
        >
          <a-plane
            draw={`width: ${this.textWidth}; height: ${this.textHeight};`}
            position={`0 0 ${this.depth/2 + 0.0001}`}
            htmltexture='asset: #exampleText'
            width='5'
            height='5'
          />
        </a-box>
        
      </a-entity>
    );
  }
}

module.exports = TextDisplay;




  