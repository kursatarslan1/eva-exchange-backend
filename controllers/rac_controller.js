const { RequestsAndComplaints } = require('../models/rac_model');

async function createRac(req, res){
    const { apartment_id, content, publisher, publisher_id, created_at, priority, request_type, status } = req.body;

    try{
        const racRes = await RequestsAndComplaints.create(apartment_id, content, publisher, publisher_id, created_at, priority, request_type, status);
        if(!racRes){
            console.error('Request or complaints creation failed');
        }
        res.json({ success: 'true' });
    } catch(error) {
        console.error('Unexpected error: ', error);

    }
}

async function getRacList(req, res){
    const { apartment_id } = req.body;

    try{
        const racList = await RequestsAndComplaints.getRac(apartment_id);
        res.json({racList});
    } catch (error){
        console.error('Cannot get requests or complaints list: ', error);
    }
}

async function deleteRac(req, res){
    const { rac_id } = req.body;

    try{
        const deleteRes = await RequestsAndComplaints.deleteRac(rac_id);
        if(!deleteRes){
            console.error('Deleting requests or complaints unsuccessful: ', error);
        }
        res.json({ success: 'true' });
    } catch (error) {
        console.error('Cannot delete requests or complaints: ', error);
    }
}

module.exports = { createRac, getRacList, deleteRac };