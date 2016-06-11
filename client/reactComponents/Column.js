import React from 'react';

const Column = (props) => {
  return (
    <a-entity position={props.position} rotation={props.rotation}>
      <a-cylinder height={props.height} radius={props.radius} 
        material={`src:#columnSkin; repeat:1 ${props.height}; side:front;`}
        theta-length='360' />
      <Pedestal radius={props.radius} position={`0 ${-props.height/2} 0`}/>
      <Pedestal radius={props.radius} position={`0 ${props.height/2} 0`}
        rotation='180 0 0'/>
    </a-entity>
  )
}

const Pedestal = (props) => {
  let pedestalWidth = 1;
  let boxHeight = 0.1;
  return (
    <a-entity rotation={props.rotation || '0 0 0'} position={props.position}>
      <a-torus rotation='90 0 0' position={`0 ${boxHeight + 0.13} 0`}
        radius={props.radius} radius-tubular={0.03} color='grey'/>
      <a-torus rotation='90 0 0' position={`0 ${boxHeight + 0.05} 0`}
        radius={props.radius + 0.05} radius-tubular={0.03} color='grey'/>
      <a-box position={`0 ${boxHeight/2} 0`}
        height={boxHeight} width={pedestalWidth} depth={pedestalWidth} color='grey'/>
    </a-entity>
  )
} 

module.exports = Column;
