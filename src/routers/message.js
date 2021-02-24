/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
const express = require('express');
const Message = require('../models/message');
const auth = require('../middleware/auth');
const { sendNotoficationEmail } = require('../emails/account');

const router = new express.Router();

router.post('/message', async (req, res) => {
    const message = new Message(req.body);
    console.log(message);
    try {
        await message.save();
        sendNotoficationEmail(message.email, message.name);
        res.status(201).send(message);
    } catch (e) {
        res.status(400).send(e);
    }
});

// GET /messages?approved=true
// GET /messages?limit=10&skip=10
// GET /messages?sortBy=createdAt:desc
router.get('/messages', async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.approved) {
        match.approved = req.query.approved === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        const messages = await Message.find(match, null, {
            skip: parseInt(req.query.skip),
            limit: parseInt(req.query.limit),
            sort,
        });
        res.send(messages);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/message/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Message.findById(id);
        if (!message) {
            res.status(404).send();
        } else {
            res.send(message);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/message/:id', auth, async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            res.status(404).send();
        } else {
            res.send(message);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/message/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'approved'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const message = await Message.findById(req.params.id);
        updates.forEach((update) => (message[update] = req.body[update]));
        await message.save();

        if (!message) {
            res.status(404).send();
        } else {
            res.send(message);
        }
    } catch (error) {
        res.status(400).send();
    }
});

module.exports = router;
