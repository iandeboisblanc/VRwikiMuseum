import React from 'react';

class Wall extends React.Component {

  constructor(props) {
    super(props);
    this.position = props.position || '0 0 0';
    this.rotation = props.rotation || '0 0 0';
    this.height = Number(props.height) || 4;
    this.width = Number(props.width) || 5;
    this.wallThickness = Number(props.wallThickness) || 0.3;
    this.trimHeight = props.trimHeight  === undefined ? 0.2 : Number(props.trimHeight);
    this.trimThickness = props.trimThickness  === undefined ? 0.05 : Number(props.trimThickness);
    this.material = props.material || 'color:grey;';
    this.trimMaterial = props.trimMaterial || this.material;
  }

  render () {
    if(this.trimThickness && this.trimHeight) {
      return (
        <a-entity className='wallEntity' 
          position='0 0 0'
          rotation='0 0 0'>
          <a-box className='wall'
            static-body 
            position={this.position}
            rotation={this.rotation}
            depth={this.wallThickness} width={this.width} height={this.height}
            material={this.material}>
            <a-box className='wallTrim'
              position={`0 ${(this.trimHeight - this.height)/2} 
                ${(this.wallThickness + this.trimThickness)/2}`}
              rotation='0 0 0'
              depth={this.trimThickness} width={this.width} height={this.trimHeight}
              material={this.trimMaterial}/>
          </a-box>
        </a-entity>
      )
    } else {
      // to avoid rendering trim if none is wanted
      return (
        <a-entity className='wallEntity' 
          position='0 0 0'
          rotation='0 0 0'>
          <a-box className='wall'
            static-body 
            position={this.position}
            rotation={this.rotation}
            depth={this.wallThickness} width={this.width} height={this.height}
            material={this.material} />
        </a-entity>
      )
    }
  }
}

module.exports = Wall;
