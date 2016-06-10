import React from 'react';

class Roof extends React.Component {

  constructor(props) {
    super(props);
    // this.position = props.position || '0 0 0';
    this.rotation = props.rotation || '0 0 0';
    this.height = props.height || 8;
    this.length = props.length || 10;
    this.width = props.width || 5;
    this.domeRadiusRatio = props.domeRadiusRatio || 0.25;
    this.material = props.material || 'color:grey;';
    this.domeMaterial = props.domeMaterial || this.material;
  }

  render () {
    let roofPanelWidth = this.width * (1 - 2 * this.domeRadiusRatio)/2;
    return (
      <a-entity className='roof' 
        position={`0 ${this.height} 0`}
        rotation={this.rotation}>
        <a-box className='leftRoof'
          position={`${-(this.domeRadiusRatio * this.width + roofPanelWidth/2)} 0.1 0`}
          height={0.2}
          width={roofPanelWidth}
          depth={this.length}
          material={this.material} />
        <a-box className='rightRoof'
          position={`${(this.domeRadiusRatio * this.width + roofPanelWidth/2)} 0.1 0`}
          height={0.2}
          width={roofPanelWidth}
          depth={this.length}
          material={this.material} />
        <a-cylinder className='roofDome'
          position={`0 0 0`}
          rotation={`90 0 0`}
          height={this.length}
          radius={this.domeRadiusRatio * this.width}
          theta-length='180'
          theta-start='90'
          material={'side:back;' + this.material}
        />
      </a-entity>
    )
  }
}

module.exports = Roof;
