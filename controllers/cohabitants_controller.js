const { Cohabitants } = require('../models/cohabitants_model');

async function createCohabitants(req, res){
    const {dependent_resident_id, first_name, last_name, phone_number, email, record_status} = req.body;

    try{
        const cohabitantResult = await Cohabitants.create(dependent_resident_id, first_name, last_name, phone_number, email, 'A');

        if(!cohabitantResult){
            return res.status(400).json({ error: 'Cannot create cohabitants: ', error});
        }

        res.json({success: 'true'});
    } catch (error){
        console.error('Unexpected error: ', error);
        res.status(500).json({error: 'Unexpected error.'});
    }
}

async function findCohabitants(req, res){
    const { dependent_resident_id } = req.body;

    try{
        const cohabitants = await Cohabitants.findByResidentId(dependent_resident_id);
        res.json({cohabitants});
    } catch (error){
        console.error('Unexpected error: ', error);
        res.status(500).json({error: 'Unexpected error.'});
    }
}

async function deleteCohabitants(req,res){
    const { cohabitant_id } = req.body;

    try{
        const deleteResult = await Cohabitants.deleteCohabitants(cohabitant_id);

        if(!deleteResult){
            res.status(400).json({error: 'Cannot delete cohabitants: '});
        }

        res.json({success: 'true'});
    } catch (error){
        console.error('Unexpected error: ', error);
        res.status(500).json({error: 'Unexpected error.'});
    }
}

module.exports = { createCohabitants, findCohabitants, deleteCohabitants }