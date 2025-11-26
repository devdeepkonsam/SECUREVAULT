const { createLogger, transports, format } = require('winston')
require('winston-mongodb')

// Build transports array conditionally
const loggerTransports = [
    new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), format.json())
    }),
    new transports.Console({
        level: "error",
        format: format.combine(format.timestamp(), format.json())
    })
]

// Only add file transport in non-serverless environments
// Check for Vercel or AWS Lambda (serverless environments)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL_ENV
if (!isServerless) {
    loggerTransports.push(
        new transports.File({
            filename: 'logs/logger.log',
            level: "info",
            maxsize: 5242880,
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level ${info.level}: ${info.timestamp} ${info.message}`)
            ),
        })
    )
}

// Add MongoDB transport if URL is available
if (process.env.URL || process.env.MONGODB_URI) {
    loggerTransports.push(
        new transports.MongoDB({
            level: "info",
            db: process.env.URL || process.env.MONGODB_URI,
            options: {
                useUnifiedTopology: true,
            },
            collection: 'logData',
            format: format.combine(format.timestamp(), format.json())
        })
    )
}

const logger = createLogger({
    transports: loggerTransports
})

module.exports = logger
