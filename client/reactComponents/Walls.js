import React from 'react'

class Walls extends React.Component {

  constructor(props) {
    super(props);
    this.wallHeight = 8;
    this.doorWidth = 2;
    this.doorHeight = 3;
  }

  renderDoorWays () {
    let links = this.props.links.slice(0,6); //max out at 6 links
    let boxCount = links.length + 1;
    let boxWidth = (this.props.width - (links.length * this.doorWidth)) / boxCount;
    //Make link colliders:
    let linkPads = links.map((link, i) => {
      return (
        //something
        <a-box key={'linkPad' + i} 
          link={link}
          static-body
          position={`${-this.props.width/2 + boxWidth * (i + 1) + this.doorWidth * (i + 1/2)} 0 ${-this.props.length/2 - 0.15}`} 
          height='0.1'
          width={this.doorWidth}
          depth='0.3'
          color='grey'
          />
      )
    });
    let lowerWalls = [];
    for(let i = 0; i < boxCount; i++) {
      lowerWalls.push((
        <a-box key={'lowerWall' + i} 
          static-body
          position={`${-this.props.width/2 + boxWidth/2 + i * (boxWidth + this.doorWidth)} 1.5 ${-this.props.length/2 - 0.15}`} 
          height={this.doorHeight}
          width={boxWidth}
          depth='0.3'
          color='grey'
          />
      ))
    }
    return linkPads.concat(lowerWalls);
  }

  render () {
    return (
      <a-entity position='0 0 0'>
        <a-box id='northWall' 
          static-body position={`0 ${this.wallHeight/2} ${this.props.length/2 + 0.15}`}
          depth={0.3} width={this.props.width} height={this.wallHeight} color='grey'/>
        <a-box id='eastWall' 
          static-body position={`${this.props.width/2 + 0.15} ${this.wallHeight/2} 0`}
          depth={this.props.length + 0.6} width={0.3} height={this.wallHeight} color='grey'/>
        <a-box id='westWall' 
          static-body position={`${-this.props.width/2 - 0.15} ${this.wallHeight/2} 0`}
          depth={this.props.length + 0.6} width={0.3} height={this.wallHeight} color='grey'/>

        <a-box id='southWallUpper' 
          static-body position={`0 ${(this.wallHeight + this.doorHeight)/2} ${-this.props.length/2 - 0.15}`}
          depth={0.3} width={this.props.width} height={this.wallHeight - this.doorHeight} color='grey'/>
        {this.renderDoorWays.call(this)}

      </a-entity>
    ) 
  }
}

module.exports = Walls;
