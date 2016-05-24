import React from 'react';
import Walls from './Walls'
import TextDisplay from './TextDisplay'
import Sculpture from './Sculpture'
import Column from './Column'
const $ = require('jquery');
const extras = require('aframe-extras');
extras.registerAll();

class MuseumScene extends React.Component {
  constructor(props) {
    super(props);
    this.roomWidth = 25;
    this.roomLength = 35;
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
    return this.props.displayHtml.map((element, index) => {
      let html = element.html();
      if($(html).is('img')) {
        return (
          <img id={`pageIMG${index}`} key={'img' + index} 
            src={'https:' + $(html).attr('src')} crossOrigin='anonymous' />
        );
      } else {
        return (
          <div id={`pageHTML${index}`} key={'text' + index} dangerouslySetInnerHTML={{__html:html}} />
        );
      }
    })
    // .concat(this.props.images.map((index, element) => {
    //   // console.log(element);
    //   let src = 'https:' + $(element).children('img').attr('src');
    //   return (
    //     <img id={`pageIMG${index}`} key={'img' + index} crossOrigin='anonymous' src={src} />
    //   );
    // }));
  }

  renderHtmlTextDisplays () {
    let assets = this.props.displayHtml //.slice(1);
    let length = assets.length;
    let adjustedRoomLength = this.roomLength - 4;
    let halfIndex = Math.floor(assets.length / 2);
    return assets.map((element, index) => {
      let leftLength = assets.slice(0, halfIndex).length;
      let rightLength = assets.length - leftLength;
      let position = `${-this.roomWidth / 2} 2.05 ${-adjustedRoomLength / (leftLength - 1) * index + adjustedRoomLength / 2}`;
      let rotation = '0 90 0';
      if(index >= halfIndex) {
        position = `${this.roomWidth / 2} 2.05 ${adjustedRoomLength / (rightLength - 1) * (index - leftLength) - adjustedRoomLength / 2}`;
        rotation = '0 -90 0';
      }
      if(element.children('img').length > 0) {
        console.log(element);
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
            htmlScale='0.7'
          />
        )
      }
    });
  }

  // renderImageDisplays() {
  //   let images = this.props.images //.slice(1);
  //   let length = images.length;
  //   return images.map((index, element) => {
  //     let adjustedRoomWidth = this.roomWidth - 4;
  //     let frameDepth = 0.05;
  //     let imageWidth = element.children('img').attr('width') / 130;
  //     let imageHeight = element.children('img').attr('height') / 130;
  //     // console.log(imageWidth, imageHeight);
  //     return (
  //       <a-entity 
  //         key={'P' + index}
  //         rotation='0 180 0'
  //         position={`${-adjustedRoomWidth / (length - 1) * index + adjustedRoomWidth / 2} 1.6 ${this.roomLength / 2}`}>
  //         <a-box 
  //           position='0 0 0'
  //           height={imageHeight + 0.05}
  //           width={imageWidth + 0.05}
  //           depth={frameDepth}
  //           color='green'
  //         />
  //         <a-plane 
  //           // rotation='0 180 0'
  //           height={imageHeight} width={imageWidth}
  //           position={`0 0 ${frameDepth/2 + 0.001}`}
  //           // borderThickness='0.05' 
  //           // borderColor='brown'
  //           src={'#pageIMG' + index}
  //           color='white'
  //           // htmlScale='0.7'
  //         />
  //       </a-entity>
  //     )
  //   })
  // }

  renderColumns () {
    let columnCount = Math.floor(this.roomLength / 7);
    let columns = [];
    let xPos = this.roomWidth * 0.35;
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

  render () {
    return (
      <a-scene physics='debug:false'>
        <a-assets>
          <div id='ajaxHtmlAssets'>
            {this.setHtmlAssets.call(this)}
          </div>
          <a-asset-item id='pageModel' src='/assets/pageModels/stegoceras/stegoceras.dae' />
          <img id='marbleTile' src='/assets/textures/marbleTile.jpg'/>
          <img id='marbleTile2' src='/assets/textures/marbleTile2.jpg'/>
          <img id='marbleTile3' src='/assets/textures/marbleTile3.jpg'/>
          <img id='marbleSurface' src='/assets/textures/marbleSurface.jpg'/>
          <img id='stucco' src='/assets/textures/stucco.jpg'/>
          <img id='stucco2' src='/assets/textures/stucco2.jpg'/>
          <img id='columnSkin' src='/assets/textures/columnSkin.jpg'/>
        </a-assets>

        <a-sky color='blue' />
        <a-plane static-body material='src:#marbleTile; repeat:25 25; metalness:0.1;' 
          position='0 0 0' rotation='-90 0 0' width='50' height='50' />
        
        <Walls width={this.roomWidth} length={this.roomLength} links={this.props.relatedLinks}/>
        
        {this.renderColumns.call(this)}

        {this.renderHtmlTextDisplays.call(this)}

        <Sculpture
          position='0 0 0' 
          modelSrc='#pageModel'
        />


        <a-entity id='camera' position={`0 1.8 ${this.roomLength * 0.4}`} width='0.5'
          camera='near: 0.05' universal-controls kinematic-body='radius: 0.6' />
      </a-scene>
    );
  }
};

module.exports = MuseumScene;
