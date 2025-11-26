require('dotenv').config()
const express = require('express')
const path = require('path')
const { clerkMiddleware } = require('@clerk/express')
const cors = require('cors')

require('./config/modelConfig')
const mainRouter = require('./routes/mainRoutes')
const logger = require('./utils/logger')

const app = express()

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Clerk middleware for authentication
app.use(clerkMiddleware())

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', mainRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
    logger.log('info', `Server is running on ${PORT}`)
})
