const { Messages } = require('../models/messages_model');

async function sendMessage(req, res) {
    const { senderId, recipientId, content } = req.body;

    try{
        const sendMessageResult = await Messages.sendMessage(senderId, recipientId, content);

        if(!sendMessageResult){
            return res.status(400).json({ error: 'Cannot create cohabitants: ', error});
        }

        res.json({success: 'true'});
    } catch (error) {
        console.error('Unexpected error: ', error);
        res.status(500).json({error: 'Unexpected error.'});
    }
}

async function getAllMessages(req, res){

    try{
        const getAllMessages = await Messages.getAllMessages(req);
        res.json({getAllMessages});
    } catch (error){
        console.error('Unexpected error: ', error);
        res.status(500).json({error: 'Unexpected error.'});
    }
}

async function getMessagesByUserId(req, res){
    const {user_id} = req.body;

    try{
        const message = await Messages.getMessagesByUserId(user_id);
        res.json({message});
    } catch (error){
        console.error('Unexpected error: ', error);
        res.status(500).json({error: 'Unexpected error.'});
    }
}

module.exports = { sendMessage, getAllMessages, getMessagesByUserId };