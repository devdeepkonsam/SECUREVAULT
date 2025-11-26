require('dotenv').config()
const express = require('express')
const path = require('path')
const { clerkMiddleware } = require('@clerk/express')
const cors = require('cors')

require('./config/modelConfig')
const mainRouter = require('./routes/mainRoutes')
const logger = require('./utils/logger')

const app = express()

// Enable CORS - Allow all origins in production (same domain), localhost in dev
app.use(cors({
    origin: true, // Allow all origins (since frontend and backend are on same domain)
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

// Catch-all for SPA - serve index.html for non-API routes
app.get('*', (req, res) => {
    // Don't intercept API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' })
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

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
