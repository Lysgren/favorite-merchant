import React from 'react'
import './Button.css'

const button = props => {
  return (
    <div className={ 'Padding' }><a className={ 'Button' } href={ props.href } >{ props.str }</a></div>
  )
}

export default button