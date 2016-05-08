import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';

class TextDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.textWidth = props.textWidth || '300';
    this.textHeight = props.textHeight || '300';
  }

  render () {
    return (
      <a-entity class='textDisplay' 
        position={this.props.position ? this.props.position : '0 0 0'} 
        rotation={this.props.rotation ? this.props.rotation : '0 0 0'}
        >
        <a-plane
          draw={`width: ${this.textWidth}; height: ${this.textHeight};`}
          // draw={'width: ' + this.textWidth + '; height: ' + this.textHeight + ';'}
          htmltexture='asset: #exampleText'
          width='5'
          height='5'
        />
        
      </a-entity>
    );
  }
}

module.exports = TextDisplay;




  