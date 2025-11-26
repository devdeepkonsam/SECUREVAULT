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
const allowedOrigins = process.env.VERCEL 
    ? [process.env.VERCEL_URL, 'https://securevault.vercel.app'] 
    : ['http://localhost:3000']

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)
        if (allowedOrigins.some(allowed => origin.includes(allowed))) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Clerk middleware for authentication
app.use(clerkMiddleware())

// API routes BEFORE static files (priority)
app.use('/api', mainRouter)

// Static files served last
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000

// For Vercel serverless deployment
if (process.env.VERCEL) {
    module.exports = app
} else {
    // For local development
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
        logger.log('info', `Server is running on ${PORT}`)
    })
}
