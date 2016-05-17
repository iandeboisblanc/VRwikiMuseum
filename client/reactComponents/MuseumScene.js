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
      textDisplayHtml: [],
      mainDescriptionHtml: ''
    };
    this.roomWidth = 15;
    this.roomLength = 40;
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
    this.getWikiInformation();
  }

  getWikiInformation () {
    const url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=Stegoceras&callback=?'
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
          let parseResults = $('<div id="parseResults"/>').append(data.parse.text["*"])[0];
          parseResults = $(parseResults).children('p, h2');
          parseResults = parseResults.filter((child, element) => element.innerText.length > 0);
          this.setState({
            mainDescriptionHtml: parseResults[0]
          });
          const splitResults = [];
          for(var i = 1; i < parseResults.length; i++) {
            if($(parseResults[i]).is('h2')) {
              var newSection = $('<section/>').append(parseResults[i]);
              splitResults.push(newSection);
            } else {
              if(splitResults.length) {
                $(splitResults[splitResults.length - 1]).append(parseResults[i])
              } else {
                var newSection = $('<section/>').append(parseResults[i]);
                splitResults.push(newSection);
              }
            }
          }
          // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$', splitResults);
          this.setState({ 
            textDisplayHtml: splitResults
          });
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
        }
    });
  }

  setHtmlAssets () {
    return this.state.textDisplayHtml.map((element, index) => {
      let html = element.html();
      return (
        <div id={`stegocerasHTML${index}`} key={index} dangerouslySetInnerHTML={{__html:html}}></div>
      )
    })
  }

  renderHtmlTextDisplays () {
    let assets = this.state.textDisplayHtml;
    return assets.map((element, index) => {
      return (
        <TextDisplay 
          key={index}
          position={`${this.roomWidth / 2} 2.05 ${this.roomLength / assets.length * index - this.roomLength / 2}`} rotation='0 -90 0'
          height='4' width='2' depth='0.5'
          borderThickness='0.05' 
          borderColor='red'
          htmlSelector={'#stegocerasHTML' + index}
          htmlScale='1'
        />
      )
    });
  }

  render () {
    return (
      <a-scene physics='debug:true'>
        <a-assets>
          <div id='exampleText'>
            YOO!!!! text here ya heard???
          </div>
          <div id='ajaxHtmlAssets'>
            {this.setHtmlAssets.call(this)}
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
        {this.renderHtmlTextDisplays.call(this)}
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
