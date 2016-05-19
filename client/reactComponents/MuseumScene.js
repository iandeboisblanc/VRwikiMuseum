import React from 'react';
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
    playerEl.addEventListener('collide', (e) => {
      console.log('Player has collided with body #' + e.detail.body.id);
      let entity = e.detail.body.el;
      let link = $(entity).attr('link');
      if(link) {
        console.log('Redirecting to:', link)
        if(link.slice(0,4) === 'wiki') {
          //set state to another page
        } else {
          //redirect entirely
          window.location = link;
        }
      }
      // console.log(e.detail.target.el);  // Original entity (playerEl).
      console.log();    // Other entity, which playerEl touched.
      // console.log(e.detail.contact);    // Stats about the collision (CANNON.ContactEquation).
      // console.log(e.detail.contact.ni); // Normal (direction) of the collision (CANNON.Vec3).
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
      // console.log(imageWidth, imageHeight);
      return (
        <a-entity 
          key={'P' + index}
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
          <a-asset-item id="modelDae" src="/assets/pageModels/stegoceras/stegoceras.dae" />
          <img id='marbleTile' src='/assets/textures/marbleTile.jpg'/>
          <img id='marbleTile2' src='/assets/textures/marbleTile2.jpg'/>
          <img id='marbleTile3' src='/assets/textures/marbleTile3.jpg'/>
          <img id='marbleSurface' src='/assets/textures/marbleSurface.jpg'/>
          <img id='stucco' src='/assets/textures/stucco.jpg'/>
          <img id='stucco2' src='/assets/textures/stucco2.jpg'/>
        </a-assets>

        <a-sky color='blue' />
        <a-plane static-body material='src:#marbleTile; repeat:25 25; metalness:0.1;' 
          position='0 0 0' rotation='-90 0 0' width='50' height='50' />
       
        {this.renderHtmlTextDisplays.call(this)}
        {this.renderImageDisplays.call(this)}

        <Sculpture
          position='0 0 0' 
          modelSrc='#modelDae'
        />

        <Walls width={this.roomWidth} length={this.roomLength} links={this.props.relatedLinks}/>

        <a-entity id='camera' position={`0 1.8 ${this.roomLength * 0.4}`} width='0.5'
          camera='near: 0.3' universal-controls kinematic-body='radius: 0.6' />
      </a-scene>
    );
  }
};

module.exports = MuseumScene;
