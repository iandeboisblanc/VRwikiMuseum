import React from 'react';

const Column = (props) => {
  return (
    <a-entity position={props.position} rotation={props.rotation}>
      <a-box height={0.2} width={0.5} depth={0.5} position='0 -4 0' />
      <a-cylinder height={props.height} radius={props.radius} src='#columnSkin' />
    </a-entity>
  )
}

module.exports = Column;