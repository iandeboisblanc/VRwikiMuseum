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
      mainDescriptionHtml: '',
      images: []
    };
    this.roomWidth = 15;
    this.roomLength = 25;
  }

  componentWillMount() {
    this.getWikiInformation();
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

  getWikiInformation () {
    const url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=Stegoceras&callback=?'
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
          // Parse Wiki data into discrete sections by topic
          let rawResults = $('<div id="rawResults"/>').append(data.parse.text["*"])[0];
          let images = $(rawResults).find('img').map((index, element) => {
            if($(element).attr('width') > 100) {
              return $('<section />').append(element)
            }
          });
          let filteredResults = $(rawResults).children('p, h2, h3, table');
          filteredResults = filteredResults.filter((child, element) => element.innerText.length > 0);

          const parsedHtmlSections = [];
          for(var i = 0; i < filteredResults.length; i++) {
            let htmlSection = filteredResults[i]
            $(htmlSection).css('padding', '0px 10px');
            $(htmlSection).children('.mw-editsection').empty(); //Remove 'Edit' tags on titles

            // If header that is not See Also, References, or External Links, create a new Section
            // Otherwise, add to previous section
            if($(htmlSection).is('h2')) {
              if($(htmlSection).children('#See_also, #References, #External_links').length == 0) {
                var newSection = $('<section />').append(htmlSection);
                parsedHtmlSections.push(newSection);
              }
            } else {
              if(parsedHtmlSections.length) {
                $(parsedHtmlSections[parsedHtmlSections.length - 1]).append(htmlSection)
              } else {
                var newSection = $('<section/>').append(htmlSection);
                parsedHtmlSections.push(newSection);
              }
            }
          }
          this.setState({ 
            textDisplayHtml: parsedHtmlSections,
            images: images
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
        <div id={`stegocerasHTML${index}`} key={'text' + index} dangerouslySetInnerHTML={{__html:html}} />
      )
    }).concat(this.state.images.map((index, element) => {
      // console.log(element);
      let src = 'https:' + $(element).children('img').attr('src');
      return (
        <img id={`stegocerasIMG${index}`} key={'img' + index} crossOrigin='anonymous' src={src} />
      );
    }));
  }

  renderHtmlTextDisplays () {
    let assets = this.state.textDisplayHtml //.slice(1);
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
          htmlSelector={'#stegocerasHTML' + (index)}
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
          htmlSelector={'#stegocerasHTML' + (leftHalf.length + index)}
          htmlScale='0.7'
        />
      )
    }));
  }

  renderImageDisplays() {
    let images = this.state.images //.slice(1);
    let length = images.length;
    return images.map((index, element) => {
      var adjustedRoomWidth = this.roomWidth - 4;
      return (
        <a-plane 
          key={'P' + index}
          position={`${-adjustedRoomWidth / (length - 1) * index + adjustedRoomWidth / 2} 1.5 ${this.roomLength / 2 - 1.5}`} 
          rotation='0 180 0'
          height='1' width='1' depth='1'
          // borderThickness='0.05' 
          // borderColor='brown'
          src={'#stegocerasIMG' + index}
          color='white'
          // htmlScale='0.7'
        />
      )
    })
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
