const mongoose = require('mongoose');

const logger = require('../utils/logger')

const mongoURL = process.env.URL || process.env.MONGODB_URI
if (!mongoURL) {
    console.error('MongoDB connection string not found in environment variables')
    process.exit(1)
}

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
})

mongoose.connection.on('error', (error) => {
    console.log("Mongoose Error")
    console.log('Error: ', error)
    logger.log('error', `Mongoose error: ${error}`)
})
mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected!")
    logger.log('info', 'Mongoose is connected!')
})