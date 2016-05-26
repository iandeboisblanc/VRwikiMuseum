import React from 'react';
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

class Wall extends React.Component {

  constructor(props) {
    super(props);
    this.position = props.position.toString() || '0 0 0';
    this.rotation = props.rotation.toString() || '0 0 0';
    this.height = Number(props.height) || 4;
    this.width = Number(props.width) || 5;
    this.doorWidth = Number(props.doorWidth) || 2;
    this.doorHeight = Number(props.doorHeight) || 3;
    this.wallThickness = Number(props.wallThickness) || 0.3;
    this.trimHeight = Number(props.trimHeight) || 0.2;
    this.trimThickness = Number(props.trimThickness) || 0.05;
    this.material = props.material || 'color:grey;';
    this.trimMaterial = props.trimMaterial || this.material;
  }

  // componentDidMount() {
  //   setTimeout(() => centerText(), 4000);
  // }
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
            class="door-text"
            text={`text: ${link.title}`}
            material="color: black"
            position={`${xPos} ${yPos + this.doorHeight + 0.2} ${zPos + this.wallThickness}`}
          />
          <a-box // linkPad
            link={link.url}
            static-body
            position={`${xPos} ${yPos} ${zPos}`}
            height='0.1'
            width={this.doorWidth}
            depth={this.wallThickness}
            material='transparent:true; opacity:0;'
          />
        </a-entity>
      )
    });
    let lowerWalls = [];
    for(let i = 0; i < boxCount; i++) {
      lowerWalls.push((
        <a-box key={'lowerWall' + i}
          static-body
          position={`${-this.props.width/2 + boxWidth/2 + i * (boxWidth + this.doorWidth)} 
            1.5 ${-this.props.length/2 - this.wallThickness/2}`}
          height={this.doorHeight}
          width={boxWidth}
          depth={this.wallThickness}
          material={`src:#stucco; repeat:${boxWidth} ${this.doorHeight};`}
          />
      ))
    }
    let lowerWallsTrim = [];
    for(let i = 0; i < boxCount; i++) {
      lowerWallsTrim.push((
        <a-box id='southWallTrim' key={'lowerWallTrim' + i}
          position={`${-this.props.width/2 + boxWidth/2 + i * (boxWidth + this.doorWidth)} 
            0.1 ${-this.props.length/2}`}
          depth={0.1} width={boxWidth - 0.001} height={0.2}
          material='src:#stucco; repeat:25 8;'
          />
      ))
    }
    return linkPads.concat(lowerWalls, lowerWallsTrim);
  }

  render () {
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
            material={this.trimMaterial}
            />
        </a-box>
      </a-entity>
    )
  }
}

module.exports = Wall;
