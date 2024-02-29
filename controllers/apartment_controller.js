const { Apartment } = require('../models/apartment_model');
const { Block } = require('../models/block_model');
const Unit = require('../models/unit_model');

async function createApartment(req, res) {
    const { manager_id, apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status, blocks } = req.body;

    let apartmentResult, blockResult;

    try {
        // Apartman oluşturma işlemi
        apartmentResult = await Apartment.create(apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status);

        if (!apartmentResult) {
            throw new Error('Apartment creation failed');
        }
        // Yönetici ve apartman arasındaki ilişkiyi oluşturma işlemi
        await Apartment.createRelation(manager_id, apartment_id);

        // Blokları oluşturma işlemi
        blockResult = await Block.create(blocks);

        if (!blockResult) {
            // Blok oluşturma işlemi başarısız oldu, önceki apartman oluşturma işlemini geri al
            //await Apartment.delete(apartment_id); // Örnek bir delete fonksiyonu kullanılarak apartmanın geri alınması işlemi yapılmalıdır
            throw new Error('Block creation failed');
        }

        // Bloklar başarıyla oluşturulduysa, birimleri de eklenir
        await Unit.createUnitsForBlocks(blocks);

        // JSON Web Token oluşturma
        // Başarıyla tamamlanan işlemi yanıtla
        res.json({ message: 'Sucess create apartment and blocks' });
    } catch (error) {
        console.error('create error: ' + error);
        res.status(500).json({ error: 'create apartment unsuccessful' });
    }
}

async function getApartment(req, res){
    const manager_id  = req.query.manager_id;

    try{
        const apartments = await Apartment.getRelationApartment(manager_id);
        res.json({apartments});
    } catch (error) {
        console.error('get error: ' + error);
        res.status(500).json({ error: 'get apartment unsuccessful' });
    }
}

async function getApartmentDetail(req, res){
    const { manager_id, apartment_id } = req.body;
    
    try{
        const apartmentDetail = await Apartment.getApartmentDetail(manager_id, apartment_id);
        res.json({apartmentDetail});
    } catch (error) {
        console.error('get error: ' + error);
        res.status(500).json({ error: 'get apartment unsuccessful' });
    }
}

module.exports = { createApartment, getApartment, getApartmentDetail };
