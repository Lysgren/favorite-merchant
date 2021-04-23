import React, { Component } from 'react'
import Button from '../UI/Button/Button'
import Spinner from '../UI/Spinner/Spinner'
import ListItem from '../UI/ListItem/ListItem'
import './Layout.css'

class Layout extends Component {
  state = {
    transActionLink: 'https://link.tink.com/1.0/transactions/connect-accounts/?client_id=c6959dcee54a42178b8b9a947504f191&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&market=SE&locale=sv_SE&test=true&scope=transactions:read',
    transactions: false,
    loading: false,
    error: false
  }

  async getDataFromAPIHandler(payload) {
    const jsonObject = { code: payload }
    const JSONPayload = JSON.stringify(jsonObject)

    try {
      this.setState({ loading: true })
      const request = await fetch('http://localhost:8080/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONPayload
      })
  
      const responseData = await request.json()
      console.log(responseData)
      this.setState({ loading: false, transactions: responseData })
    } catch (error) {
      console.log(error)
    }

  }

  componentDidMount() {
    // Username: u83096061
    // Password: dfd400

    let params = window.location.search
    params = params.split('&')

    if (params.length === 2 && params[0].includes('?code=') && params[1].includes('credentialsId=')) {
      const code = params[0]
      const apiCode = code.replace('?code=', '')

      this.getDataFromAPIHandler(apiCode)
    }

  }

  render() {
    let list = null

    if (this.state.loading) {
      list = <Spinner />
    }

    if (this.state.transactions.length == 0) {
      list = 'No purchases was made during that year'
    } else if (this.state.transactions.length > 0) {
      list = (
        <ul>
          { 
            this.state.transactions.map((element, index) => {
              if (element.Price > 0) {
                return <ListItem 
                  key={ index } 
                  vendor={ element.Vendor } 
                  price={ `Total gained: ${element.Price}` } 
                  currency={ element.Currency }
                />
              } else {
                return <ListItem
                  key={ index }
                  vendor={ element.Vendor }
                  price={ `Total spent: ${element.Price}` }
                  currency={ element.Currency }
                />
              }
            })
          }
        </ul>
      )
    }
    
    return (
      <div className={ 'Layout' }>
        <div className={ 'InfoText' }>This app let's you see what merchant is your favorite!</div>
        { list }
        <Button href={ this.state.transActionLink } str={ 'View my favorite merchant' }/>
        <div className={ 'InfoTextSmall' }>Ps, make sure both the frontend and the backend is running</div>
      </div>
    )
  }
}

export default Layout