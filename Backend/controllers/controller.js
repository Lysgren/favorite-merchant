const model = require('../models/model.js')

const getData = (req, res) => {
  const { code } = req.body

  if (!code) { res.json({error: 'No code sent'})}

  model.main(code)
    .then(result => res.json(result))
    .catch(error => {
      console.log(error)
      res.json(error)
    })
}

module.exports = {
  getData
}