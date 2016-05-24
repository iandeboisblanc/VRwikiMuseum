import React from 'react';
import MuseumScene from './MuseumScene'
const $ = require('jquery');

class WikiPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'Stegoceras',
      vrMode: true,
      infoLoaded: false,
      displayHtml: []
    };
  }

  componentWillMount() {
    this.getWikiInformation();
  }

  getWikiInformation () {
    let url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=${this.state.page}&callback=?`
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
          // Parse Wiki data into discrete sections by topic
          let rawResults = $('<div id="rawResults"/>').append(data.parse.text["*"])[0];
          let filteredResults = $(rawResults).children('p, h2, h3, table, .thumb');
          filteredResults = filteredResults.filter((child, element) => element.innerText.length > 0);

          const parsedHtmlSections = [];
          let contentEnded = false;
          let lastSection = '';
          for(var i = 0; i < filteredResults.length; i++) {
            let htmlSection = filteredResults[i]
            if($(htmlSection).children('#See_also, #References, #External_links').length) {
              contentEnded = true;
            }
            if(!contentEnded) {
              $(htmlSection).css('padding', '0px 10px');
              $(htmlSection).children('.mw-editsection').empty(); //Remove 'Edit' tags on titles

              // If header, create a new Section
              // Otherwise, add to previous text section
              if($(htmlSection).is('h2')) {
                var newSection = $('<section />').append(htmlSection);
                parsedHtmlSections.push(newSection);
                lastSection = newSection;
              } else if($(htmlSection).is('.thumb')) {
                var img = $(htmlSection).find('img');
                var title = $(htmlSection).find('.thumbcaption')[0].innerText; // .innerHTML;
                img.attr('title', title);
                var newSection = $('<section />').append(img);
                parsedHtmlSections.push(newSection);
              } else {
                if(parsedHtmlSections.length) {
                  $(lastSection).append(htmlSection)
                } else {
                  var newSection = $('<section/>').append(htmlSection);
                  parsedHtmlSections.push(newSection);
                  lastSection = newSection
                }
              }
            }
          }
          this.setState({ 
            displayHtml: parsedHtmlSections,
            infoLoaded: true
          });
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
        }
    });
  }

  render () {
    if(this.state.vrMode && this.state.infoLoaded) {
      return (
        <MuseumScene page={this.state.page} displayHtml={this.state.displayHtml} 
        relatedLinks={['wiki:Stegosaurus', 'http://www.elliotplant.com', 'https://github.com/iandeboisblanc/wikiMuseumVR/issues']} 
        />
      )
    } else {
      //ultimately have a search
      //add info
      //and the button to switch to VR
      return (
        <div>Information Will Go Here</div>
      );
    }
  }
};

module.exports = WikiPage;
