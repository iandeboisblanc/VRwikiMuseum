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

        <a-sky color='blue' />
        <a-plane material='color:grey;side:double' position='0 0 0' rotation='-90 0 0' width='100' height='100' />
        <Portal player='#player' position='0 0 -10' width='1.5' height='2.5' />
        <TextDisplay 
          position='-5 1.5 -5' rotation='0 20 0'
          borderThickness='0.05' borderColor='purple'
          htmlSelector='#exampleText'
        />
        <TextDisplay 
          position='-8 1 -3' rotation='0 45 0'
          height='2' width='2' depth='0.5'
          // borderThickness='0.05' 
          borderColor='purple'
          htmlSelector='#exampleText'
          htmlScale='2'
        />
        <Player/>
      </a-scene>
    );
  }
};

module.exports = MuseumScene;