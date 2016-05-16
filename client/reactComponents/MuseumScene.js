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
      rawAjaxHtml: ''
    };
    this.roomWidth = 15;
    this.roomLength = 15;
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
    const queryType = 'parse';
    let url = '';
    if(queryType === 'query') {
      url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=Stegoceras&callback=?'
    } else {
      url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=Stegoceras&callback=?'
    }
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
          if(queryType == 'query') {
            var queryResults = data.query.pages;
            queryResults = queryResults[Object.keys(queryResults)[0]].revisions[0]['*'];
          } else {
            var parseResults = $('<div id="queryResults"/>').append(data.parse.text["*"])[0];
            parseResults = $(parseResults).children('p, h2');
            parseResults = parseResults.filter((child, element) => element.innerText.length > 0);
            // parseResults = parseResults.find('> p');
          }
          const markup = queryResults || parseResults;
          console.log('$$$$$$$$$$$$$$$$$$$$$$$$$', markup)
          this.setState({ 
            rawAjaxHtml: markup
          });
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
        }
    });
  }

  parseAndSetHtmlAssets () {
    if(this.state.rawAjaxHtml) {
      return this.state.rawAjaxHtml.map((index, element) => {
        console.log(element);
        return (
          <div id={`stegocerasHTML${index}`} key={index}>
            <p>{element.innerText}</p>
          </div>
        )
      })
    } else {
      return (
        <div />
      );
    }
  }

  renderHtmlTextDisplay () {
    if(this.state.rawAjaxHtml) {
      return (
        <TextDisplay 
          position={`${this.roomWidth / 2} 2.05 0`} rotation='0 -90 0'
          height='4' width='2' depth='0.5'
          borderThickness='0.05' 
          borderColor='red'
          htmlSelector='#stegocerasHTML0'
          htmlScale='1'
        />
      )
    }
  }

  render () {
    return (
      <a-scene physics='debug:true'>
        <a-assets>
          <div id='exampleText'>
            YOO!!!! text here ya heard???
          </div>
          {this.parseAndSetHtmlAssets.call(this)}
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
        {this.renderHtmlTextDisplay.call(this)}
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
