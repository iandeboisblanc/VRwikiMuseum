import React from 'react'


class Player extends React.Component {

  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   var camera = document.querySelector('#playerParent');
  //   camera.addEventListener('hit', () => {
  //     console.log('CAMERA REGISTERS HIT!');
  //   });
  // }

  render () {
    return (
      <a-entity id='playerParent' position='0 1.8 0'>
        <a-camera id='player'  look-controls wasd-controls
          portalCollider={`redirect: ${this.props.redirect}`}
          geometry='primitive:sphere; radius:0.01'
        />
      </a-entity>
    ) 
  }
}

module.exports = Player;

