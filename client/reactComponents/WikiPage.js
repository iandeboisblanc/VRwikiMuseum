import React from 'react';
import MuseumScene from './MuseumScene'
const $ = require('jquery');
require('./../styles.css');

class WikiPage extends React.Component {
  constructor(props) {
    let location = window.location.toString().split('/wiki/')[1];
    super(props);
    this.state = {
      page: location,
      vrMode: false,
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
          if(data.error) {
            console.error(data.error.info);
            this.setState({
              rawResults: '<div>The requested page does not exist.</div>'
            });
          } else {
            let rawResults = $('<div id="rawResults"/>').append(data.parse.text["*"])[0];
            let rawResultsClone = $('<div id="rawResults"/>').append($(data.parse.text["*"]).clone());
            rawResultsClone.find('.mw-editsection, .portal').empty();
            let filteredResults = $(rawResults).children('p, h2, h3, table, .thumb');
            filteredResults = filteredResults.filter((child, element) => element.innerText.length > 0);

            const parsedHtmlSections = [];
            let contentEnded = false;
            let lastSection = undefined;
            for(var i = 0; i < filteredResults.length; i++) {
              let htmlSection = filteredResults[i]
              if($(htmlSection).children('#See_also, #References, #External_links').length) {
                contentEnded = true;
              }
              if(!contentEnded) {
                $(htmlSection).css('padding', '0px 10px');
                $(htmlSection).children('.mw-editsection').empty(); //Remove 'Edit' tags on titles

                // If header or image, create a new Section
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
                    var newSection = $('<section/>').append(htmlSection); //if no previous sections
                    parsedHtmlSections.push(newSection);
                    lastSection = newSection
                  }
                }
              }
            }
            this.setState({
              rawResults: rawResultsClone,
              displayHtml: parsedHtmlSections,
              infoLoaded: true
            });
          }
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
        }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    window.location = '/wiki/' + e.target[0].value;
  }

  render () {
    const links = [
      { title: 'Stegosaurus', url: 'wiki:Stegosaurus' },
      { title: 'Celestial Dance', url: 'http://www.elliotplant.com' },
      { title: 'Issues', url: 'https://github.com/iandeboisblanc/wikiMuseumVR/issues' },
    ];
    if(this.state.vrMode && this.state.infoLoaded) {
      return (
        <MuseumScene page={this.state.page} displayHtml={this.state.displayHtml}
        relatedLinks={links}
        />
      )
    } else {
      //ultimately have a search
      //add info
      //and the button to switch to VR
      return (
        <div className='nonVrView'>
          <header>
            <h1 className='pageHeader'> VR Wiki Museum </h1>
            <div>
              <form onSubmit={this.handleSubmit.bind(this)}>
                <input placeholder='Search Wiki Pages' />
                <button> Submit </button>
              </form>
            </div>
            <div>
              <button onClick={() => {this.setState({vrMode:true})}}> Enter VR </button>
            </div>
          </header>
          <h1 className='nonVrContentHeader'>{this.state.page}</h1>
          <div dangerouslySetInnerHTML={{__html:$(this.state.rawResults).html()}} ></div>
        </div>
      );
    }
  }
};

module.exports = WikiPage;
