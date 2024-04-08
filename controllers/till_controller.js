const { Till } = require('../models/till_model');

async function getAllTillInfo(req, res){
    const { apartment_id } = req.query;

    try {
        const result = await Till.getAllTillInfo(apartment_id);
        if(!result){
            res.json({ success: false });
            console.log('Error getting till info: ', error);
        }
        res.json({ result });
    } catch (error){
        res.json({ success: false })
        console.log('Error getting till info: ', error);
    }
}

async function getBlockTillInfoByBlockId(req, res){
    const { block_id } = req.query;

    try {
        const result = await Till.getBlockTillInfoByBlockId(block_id);

        if(!result){
            res.json({ success: false });
            console.log('error getting till of block info: ', error);
        }
        res.json({ result });
    } catch (error) {
        res.json({ success: false })
        console.log('error getting till of block info: ', error);
    }
}

async function getAccounting(req, res){
    const { date, apartment_id } = req.query;

    try{
        const result = await Till.computeAccount(date, apartment_id);
        if(!result){
            res.json({  success: false });
        }
        res.json({ result });
    } catch (error){
        res.json({ success: false })
        console.log('error getting accounting: ', error);
    }
}

module.exports = {
    getAllTillInfo,
    getBlockTillInfoByBlockId,
    getAccounting
}