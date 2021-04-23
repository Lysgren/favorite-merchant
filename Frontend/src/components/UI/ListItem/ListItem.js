import React from 'react'
import './ListItem.css'

const ListItem = props => {
  return (
    <li className={ 'ListItem' }>
      <div>Vendor: { props.vendor } </div>
      <div> { props.price } { props.currency }</div>
    </li>
  )
}

export default ListItem