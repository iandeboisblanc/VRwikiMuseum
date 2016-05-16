import React from 'react'

class Walls extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <a-entity position='0 0 0'>
        <a-box id='northWall' 
          static-body position={`0 4 ${this.props.length/2}`}
          depth={0.01} width={this.props.width} height={8}/>
        <a-box id='southWall' 
          static-body position={`0 4 ${-this.props.length/2}`}
          depth={0.01} width={this.props.width} height={8}/>
        <a-box id='eastWall' 
          static-body position={`${this.props.width/2} 4 0`}
          depth={this.props.length} width={0.01} height={8}/>
        <a-box id='westWall' 
          static-body position={`${-this.props.width/2} 4 0`}
          depth={this.props.length} width={0.01} height={8}/>
      </a-entity>
    ) 
  }
}

module.exports = Walls;
