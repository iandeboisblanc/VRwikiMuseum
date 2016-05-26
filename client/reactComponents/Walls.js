import React from 'react';
import Wall from './Wall';
require('aframe-text-component');

function centerText() {
  const doorTexts = document.getElementsByClassName('door-text');
  let halfTextWidth, textPosition;
  for (var i = 0; i < doorTexts.length; i++) {
    halfTextWidth = doorTexts[i].object3D.children[0].geometry.boundingSphere.radius;
    textPosition = doorTexts[i].getAttribute('position');
    textPosition.x -= halfTextWidth;
    doorTexts[i].setAttribute('position', textPosition);
  }
  return 'centered';
}

class Walls extends React.Component {

  constructor(props) {
    super(props);
    this.wallHeight = 8;
    this.doorWidth = 2;
    this.doorHeight = 3;
    this.wallThickness = 0.3;
  }

  componentDidMount() {
    setTimeout(() => centerText(), 4000);
  }
  renderDoorWays () {
    let maxLinkCount = Math.floor((this.props.width - 0.5) / (0.5 + this.doorWidth));
    //0.5 is min space between doors
    let links = this.props.links.slice(0, maxLinkCount);
    let boxCount = links.length + 1;
    let boxWidth = (this.props.width - (links.length * this.doorWidth)) / boxCount;
    //Make link colliders:
    let linkPads = links.map((link, i) => {
      const xPos = -this.props.width/2 + boxWidth * (i + 1) + this.doorWidth * (i + 1/2);
      const yPos = 0;
      const zPos = -this.props.length/2 - this.wallThickness/2;
      return (
        <a-entity key={i}>
          <a-entity // door title
            class='door-text'
            text={`text: ${link.title}; size:0.2; height:0.02`}
            material='color: black'
            position={`${xPos} ${yPos + this.doorHeight + 0.2} ${zPos + this.wallThickness}`} />
          <a-box // linkPad
            link={link.url}
            static-body
            position={`${xPos} ${yPos} ${zPos}`}
            height='0.1'
            width={this.doorWidth}
            depth={this.wallThickness}
            material='transparent:true; opacity:0;'/>
        </a-entity>
      )
    });
    let lowerWalls = [];
    for(let i = 0; i < boxCount; i++) {
      lowerWalls.push((
        <Wall key={'lowerWall' + i}
          position={`${(boxWidth - this.props.width)/2 + i * (boxWidth + this.doorWidth)} 
            1.5 ${-(this.props.length + this.wallThickness)/2}`}
          height={this.doorHeight}
          width={boxWidth}
          wallThickness={this.wallThickness}
          material={`src:#stucco; repeat:${boxWidth} ${this.doorHeight};`}/>
      ))
    }
    return linkPads.concat(lowerWalls);
  }

  render () {
    return (
      <a-entity position='0 0 0'>

        <Wall id='northWallEast' 
          position={`${((this.props.width - this.doorWidth)/2 + this.doorWidth)/2} ${(this.doorHeight)/2} 
            ${(this.props.length + this.wallThickness)/2}`}
          rotation='0 180 0'
          material={`src:#stucco; 
            repeat:${(this.props.width - this.doorWidth)/2} ${this.doorHeight};`}
          width={(this.props.width - this.doorWidth)/2}
          depth={this.wallThickness}
          height={this.doorHeight}/>

        <Wall id='northWallWest' 
          position={`${-((this.props.width - this.doorWidth)/2 + this.doorWidth)/2} ${(this.doorHeight)/2} 
            ${(this.props.length + this.wallThickness)/2}`}
          rotation='0 180 0'
          material={`src:#stucco; 
            repeat:${(this.props.width - this.doorWidth)/2} ${this.doorHeight};`}
          width={(this.props.width - this.doorWidth)/2}
          depth={this.wallThickness}
          height={this.doorHeight}/>

        <Wall id='northWallUpper' 
          position={`0 ${(this.wallHeight + this.doorHeight)/2} 
            ${this.props.length/2 + this.wallThickness/2}`}
          rotation='0 180 0'
          material={`src:#stucco; repeat:${this.props.width} ${this.wallHeight};`}
          width={this.props.width}
          depth={this.wallThickness}
          height={this.wallHeight - this.doorHeight}
          trimThickness={0}/>

        <a-entity id='northWallText' 
          position={`0 ${this.doorHeight + 0.2} ${(this.props.length - this.wallThickness)/2}`}
          rotation='0 180 0'>
          <a-entity // door title
            position='0 0 0'
            class='door-text'
            text='text: Exit VR; size:0.2; height:0.02'
            material='color: black' />
        </a-entity>

        <a-box // linkPad
          static-body
          action={'exitVr'}
          position={`0 0.05 ${(this.props.length + this.wallThickness)/2}`}
          height='0.1'
          width={this.doorWidth}
          depth={this.wallThickness}
          material='transparent:true; opacity:0;'/>

        <Wall id='westWall'
          position={`${(this.props.width + this.wallThickness)/2} ${this.wallHeight/2} 0`}
          rotation='0 -90 0'
          width={this.props.length + this.wallThickness * 2}
          height={this.wallHeight}
          wallThickness={this.wallThickness}
          material={`src:#stucco2; repeat:${this.props.length/2} ${this.wallHeight/2};`}/>

        <Wall id='eastWall'
          position={`${-(this.props.width + this.wallThickness)/2} ${this.wallHeight/2} 0`}
          rotation='0 90 0'
          width={this.props.length + this.wallThickness * 2}
          height={this.wallHeight}
          wallThickness={this.wallThickness}
          material={`src:#marbleSurface; repeat:${this.props.length/4} ${this.wallHeight/4};`}
          trimMaterial='src:#stucco; repeat:25 8;'/>

        <Wall id='southWallUpper'
          position={`0 ${(this.wallHeight + this.doorHeight)/2} 
            ${-(this.props.length + this.wallThickness)/2}`}
          wallThickness={this.wallThickness} 
          width={this.props.width} height={this.wallHeight - this.doorHeight}
          material={`src:#stucco; repeat:${this.props.width} ${this.wallHeight - this.doorHeight};`} 
          trimThickness={0} />

        {this.renderDoorWays.call(this)}

      </a-entity>
    )
  }
}

module.exports = Walls;
