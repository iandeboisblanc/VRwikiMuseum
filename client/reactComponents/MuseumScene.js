import React from 'react';
import Player from './Player'
import Portal from './Portal'
import TextDisplay from './TextDisplay'

class MuseumScene extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render () {
    return (
      <a-scene>
        <a-assets>
          <div id='exampleText'>
            YOO!!!! text here ya heard???
          </div>
        </a-assets>

        <a-sky color='blue'></a-sky>
        <a-plane material='color:grey;side:double' position='0 0 0' rotation='-90 0 0' width='100' height='100' />
        <Portal player='#player' position='0 0 -10' width='1.5' height='2.5' />
        <TextDisplay position='-5 0 -5'>
          <div id='exampleChildText'>
            Can we get it to render child text?
          </div>
        </TextDisplay>
        <Player/>
      </a-scene>
    );
  }
};

module.exports = MuseumScene;