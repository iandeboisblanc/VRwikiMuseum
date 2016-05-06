require('aframe');
import React from 'react';
import Player from './Player'
import Portal from './Portal'


class MuseumScene extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render () {
    return (
      <a-scene>
        <a-assets>
        </a-assets>

        <a-sky color='blue'></a-sky>
        <a-plane material='color:grey;side:double' position='0 0 0' rotation='-90 0 0' width='100' height='100' />
        <Portal player='#player' position='0 0 -10' width='1.5' height='2.5' />
        <Player/>
      </a-scene>
    );
  }
};

module.exports = MuseumScene;