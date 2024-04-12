const { Unit } = require('../models/unit_model');

async function createNote(req, res){
    const { unit_id, note } = req.body;

    try {
        const result = await Unit.createNote(unit_id, note);
        if(result){
            res.json({success: 'true'});
        }
    } catch (error) {
        console.log('Not bilgileri güncellenirken bir hata ile karşılaşıldı: ', error);
        res.status(500).json({ success: 'false' });
    }
}

async function getUnitAddressByUnitId(req, res){
    const { unit_id } = req.query;

    try{
        const result = await Unit.findUnitAddressByUnitId(unit_id);
        if(!result){
            res.status(500).json({ success: false });
        }
        res.json({ result });
    } catch (error){
        console.log('error getting unit adress: ', error);
        res.status(401).json({ success: false });
    }
}

module.exports = { createNote, getUnitAddressByUnitId };