import React from 'react'

class Walls extends React.Component {

  constructor(props) {
    super(props);
    this.wallHeight = 8;
    this.doorWidth = 2;
    this.doorHeight = 3;
  }

  renderDoorWays (links, northOrSouth) {
    let maxLinkCount = Math.floor((this.props.width - 0.5) / (0.5 + this.doorWidth)); 
    //0.5 is min space between doors
    links = links.slice(0, maxLinkCount);
    let zPos = northOrSouth === 'north' ? this.props.length/2 + 0.15 : -this.props.length/2 - 0.15;
    let boxCount = links.length + 1;
    let boxWidth = (this.props.width - (links.length * this.doorWidth)) / boxCount;
    //Make link colliders:
    let linkPads = links.map((link, i) => {
      let linkPadPosition = `${-this.props.width/2 + boxWidth * (i + 1) + this.doorWidth * (i + 1/2)} 
        0 ${zPos}`;
      return (
        <a-box key={'linkPad' + i} 
          link={link}
          static-body
          position={linkPadPosition} 
          height='0.1'
          width={this.doorWidth}
          depth='0.3'
          material='transparent:true; opacity:0;'
          />
      )
    });
    let lowerWalls = [];
    for(let i = 0; i < boxCount; i++) {
      let lowerWallPosition = `${-this.props.width/2 + boxWidth/2 + i * (boxWidth + this.doorWidth)} 
        1.5 ${zPos}`;
      lowerWalls.push((
        <a-box key={'lowerWall' + i} 
          static-body
          position={lowerWallPosition} 
          height={this.doorHeight}
          width={boxWidth}
          depth='0.3'
          material={`src:#stucco; repeat:${boxWidth} ${this.doorHeight};`}
          />
      ))
    }
    let lowerWallsTrim = [];
    for(let i = 0; i < boxCount; i++) {
      lowerWallsTrim.push((
        <a-box id='southWallTrim' key={'lowerWallTrim' + i}
          position={`${-this.props.width/2 + boxWidth/2 + i * (boxWidth + this.doorWidth)} 0.1 ${-this.props.length/2}`}
          depth={0.1} width={boxWidth - 0.001} height={0.2} 
          material='src:#stucco; repeat:25 8;'
          />
      ))
    }
    return linkPads.concat(lowerWalls, lowerWallsTrim);
  }

  render () {
    return (
      <a-entity position='0 0 0'>
        <a-box id='northWall' 
          static-body position={`0 ${this.wallHeight/2} ${this.props.length/2 + 0.15}`}
          depth={0.3} width={this.props.width} height={this.wallHeight} 
          material={`src:#stucco; repeat:${this.props.width} ${this.wallHeight};`}
          />
        <a-box id='northWallTrim' 
          position={`0 0.1 ${this.props.length/2}`}
          depth={0.1} width={this.props.width} height={0.2} 
          material='src:#stucco; repeat:25 8;'
          />
        <a-box id='eastWall' 
          static-body position={`${this.props.width/2 + 0.15} ${this.wallHeight/2} 0`}
          depth={this.props.length + 0.6} width={0.3} height={this.wallHeight} 
          material={`src:#stucco2; repeat:${this.props.length/2} ${this.wallHeight/2};`}
          />
        <a-box id='eastWallTrim' 
          position={`${this.props.width/2} 0.1 0`}
          depth={this.props.length} width={0.1} height={0.2} 
          material='src:#stucco; repeat:25 8;'
          />
        <a-box id='westWall' 
          static-body position={`${-this.props.width/2 - 0.15} ${this.wallHeight/2} 0`}
          depth={this.props.length + 0.6} width={0.3} height={this.wallHeight} 
          material={`src:#marbleSurface; repeat:${this.props.length/4} ${this.wallHeight/4};`}
          />
        <a-box id='westWallTrim' 
          position={`${-this.props.width/2} 0.1 0`}
          depth={this.props.length} width={0.1} height={0.2} 
          material='src:#stucco; repeat:25 8;'
          />

        <a-box id='southWallUpper' 
          static-body position={`0 ${(this.wallHeight + this.doorHeight)/2} ${-this.props.length/2 - 0.15}`}
          depth={0.3} width={this.props.width} height={this.wallHeight - this.doorHeight}
          material={`src:#stucco; repeat:${this.props.width} ${this.wallHeight - this.doorHeight};`}
          />
        {this.renderDoorWays.call(this, this.props.links, 'south')}

      </a-entity>
    ) 
  }
}

module.exports = Walls;
