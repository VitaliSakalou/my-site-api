const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length > 350) {
                    throw new Error('Name length is not greater than 350');
                }
            },
        },
        name: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length > 50) {
                    throw new Error('Name length is not greater than 50');
                }
            },
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            },
        },
        dateCreated: {
            type: Date,
            default: new Date(),
        },
        approved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
