import React from 'react'
import './ListItem.css'

const ListItem = props => {

  return (
    <li className={ 'ListItem' }>
      <div>Vendor: { props.vendor } </div>
      <img src={ `//logo.clearbit.com/${props.vendor}.com?size=80` } alt=''></img>
      <div> { props.price } { props.currency }</div>
      <hr />
    </li>
  )
}

export default ListItem