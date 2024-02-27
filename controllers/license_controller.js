const { License } = require('../models/license_model');

async function create(req, res){
    const { valid_duration } = req.body;

    try{
        const licenseRes = await License.create(valid_duration);
        res.json({licenseRes});        
    } catch (error){
        console.error('Error creating license: ', error);
        throw error;
    }
}

async function getLicenseByApartmentId(req, res){
    const { apartment_id } = req.body;

    try{
        const getLicenseResult = await License.getLicenseKey(apartment_id);
        res.json({getLicenseResult});
    } catch (error){
        console.error('Error creating license: ', error);
        throw error;
    }
}

async function assignLicense(req,res){
    const { key_value, manager_id, apartment_id, valid_duration } = req.body;

    try{
        const result = await License.assign(key_value, manager_id, apartment_id, valid_duration);
        res.json({result});
    } catch (error){
        console.error('Error creating license: ', error);
        throw error;
    }
}

module.exports = { create, getLicenseByApartmentId, assignLicense }