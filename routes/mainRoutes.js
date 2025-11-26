const express = require('express')

const passwordRouter = require('./passwordRoutes')
const creditCardRouter = require('./creditCardRoutes')

const commonRouter = express.Router()

commonRouter.get('/', (req, res) => {
    res.json({
        message: 'SecureVault API',
        endpoints: {
            passwords: {
                addPassword: 'POST /passwords/addPassword',
                listPasswords: 'GET /passwords/listPasswords',
                editPassword: 'POST /passwords/editPassword/:passwordId',
                removePassword: 'DELETE /passwords/removePassword/:passwordId',
                passwordDetails: 'POST /passwords/passwordDetails/:passwordId',
                passwordGenerator: 'POST /passwords/passwordGenerator'
            },
            creditCards: {
                addCard: 'POST /cards/addCard',
                listCards: 'GET /cards/listCards',
                cardDetails: 'POST /cards/cardDetails/:cardId',
                updateCard: 'PUT /cards/updateCard/:cardId',
                deleteCard: 'DELETE /cards/deleteCard/:cardId'
            }
        }
    })
})

commonRouter.use('/passwords', passwordRouter)
commonRouter.use('/cards', creditCardRouter)

module.exports = commonRouter
