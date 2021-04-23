const express = require('express')
const router = express.Router()

const controller = require('../controllers/controller.js')

router.post('/getData', controller.getData)

module.exports = router