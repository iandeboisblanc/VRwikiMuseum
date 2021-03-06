import React from 'react';
import MuseumScene from './MuseumScene'
const $ = require('jquery');
require('./../styles.css');

class WikiPage extends React.Component {
  constructor(props) {
    super(props);
    let page = parsePage(window.location);
    //could set vrMode state based on url
    this.state = {
      page: page,
      vrMode: false,
      infoLoaded: false,
      rawContent: '',
      vrContent: [],
      relatedLinks: []
    };
    window.addEventListener('popstate', (event) => {
      let page = parsePage(window.location);
      //could set vrMode state based on url
      this.setState({
        infoLoaded: false,
        page: page
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
              rawContent: '<div>The requested page does not exist.</div>',
              infoLoaded: true
            });
          } else {
            // Prep raw results for 2D page
            let rawResults = $('<div id="rawResults"/>').append(data.parse.text["*"])[0];
            let rawResultsClone = $('<div id="rawResults"/>').append($(data.parse.text["*"]).clone());
            rawResultsClone.find('.mw-editsection, .portal').empty();

            // Prep filtered results for 3D page
            const actuallyWikiContent = $(rawResults).context.children[0];
            let filteredResults = $(actuallyWikiContent).children('p, h2, h3, '+ /*table,*/ 'ul, ol, .thumb');
            filteredResults = filteredResults.filter((index, element) => element.innerText.length > 0);
            filteredResults.find('.mw-editsection, .reference, script').empty();
            filteredResults.find('a').addClass('filteredResultsAnchor');

            // Links for doorways
            let links = filteredResults.find('a')
              .filter((index, element) => {
                return !($(element).is('.image, .internal'))
                && element.attributes.title
                && element.attributes.title.value.indexOf(':') === -1
                && element.attributes.title.value.indexOf('(') === -1;
              }).map((index, element) => {
                return {
                  title: element.attributes.title.value,
                  url: element.attributes.href.value
                };
              });

            const parsedHtmlSections = [];
            let contentEnded = false;
            let lastSection = undefined;
            let lastElement = undefined;
            for(var i = 0; i < filteredResults.length; i++) {
              let htmlSection = filteredResults[i];
              if($(htmlSection).children('#See_also, #References, #External_links').length) {
                contentEnded = true;
              }
              if(!contentEnded) {
                $(htmlSection).css('padding', '0px 10px');

                // Handle images...
                if($(htmlSection).is('.thumb')) {
                  let img = $(htmlSection).find('img');
                  let title = $(htmlSection).find('.thumbcaption')[0].innerText; // .innerHTML;
                  img.attr('title', title);
                  let newSection = $('<section />').append(img);
                  parsedHtmlSections.push(newSection);

                // Handle new text sections...
                } else if($(htmlSection).is('h2') //if header
                  || ($(htmlSection).is('h3') && !$(lastElement).is('h2')) //or h3 starts section
                  || !lastSection) { //or no previous section

                  let newSection = $('<section />').append(htmlSection);
                  parsedHtmlSections.push(newSection);
                  lastSection = newSection;

                // Handle stray content...
                } else {
                  if(lastSection.text().length + htmlSection.innerText.length < 1400) {
                    $(lastSection).append(htmlSection)
                  }
                  // Handle stray content that overflows text display...
                  // else {
                  //   let newSection = $('<section/>').append(htmlSection);
                  //   parsedHtmlSections.push(newSection);
                  //   lastSection = newSection
                  // }
                }
                lastElement = htmlSection;
              }
            }
            console.log('PARSED HTML', parsedHtmlSections);
            let vrContent = parsedHtmlSections.filter((section) => {
              let length = section.text().length;
              return length === 0 || length > 80;
            })

            this.setState({
              rawContent: rawResultsClone,
              vrContent: vrContent,
              relatedLinks: links,
              infoLoaded: true
            });
            callback.call(this, null);
          }
        },
        error: function (errorMessage) {
            console.error('Error retrieving from wikipedia:', errorMessage);
            this.setState({
              infoLoaded: true,
              rawContent: `<div>Error retrieving information from wikipedia.
                Please try again later.</div>`
            })
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
    let links = getRandomLinks(this.state.relatedLinks);
    if(this.state.page === 'Stegoceras' || this.state.page === 'Stegosaurus') {
      let dinosaurLink = this.state.page === 'Stegoceras' ?
      {
        title: 'Stegosaurus',
        url: '/wiki/Stegosaurus'
      } : {
        title: 'Stegoceras',
        url: '/wiki/Stegoceras'
      };
      links = [
        dinosaurLink,
        ...links.slice(1)
      ];
    }

    if(this.state.vrMode && this.state.infoLoaded) {
      return (
        <MuseumScene
        page={styleTitle(this.state.page)}
        displayHtml={this.state.vrContent}
        isTouch={this.props.isTouch}
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
              <button onClick={this.enterVr.bind(this)}> Enter 3D </button>
            </div>
          </header>
          <h1 className='nonVrContentHeader'>{styleTitle(this.state.page)}</h1>
          <div dangerouslySetInnerHTML={{__html:$(this.state.rawContent).html()}} ></div>
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

function getRandomLinks(links) {
  const numberOfLinks = 3;
  const randomLinks = [];
  for(var i = 0; i < numberOfLinks; i++) {
    if(links.length) {
      randomLinks.push(links.splice(Math.floor(Math.random() * links.length), 1)[0]);
    }
  }
  return randomLinks;
}

function parsePage(location) {
  return location.toString().split('/wiki/')[1];
}

function styleTitle(title) {
  return title.replace(/_/g, ' ').replace(/%20/g, ' ')
    .split(' ').map((section) => {
      return section[0].toUpperCase() + section.slice(1);
    }).join(' ');
}
