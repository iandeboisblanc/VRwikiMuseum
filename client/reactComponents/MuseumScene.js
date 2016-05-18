import React from 'react';
// import Player from './Player'
import Portal from './Portal'
import Walls from './Walls'
import TextDisplay from './TextDisplay'
import Sculpture from './Sculpture'
const $ = require('jquery');
const extras = require('aframe-extras');
extras.registerAll();

class MuseumScene extends React.Component {
  constructor(props) {
    super(props);
    this.roomWidth = 25;
    this.roomLength = 20;
  }

  componentDidMount() {
    var playerEl = document.querySelector('#camera');
    playerEl.addEventListener('collide', function (e) {
      console.log('Player has collided with body #' + e.detail.body.id);

      e.detail.target.el;  // Original entity (playerEl).
      e.detail.body.el;    // Other entity, which playerEl touched.
      e.detail.contact;    // Stats about the collision (CANNON.ContactEquation).
      e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
    });
  }

  setHtmlAssets () {
    return this.props.textDisplayHtml.map((element, index) => {
      let html = element.html();
      return (
        <div id={`pageHTML${index}`} key={'text' + index} dangerouslySetInnerHTML={{__html:html}} />
      )
    }).concat(this.props.images.map((index, element) => {
      // console.log(element);
      let src = 'https:' + $(element).children('img').attr('src');
      return (
        <img id={`pageIMG${index}`} key={'img' + index} crossOrigin='anonymous' src={src} />
      );
    }));
  }

  renderHtmlTextDisplays () {
    let assets = this.props.textDisplayHtml //.slice(1);
    let length = assets.length;
    let leftHalf = assets.slice(0, Math.floor(length / 2));
    let rightHalf = assets.slice(Math.floor(length / 2));
    return leftHalf.map((element, index) => {
      var adjustedRoomLength = this.roomLength - 4;
      return (
        <TextDisplay 
          key={'L' + index}
          position={`${-this.roomWidth / 2} 2.05 ${-adjustedRoomLength / (leftHalf.length - 1) * index + adjustedRoomLength / 2}`} 
          rotation='0 90 0'
          height='4' width='3' depth='0.5'
          borderThickness='0.05' 
          borderColor='red'
          htmlSelector={'#pageHTML' + (index)}
          htmlScale='0.7'
        />
      )
    }).concat(rightHalf.map((element, index) => {
      var adjustedRoomLength = this.roomLength - 4;
      return (
        <TextDisplay 
          key={'R' + index}
          position={`${this.roomWidth / 2} 2.05 ${adjustedRoomLength / (rightHalf.length - 1) * index - adjustedRoomLength / 2}`} 
          rotation='0 -90 0'
          height='4' width='3' depth='0.5'
          borderThickness='0.05' 
          borderColor='red'
          htmlSelector={'#pageHTML' + (leftHalf.length + index)}
          htmlScale='0.7'
        />
      )
    }));
  }

  renderImageDisplays() {
    let images = this.props.images //.slice(1);
    let length = images.length;
    return images.map((index, element) => {
      let adjustedRoomWidth = this.roomWidth - 4;
      let frameDepth = 0.05;
      let imageWidth = element.children('img').attr('width') / 130;
      let imageHeight = element.children('img').attr('height') / 130;
      console.log(imageWidth, imageHeight);
      return (
        <a-entity 
        rotation='0 180 0'
        position={`${-adjustedRoomWidth / (length - 1) * index + adjustedRoomWidth / 2} 1.6 ${this.roomLength / 2}`}>
          <a-box 
            position='0 0 0'
            height={imageHeight + 0.05}
            width={imageWidth + 0.05}
            depth={frameDepth}
            color='green'
          />
          <a-plane 
            key={'P' + index}
            // rotation='0 180 0'
            height={imageHeight} width={imageWidth}
            position={`0 0 ${frameDepth/2 + 0.001}`}
            // borderThickness='0.05' 
            // borderColor='brown'
            src={'#pageIMG' + index}
            color='white'
            // htmlScale='0.7'
          />
        </a-entity>
      )
    })
  }

  render () {
    return (
      <a-scene physics='debug:true'>
        <a-assets>
          <div id='ajaxHtmlAssets'>
            {this.setHtmlAssets.call(this)}
          </div>
          <a-asset-item id="modelDae" src="/assets/stegoceras.dae"></a-asset-item>
        </a-assets>

        <a-sky color='blue' />
        <a-plane static-body material='color:grey;side:double' 
          position='0 0 0' rotation='-90 0 0' width='100' height='100' />
        <Portal 
          position={`0 0 ${-this.roomLength / 2 + 0.01}`} width='1.5' height='2.5' 
          // redirect='http://www.elliotplant.com' 
        />
       
        {this.renderHtmlTextDisplays.call(this)}
        {this.renderImageDisplays.call(this)}

        <Sculpture
          position='0 0 0' 
          modelSrc='#modelDae'
        />

        <Walls width={this.roomWidth} length={this.roomLength}/>

        <a-entity id='camera' position={`0 1.8 ${this.roomLength * 0.4}`} 
          camera universal-controls kinematic-body />
      </a-scene>
    );
  }
};

module.exports = MuseumScene;
