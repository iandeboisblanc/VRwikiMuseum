import React from 'react';
import {render} from 'react-dom';
import AFRAME from 'aframe';
const $ = require('jquery');

class TextDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.depth = props.depth || '0.05';
    this.width = props.width || '1';
    this.height = props.height || '1';

    var scale = props.htmlScale || 1;
    this.pageWidth = this.width * 100 / scale;
    this.pageHeight = this.height * 100 / scale;
    //scale compnent relative to text?

    this.borderThickness = props.borderThickness || 0;

    if(props.htmlSelector) {
      this.htmlSelector = props.htmlSelector;
    } else {
      console.error('No htmlSelector provided to TextDisplay');
      //Figure out how to select children:

      // var child = React.Children.only(props.children);
      // var randomClass = 'HTML' + (Math.random() * 10000000000);
      // child.addClass(randomClass);
      // attach selector
      // this.htmlSelector = '.' + randomClass;
    }
  }

  render () {
    return (
      <a-entity class='textDisplay' 
        static-body
        position={this.props.position || '0 0 0'} 
        rotation={this.props.rotation || '0 0 0'}>
        <a-box
          width={(2 * this.borderThickness) + Number(this.width)}
          height={(2 * this.borderThickness) + Number(this.height)}
          depth={this.depth}
          color={this.props.borderColor}>
          <a-plane
            draw={`width: ${this.pageWidth}; height: ${this.pageHeight};`}
            position={`0 0 ${this.depth/2 + 0.0001}`}
            htmltexture={`asset: ${this.htmlSelector}`}
            width={this.width}
            height={this.height}
          />
        </a-box>
        
      </a-entity>
    );
  }
}

module.exports = TextDisplay;




  