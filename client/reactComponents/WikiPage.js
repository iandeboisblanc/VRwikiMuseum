import React from 'react';
import MuseumScene from './MuseumScene'
const $ = require('jquery');
require('./../styles.css');

class WikiPage extends React.Component {
  constructor(props) {
    super(props);
    let location = window.location.toString().split('/wiki/')[1];
    //could set vrMode state based on url
    this.state = {
      page: location,
      vrMode: false,
      infoLoaded: false,
      displayHtml: []
    };
    window.addEventListener('popstate', (event) => {
      let location = window.location.toString().split('/wiki/')[1];
      //could set vrMode state based on url
      this.setState({
        infoLoaded: false,
        page: location
      });
      this.getWikiInformation.call(this, this.state.page);
    });
  }

  componentWillMount() {
    this.getWikiInformation.call(this, this.state.page);
  }

  getWikiInformation (page, callback) {
    let url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=${page}&callback=?`
    callback = callback || function(){return;};
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
              rawResults: '<div>The requested page does not exist.</div>',
              infoLoaded: true
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
                  if(lastSection && lastSection.html().length + htmlSection.outerHTML.length < 3000) {
                    // && lastSection.outerHTML.length + htmlSection.outerHTML.length < 3000
                    // console.log('$$$$$$$$$', lastSection, lastSection.html(), htmlSection.outerHTML.length);
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
            callback.call(this, null);
          }
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
            callback.call(this, errorMessage);
        }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    window.location = '/wiki/' + e.target[0].value;
  }

  enterVr() {
    this.setState({
      vrMode: true
    });
  }

  exitVr() {
    this.setState({
      vrMode: false
    });
  }

  changePage(page) {
    window.history.pushState(page, page, `/wiki/${page}`);
    this.setState({
      infoLoaded: false,
      page:page
    });
    this.getWikiInformation.call(this, page);
  }

  render () {
    const links = [
      { title: 'Stegosaurus', url: '/wiki/Stegosaurus' },
      { title: 'Celestial Dance', url: 'http://www.elliotplant.com' },
      { title: 'Issues', url: 'https://github.com/iandeboisblanc/wikiMuseumVR/issues' },
    ];
    if(this.state.vrMode && this.state.infoLoaded) {
      return (
        <MuseumScene page={this.state.page} displayHtml={this.state.displayHtml}
          relatedLinks={links} 
          exitVr={this.exitVr.bind(this)}
          changePage={this.changePage.bind(this)}/>
      )
    } else if(this.state.infoLoaded) {
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
              <button onClick={this.enterVr.bind(this)}> Enter VR </button>
            </div>
          </header>
          <h1 className='nonVrContentHeader'>{this.state.page}</h1>
          <div dangerouslySetInnerHTML={{__html:$(this.state.rawResults).html()}} ></div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
};

module.exports = WikiPage;
