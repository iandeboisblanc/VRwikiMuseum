import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';

class TextDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.depth = props.depth || '0.05';
    this.width = props.width || '1';
    this.height = props.height || '1';

    this.pageWidth = this.width * 100;
    this.pageHeight = this.height * 100;
    //scale compnent relative to text?

    this.borderThickness = props.borderThickness || 0;
  }

  render () {
    return (
      <a-entity class='textDisplay' 
        position={this.props.position || '0 0 0'} 
        rotation={this.props.rotation || '0 0 0'}
        >
        <a-box
          width={(2 * this.borderThickness) + Number(this.width)}
          height={(2 * this.borderThickness) + Number(this.height)}
          depth={this.depth}
          color={this.props.borderColor}
        >
          <a-plane
            draw={`width: ${this.pageWidth}; height: ${this.pageHeight};`}
            position={`0 0 ${this.depth/2 + 0.0001}`}
            htmltexture='asset: #exampleText'
            width='1'
            height='1'
          />
        </a-box>
        
      </a-entity>
    );
  }
}

module.exports = TextDisplay;




  