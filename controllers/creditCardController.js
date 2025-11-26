const encryption = require('../utils/encryption');
const creditCardModel = require('../models/creditCardModel');
const logger = require('../utils/logger');

module.exports = {
    addCard: async (req, res) => {
        try {
            const { cardName, cardholderName, cardNumber, expiryDate, cvv, cardType, notes } = req.body;
            const userId = req.userId;

            if (!cardName || !cardholderName || !cardNumber || !expiryDate || !cvv) {
                return res.status(400).json({
                    success: false,
                    message: "All required fields must be provided."
                });
            }

            // Check if card with same name exists
            const existingCard = await creditCardModel.findOne({
                cardName: cardName,
                userId: userId
            });

            if (existingCard) {
                return res.status(400).json({
                    success: false,
                    message: "A card with this name already exists."
                });
            }

            // Encrypt sensitive data
            const encryptedNumber = encryption.encrypt(cardNumber);
            const encryptedCVV = encryption.encrypt(cvv);

            const cardData = new creditCardModel({
                userId: userId,
                cardName: cardName,
                cardholderName: cardholderName,
                cardNumber: encryptedNumber,
                expiryDate: expiryDate,
                cvv: encryptedCVV,
                cardType: cardType || 'Visa',
                notes: notes || ''
            });

            await cardData.save();
            logger.log('info', `Credit card added for user: ${userId}`);

            return res.status(201).json({
                success: true,
                message: "Credit card added successfully!",
                data: {
                    _id: cardData._id,
                    cardName: cardData.cardName,
                    cardholderName: cardData.cardholderName,
                    cardType: cardData.cardType
                }
            });
        } catch (error) {
            logger.log('error', `Error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: "Error occurred while adding the card.",
                error: error.message
            });
        }
    },

    listCards: async (req, res) => {
        try {
            const userId = req.userId;
            // Use lean() for faster query performance
            const cardsData = await creditCardModel
                .find({ userId: userId })
                .select('cardName cardholderName cardType expiryDate notes createdAt')
                .lean()
                .exec();
            
            logger.log('info', `Credit cards retrieved for user: ${userId}`);

            res.status(200).json({
                success: true,
                message: "All credit cards found!",
                cardCount: cardsData.length,
                cardsData: cardsData
            });
        } catch (error) {
            logger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                message: "Error retrieving cards!",
                error: error.message
            });
        }
    },

    getCardDetails: async (req, res) => {
        try {
            const { cardId } = req.params;
            const userId = req.userId;

            const cardData = await creditCardModel.findOne({ _id: cardId, userId: userId });

            if (!cardData) {
                return res.status(404).json({
                    success: false,
                    message: "Card not found or unauthorized"
                });
            }

            // Decrypt sensitive data
            const decryptedNumber = encryption.decrypt(cardData.cardNumber);
            const decryptedCVV = encryption.decrypt(cardData.cvv);

            logger.log('info', `Card details viewed for user: ${userId}`);

            return res.status(200).json({
                success: true,
                message: "Card details retrieved.",
                cardNumber: decryptedNumber,
                cvv: decryptedCVV,
                expiryDate: cardData.expiryDate,
                cardName: cardData.cardName,
                cardholderName: cardData.cardholderName,
                cardType: cardData.cardType,
                notes: cardData.notes || ''
            });
        } catch (error) {
            logger.log('error', `Error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: "Error occurred while retrieving card details.",
                error: error.message
            });
        }
    },

    updateCard: async (req, res) => {
        try {
            const { cardId } = req.params;
            const { cardName, cardholderName, cardNumber, expiryDate, cvv, cardType, notes } = req.body;
            const userId = req.userId;

            const cardData = await creditCardModel.findOne({ _id: cardId, userId: userId });

            if (!cardData) {
                return res.status(404).json({
                    success: false,
                    message: "Card not found or unauthorized"
                });
            }

            // Update fields
            if (cardName) cardData.cardName = cardName;
            if (cardholderName) cardData.cardholderName = cardholderName;
            if (cardNumber) cardData.cardNumber = encryption.encrypt(cardNumber);
            if (expiryDate) cardData.expiryDate = expiryDate;
            if (cvv) cardData.cvv = encryption.encrypt(cvv);
            if (cardType) cardData.cardType = cardType;
            if (notes !== undefined) cardData.notes = notes;

            await cardData.save();
            logger.log('info', `Credit card updated for user: ${userId}`);

            res.status(200).json({
                success: true,
                message: "Card updated successfully!"
            });
        } catch (error) {
            logger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                message: "Error updating card!",
                error: error.message
            });
        }
    },

    deleteCard: async (req, res) => {
        try {
            const { cardId } = req.params;
            const userId = req.userId;

            const deletedCard = await creditCardModel.findOneAndDelete({
                _id: cardId,
                userId: userId
            });

            if (!deletedCard) {
                return res.status(404).json({
                    success: false,
                    message: "Card not found or unauthorized"
                });
            }

            logger.log('info', `Credit card deleted for user: ${userId}`);

            res.status(200).json({
                success: true,
                message: "Card deleted successfully!"
            });
        } catch (error) {
            logger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                message: "Error deleting card!",
                error: error.message
            });
        }
    }
};
