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
    this.state = {
      ajaxHtml: ''
    };
    this.roomWidth = 15;
    this.roomLength = 15;
  }

  componentDidMount() {
    $.ajax({
        type: 'GET',
        url: 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Stegoceras&callback=?',
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
            const markup = data.parse.text["*"];
            this.setState({ 
              ajaxHtml: markup
            });
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
        }
    });
    var playerEl = document.querySelector('#camera');
    playerEl.addEventListener('collide', function (e) {
      console.log('Player has collided with body #' + e.detail.body.id);

      e.detail.target.el;  // Original entity (playerEl).
      e.detail.body.el;    // Other entity, which playerEl touched.
      e.detail.contact;    // Stats about the collision (CANNON.ContactEquation).
      e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
    });
  }

  render () {
    return (
      <a-scene physics='debug:true'>
        <a-assets>
          <div id='exampleText'>
            YOO!!!! text here ya heard???
          </div>
          <div id='stegocerasHTML' dangerouslySetInnerHTML={{__html:this.state.ajaxHtml}}>
          </div>
          <a-asset-item id="modelDae" src="/assets/stegoceras.dae"></a-asset-item>
        </a-assets>

        <a-sky color='blue' />
        <a-plane static-body material='color:grey;side:double' position='0 0 0' rotation='-90 0 0' width='100' height='100' />
        <Portal 
          position={`0 0 ${-this.roomLength / 2 + 0.01}`} width='1.5' height='2.5' 
          // redirect='http://www.elliotplant.com' 
        />
        <TextDisplay 
          position={`${-this.roomWidth / 2} 1.5 ${this.roomLength / 3}`} rotation='0 90 0'
          borderThickness='0.05' borderColor='purple'
          htmlSelector='#exampleText'
        />
        <TextDisplay 
          position={`${-this.roomWidth / 2 + 1} 1 ${-this.roomLength / 2 + 1}`} rotation='0 45 0'
          height='2' width='2' depth='0.5'
          borderColor='purple'
          htmlSelector='#exampleText'
          htmlScale='2'
        />
        <TextDisplay 
          position={`${this.roomWidth / 2} 2.05 0`} rotation='0 -90 0'
          height='4' width='2' depth='0.5'
          borderThickness='0.05' 
          borderColor='red'
          htmlSelector='#stegocerasHTML'
          htmlScale='1'
        />
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
