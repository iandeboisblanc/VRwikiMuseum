import React from 'react';
import Walls from './Walls';
import Roof from './Roof';
import TextDisplay from './TextDisplay';
import Sculpture from './Sculpture';
import Column from './Column';
const $ = require('jquery');
const extras = require('aframe-extras');
extras.registerAll();

class MuseumScene extends React.Component {
  constructor(props) {
    super(props);
    this.roomWidth = 25;
    this.roomLength = Math.max(20, props.displayHtml.length * 1.7);
    this.roomHeight = 8;
    this.domeRadiusRatio = 0.25;
    this.storedModels = new Set(['stegoceras', 'stegosaurus']);
  }

  componentDidMount() {
    var playerEl = document.querySelector('#camera');
    playerEl.addEventListener('collide', (e) => {
      console.log('Player has collided with body #' + e.detail.body.id);
      let entity = e.detail.body.el;
      let link = $(entity).attr('link');
      let action = $(entity).attr('action');
      if(link) {
        console.log('Redirecting to:', link)
        if(link.slice(1,5) === 'wiki') {
          this.props.changePage(link.split('/')[2]);
        } else {
          window.location = link;
        }
      } else if(action === 'exitVr') {
        this.props.exitVr();
      }
    });
  }

  setHtmlAssets () {
    return this.props.displayHtml.map((element, index) => {
      let html = element.html();
      if($(html).is('img')) {
        return (
          <div class='imgAssetContainer'>
            <img id={`pageIMG${index}`} key={'img' + index} 
              crossOrigin='anonymous' src={'https:' + $(html).attr('src')} />
            <div id={`pageIMGTitle${index}`} key={'imgTitle' + index}
              style={{'textAlign':'center'}}
              dangerouslySetInnerHTML={{__html:$(html).attr('title')}} />
          </div>
        );
      } else {
        return (
          <div id={`pageHTML${index}`} key={'text' + index} 
            dangerouslySetInnerHTML={{__html:html}} />
        );
      }
    })
  }

  renderHtmlTextDisplays () {
    let assets = this.props.displayHtml //.slice(1);
    let length = assets.length;
    let adjustedRoomLength = this.roomLength - 4;
    let halfIndex = Math.floor(assets.length / 2);
    let leftLength = assets.slice(0, halfIndex).length;
    let rightLength = assets.length - leftLength;
    return assets.map((element, index) => {
      let position = `${-this.roomWidth / 2} 2.05 
        ${-adjustedRoomLength / (leftLength - 1) * index + adjustedRoomLength/2}`;
      let rotation = '0 90 0';
      if(index >= halfIndex) {
        position = `${this.roomWidth / 2} 2.05 
          ${adjustedRoomLength / (rightLength - 1) * (index - leftLength) - adjustedRoomLength/2}`;
        rotation = '0 -90 0';
      }
      if(element.children('img').length > 0) {
        let frameDepth = 0.05;
        let imageWidth = element.children('img').attr('width') / 90;
        let imageHeight = element.children('img').attr('height') / 90;
        return (
          <a-entity 
            key={'P' + index}
            rotation={rotation}
            position={position}>
            <a-box 
              position='0 0 0'
              height={imageHeight + 0.05}
              width={imageWidth + 0.05}
              depth={frameDepth}
              color='green'/>
            <a-plane 
              height={imageHeight} width={imageWidth}
              position={`0 0 ${frameDepth/2 + 0.001}`}
              src={'#pageIMG' + index}
              color='white'/>
            <TextDisplay 
              position={`${(imageWidth - 0.5)/2} ${-imageHeight/2 - 0.25} 0`} 
              height='0.27' width='0.5' depth={0.03}
              borderThickness='0.01' 
              borderColor='white'
              htmlSelector={'#pageIMGTitle' + (index)}
              htmlScale='0.3'/>
          </a-entity>
        )
      } else {
        return (
          <TextDisplay 
            key={'T' + index}
            position={position} 
            rotation={rotation}
            height='4' width='3' depth='0.5'
            borderThickness='0.05' 
            borderColor='red'
            htmlSelector={'#pageHTML' + (index)}
            htmlScale='0.7'/>
        )
      }
    });
  }

  renderColumns (widthRatio) {
    let columnCount = Math.floor(this.roomLength / 7);
    let columns = [];
    let xPos = this.roomWidth * widthRatio + 0.52;
    let height = 8;
    for(let i = 0; i < columnCount; i++) {
      let zPos = -this.roomLength/2 + (i + 1) * this.roomLength / (columnCount + 1);
      columns.push((
        <Column height={8} radius={0.3} position={`${xPos} ${height/2} ${zPos}`} />
      ));
      columns.push((
        <a-cylinder static-body material='transparent:true; opacity:0' 
          height='4' radius='0.299' position={`${xPos} 2 ${zPos}`}
          />
      ));
      columns.push((
        <Column height={8} radius={0.3} position={`${-xPos} ${height/2} ${zPos}`} />
      ));
      columns.push((
        <a-cylinder static-body material='transparent:true; opacity:0' 
          height='4' radius='0.299' position={`${-xPos} 2 ${zPos}`}
          />
      ));
    }
    return columns
  }

  renderPointLights () {
    let lightCount = Math.floor(this.roomLength / 15);
    let lights = [];
    let yPos = this.roomHeight + this.roomWidth * this.domeRadiusRatio;
    for(let i = 0; i < lightCount; i++) {
      let zPos = -this.roomLength/2 + (i + 1) * this.roomLength / (lightCount + 1);
      lights.push((
        <a-light intensity='0.5' type='point' distance='20'
          position={`0 ${yPos} ${zPos}`} />
      ));
    }
    return lights
  }

  render () {
    let page = this.props.page.toLowerCase();
    let model = this.storedModels.has(page) ? page : '__default';
    return (
      <a-scene physics='debug:false'>
        <a-assets timeout='5000'>
          <div id='ajaxHtmlAssets'>
            {this.setHtmlAssets.call(this)}
          </div>
          <a-asset-item id='pageModel' src={`/assets/pageModels/${model}/model.dae`} />
          <img id='marbleTile' src='/assets/textures/marbleTile.jpg'/>
          <img id='marbleSurface' src='/assets/textures/marbleSurface.jpg'/>
          <img id='stucco' src='/assets/textures/stucco.jpg'/>
          <img id='columnSkin' src='/assets/textures/columnSkin.jpg'/>
        </a-assets>

        <a-sky color='skyblue' />
        <a-plane static-body 
          material={`src:#marbleTile; repeat:${this.roomWidth} ${this.roomLength}; metalness:0.1;`}
          position='0 0 0' rotation='-90 0 0' 
          width={this.roomWidth * 1.1} height={this.roomLength + 0.6} />
        
        <Walls width={this.roomWidth} length={this.roomLength} height={this.roomHeight} 
          links={this.props.relatedLinks}/>

        <Roof width={this.roomWidth} length={this.roomLength} height={this.roomHeight} 
          domeRadiusRatio={this.domeRadiusRatio} 
          material={`src:#stucco; repeat:${this.roomWidth/8} ${this.roomLength/8}`}/>
        
        {this.renderColumns.call(this, 0.25)}

        {this.renderPointLights.call(this)}
        <a-light type='ambient' color='#DEE0E0'/>

        {this.renderHtmlTextDisplays.call(this)}

        <a-collada-model src='#pageModel' />

        <a-entity id='camera' position={`0 1.8 ${this.roomLength * 0.4}`} width='0.5'
          camera='near: 0.05' universal-controls kinematic-body='radius: 0.6' />
      </a-scene>
    );
  }
};

module.exports = MuseumScene;
