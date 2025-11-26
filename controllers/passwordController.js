const copyPaste = require('copy-paste');
const generator = require('generate-password');
const encryption = require('../utils/encryption');

const passwordModel = require('../models/passwordModel')
const passwordLogger = require('../utils/passwordLogger/passwordLogger')

module.exports = {
    addPassword: async (req, res) => {
        try {
            const { passwordName, username, password } = req.body;
            const userId = req.userId;

            if (!passwordName || !password) {
                return res.status(400).send({
                    success: false,
                    message: "Password name and password are required."
                });
            }

            const isPasswordNameExist = await passwordModel.findOne({
                passwordName: passwordName,
                userId: userId
            });
            if (isPasswordNameExist) {
                passwordLogger.log('error', 'Password name already exists for this user.')
                return res.status(400).send({
                    success: false,
                    message: "Password name already exists in your vault."
                });
            }
            const passwordData = new passwordModel({
                userId: userId,
                passwordName: passwordName,
                username: username || '',
                password: '',
                passwordHistory: []
            });
            const encryptedPassword = encryption.encrypt(password);
            passwordData.password = encryptedPassword;
            passwordData.passwordHistory.push(encryptedPassword);
            await passwordData.save();
            passwordLogger.log('info', `Password added for user: ${userId}`)
            return res.status(201).send({
                success: true,
                message: "Password added successfully!",
                data: {
                    _id: passwordData._id,
                    passwordName: passwordData.passwordName,
                    username: passwordData.username
                }
            });
        } catch (error) {
            passwordLogger.log('error', `Error: ${error.message}`)
            return res.status(500).send({
                success: false,
                message: "Error occurred while adding the password.",
                error: error.message
            });
        }
    },

    listPasswords: async (req, res) => {
        try {
            const userId = req.userId;
            // Use lean() for faster query (returns plain JS objects instead of Mongoose documents)
            const passwordsData = await passwordModel
                .find({ userId: userId })
                .select('passwordName username password')
                .lean()
                .exec();
            
            passwordLogger.log('info', `Passwords retrieved for user: ${userId}`)
            res.status(200).send({
                success: true,
                message: "All passwords data found!",
                passwordCount: passwordsData.length,
                passwordsData: passwordsData
            })
        } catch (error) {
            passwordLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message
            })
        }
    },

    editPassword: async (req, res) => {
        try {
            const { passwordId } = req.params
            const { oldPassword, newPassword } = req.body
            const userId = req.userId;
            
            const passwordData = await passwordModel.findOne({ _id: passwordId, userId: userId })
            
            if (!passwordData) {
                return res.status(404).send({
                    success: false,
                    message: "Password not found or unauthorized"
                })
            }

            const decryptedPassword = encryption.decrypt(passwordData.password)
            const isCorrectPassword = oldPassword === decryptedPassword
            
            if (isCorrectPassword) {
                // Check if new password was used before
                const hasUsedPassword = passwordData.passwordHistory.some(histPass => {
                    try {
                        return encryption.decrypt(histPass) === newPassword
                    } catch (e) {
                        return false
                    }
                })
                if (hasUsedPassword) {
                    passwordLogger.log('error', "You can't use used passwords")
                    return res.status(401).send({
                        success: false,
                        message: "You can't use used passwords"
                    })
                }
                const encryptedPassword = encryption.encrypt(newPassword)
                passwordData.password = encryptedPassword
                passwordData.passwordHistory.push(encryptedPassword)
                await passwordData.save()
                passwordLogger.log('info', `Password updated for user: ${userId}`)
                res.status(200).send({
                    success: true,
                    message: "Password is successfully updated!",
                })
            } else {
                passwordLogger.log('info', 'Old password is incorrect!')
                res.status(401).send({
                    success: false,
                    message: "Old password is incorrect!"
                })
            }
        } catch (error) {
            passwordLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message
            })
        }
    },

    removePassword: async (req, res) => {
        try {
            const { passwordId } = req.params
            const userId = req.userId;
            
            const removedPasswordData = await passwordModel.findOneAndDelete({ 
                _id: passwordId, 
                userId: userId 
            });
            
            if (!removedPasswordData) {
                return res.status(404).send({
                    success: false,
                    message: "Password not found or unauthorized"
                })
            }
            
            passwordLogger.log('info', `Password removed for user: ${userId}`)
            res.status(200).send({
                success: true,
                message: "Password has been removed successfully!"
            })
        } catch (error) {
            passwordLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message
            })
        }
    },

    passwordDetails: async (req, res) => {
        try {
            const { passwordId } = req.params;
            const userId = req.userId;
            
            const passwordData = await passwordModel.findOne({ _id: passwordId, userId: userId });
            
            if (!passwordData) {
                return res.status(404).send({
                    success: false,
                    message: "Password not found or unauthorized"
                });
            }
            
            const encryptedPassword = passwordData.password;
            const actualPassword = encryption.decrypt(encryptedPassword);
            copyPaste.copy(actualPassword, () => {
                passwordLogger.log('info', `Password viewed for user: ${userId}`)
                return res.status(200).send({
                    success: true,
                    message: "Password is copied to clipboard.",
                    password: actualPassword
                });
            });
        } catch (error) {
            passwordLogger.log('error', `Error: ${error.message}`)
            return res.status(500).send({
                success: false,
                message: "Error occurred while retrieving the password.",
                error: error.message
            });
        }
    },

    passwordGenerator: async (req, res) => {
        try {
            const { passwordLength } = req.body
            const generatedPassword = await generator.generate({
                length: passwordLength,
                numbers: true,
                symbols: true,
                uppercase: true,
                lowercase: true,
                excludeSimilarCharacters: false,
            });
            passwordLogger.log('info', 'Password generated successfully')
            res.status(200).send({
                success: true,
                message: "Password generated successfully",
                generatedPassword: generatedPassword
            })
        } catch (error) {
            passwordLogger, log('error', `Error: ${error.message}`)
            return res.status(500).send({
                success: false,
                message: "Error occurred while retrieving the password.",
                error: error.message
            });
        }
    }
}
