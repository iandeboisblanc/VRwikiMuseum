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
      textDisplayHtml: [],
      images: []
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
            images: images,
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
        <MuseumScene page={this.state.page} textDisplayHtml={this.state.textDisplayHtml} 
        images={this.state.images} 
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
