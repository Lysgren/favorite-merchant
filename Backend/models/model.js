const axios = require('axios')

const clientID = process.env.CLIENT_ID
const cliendSecret = process.env.CLIENT_SECRET

// Username: u83096061
// Password: dfd400

// Removes duplicates from transactions and adds the unscaledValue together 
const transformTransactions = transactions => {
  const vendorTransactionsTotal = []

  transactions.forEach(element => {
    // Checks if vendorTransactionsTotal contains the given element
    const currentTransaction = vendorTransactionsTotal.find(check => check.Vendor === element.descriptions.display)

    // If it contains the element then it adds the unscaledValue to the elements price
    if (currentTransaction) {
      currentTransaction.Price += Number(element.amount.value.unscaledValue)
    
    // Creates a new object and pushes it into vendorTransactionsTotal with data from the element
    } else {
      vendorTransactionsTotal.push({
        'Vendor': element.descriptions.display,
        'Original vendor' : element.descriptions.original,
        'Price': Number(element.amount.value.unscaledValue),
        'Currency' : element.amount.currencyCode,
        'Date': element.dates.booked
      })
    }
  })

  // Sorts vendorTransactionsTotal after total price
  const sortedVendorTransactionsTotal = vendorTransactionsTotal.sort((first, second) => first.Price - second.Price)

  return sortedVendorTransactionsTotal
}

// Retrives the transactions form the users account using the accessToken
const getTransactions = async (accessToken, nextPage) => {
  // Changes the URL used depending if nextPage was passed as a parameter
  const url = !nextPage ? 'https://api.tink.com/v2/transactions?pending=true' : `https://api.tink.com/v2/transactions?pending=true&pageSize=100&pageToken=${nextPage}`

  // Sends a request to the Tink API with the accessToken
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.data
}

// Removes all other years from the transaction array except the year passed as a parameter
const removeOtherYears = (transactions, year) => {
  return transactions.filter(transaction => {
    return transaction.dates.booked.substring(0, 4) == year
  })
}

// Returns all transactions that are the same as the year specificed
const getAllValidTransactions = async(accessToken, year) => {
  // Gets the initial set of transactions
  const response = await getTransactions(accessToken)
  let { nextPageToken, transactions } = response

  // Removes all years that aren't the same as the year specified
  transactions = removeOtherYears(transactions, year)

  // Loops until nextPageToken is null 
  if (nextPageToken) {
    let iteration = true

    while (iteration) {
      // Gets the next array of transaction
      const otherResponse = await getTransactions(accessToken, nextPageToken)

      otherResponse.transactions = removeOtherYears(otherResponse.transactions, year)

      transactions.push(...otherResponse.transactions)
      // transactions = removeOtherYears(transactions, year)

      nextPageToken = otherResponse.nextPageToken

      if (nextPageToken) {
        iteration = false
      }
    }
  }

  return transactions
}

// Creates the formBody used to make a request in getAccessToken
const createFormBody = code => {
  // Sets up the data as an object
  const formData = {
    code: code,
    client_id: clientID,
    client_secret: cliendSecret,
    grant_type: 'authorization_code'
  }

  // Transforms the formData object to an array which the request can use
  let formBody = []
  for (let property in formData) {
    let encodedKey = encodeURIComponent(property)
    let encodedValue = encodeURIComponent(formData[property])
    formBody.push(encodedKey + "=" + encodedValue)
  }
  formBody = formBody.join("&")

  return formBody
}

// Gets the accessToken from the Tink API
const getAccessToken = async formBody => {
  // Send request to the Tink API to get the accessToken
  const response = await axios.post('https://api.tink.com/api/v1/oauth/token', formBody, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })

  return response.data.access_token
}

const main = async code => {
  const formBody = createFormBody(code)
  const accessToken = await getAccessToken(formBody)
  if (!accessToken) { return 'No access token given by Tink API' }

  const year = 2020
  const validTransactions = await getAllValidTransactions(accessToken, year)
  const filteredTransactions = transformTransactions(validTransactions)

  return filteredTransactions
}

module.exports = {
  main
}