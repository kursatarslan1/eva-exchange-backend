const { Account } = require('../models/account_model');

async function createAccount(req, res){
    const { apartment_id, account_name, account_owner_name, iban_number, bank_name, account_type } = req.body;

    try{
        const result = await Account.create(apartment_id, account_name, account_owner_name, iban_number, bank_name, account_type);
        if(!result){
            res.json({ success: false });
            console.log('Error creating account info: ', error);
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
        console.log('Error creating account info: ', error);
    }
}

async function getAccounts(req, res){
    const { apartment_id } = req.query;

    try{
        const result = await Account.getAccounts(apartment_id);
        if(!result){
            res.json({ success: false });
            console.log('Error getting account info: ', error);
        }
        res.json({ result });
    }  catch (error) {
        res.json({ success: false });
        console.log('Error getting account info: ', error);
    }
}

async function deleteAccount(req, res){
    const { account_id } = req.query;

    try{
        const result = await Account.deleteAccount(account_id);
        if(!result){
            res.json({ success: false });
            console.log('Error deleting account info: ', error);
        }
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false });
        console.log('Error delete account info: ', error);
    }
}

async function updateAccount(req, res){
    const {account_id, account_name, account_owner_name, iban_number, bank_name, account_type} = req.body;

    try{
        const result = Account.updateAccount(account_id, account_name, account_owner_name, iban_number, bank_name, account_type);
        if(!result){
            res.json({ success: false });
            console.log('Error updating account info.');
        }
        res.json({ success: true })
    } catch (error) {
        console.log('Error updating account info: ', error);
        res.json({ success: false })
    }
}

module.exports = {
    createAccount,
    getAccounts,
    deleteAccount,
    updateAccount
}