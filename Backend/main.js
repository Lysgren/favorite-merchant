const express = require ('express')
const app = express()

const cors = require('cors')
require('dotenv').config()

const middleware = require ('./middleware/middleware.js')
const routes = require ('./routes/router.js')

app.use(express.json())

// Load environment variables 
const PORT = process.env.PORT || 8080

// Middleware
app.use(middleware.Logger)
app.use(cors({ origin: 'http://localhost:3000' }))
// app.use(cors())

// Routes
app.use(routes)

app.listen(PORT, () => console.log(`Running on port ${PORT}`))