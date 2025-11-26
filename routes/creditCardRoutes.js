const express = require('express');
const router = express.Router();
const creditCardController = require('../controllers/creditCardController');
const { authenticateUser, getUserId } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateUser, getUserId);

router.post('/addCard', creditCardController.addCard);
router.get('/listCards', creditCardController.listCards);
router.post('/cardDetails/:cardId', creditCardController.getCardDetails);
router.put('/updateCard/:cardId', creditCardController.updateCard);
router.delete('/deleteCard/:cardId', creditCardController.deleteCard);

module.exports = router;
