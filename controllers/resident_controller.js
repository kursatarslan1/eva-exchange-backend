const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Resident } = require('../models/resident_model');
const { Password } = require('../models/password_model');

async function register(req, res) {
    const { password, status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status } = req.body;

    try{
        // E-posta adresiyle kullanıcı araması yap
        const existingUser = await Resident.findByEmail(email);

        // Eğer kullanıcı varsa, hata mesajı gönder
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        
        const userResult = await Resident.create(status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status);

        const hashedPassword = await bcrypt.hash(password, 10); 
        await Password.create(userResult.resident_id, hashedPassword, 'H');

        res.json({message: 'User registered successfully.'});
    } catch (error){
        console.error('Error register: ' + error);
        res.status(500).json({ error: 'User not created' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const resident = await Resident.findByEmail(email);

        if (!resident) {
            return res.status(401).json({ error: 'Resident not found' });
        }

        const passwordRecord = await Password.findByUserId(resident.resident_id, 'H');

        if (!passwordRecord) {
            return res.status(401).json({ error: 'Password error' });
        }

        const passwordMatch = await bcrypt.compare(password, passwordRecord.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password error' });
        }

        const token = jwt.sign({ resident }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Login error: ' + error);
        res.status(500).json({ error: 'Login unsuccessful' });
    }
}

async function getInformationByEmail(req, res){
    const { email }  = req.body;

    try{
        const result = await Resident.findByEmail(email);
        return res.json({result});
    } catch (error){
        console.error('Login error: ' + error);
        res.status(500).json({ error: 'Cannot get manager info' });
    }
}

async function deactive(req, res) {
    const { resident_id } = req.body;
    try{
        const resident = await Resident.DeactiveAccount(resident_id);

        if(!manager) {
            return res.status(401).json({ error: 'Resident not found' });
        }

        const token = jwt.sign({ userId: resident.resident_id}, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Deactive error: ' + error);
        res.status(500).json({ error: 'Deactive account unsuccessful' });
    }
}

async function updateResident(req, res){
    const { resident_id, first_name, last_name, phone_number, photo, country, city, state } = req.body;

    try{
        const result = await Resident.UpdateResidentById(resident_id, first_name, last_name, phone_number, photo, country, city, state);
        if(!result){
            return res.status(401).json({error: 'Resident could not update.'});
        }
        res.json({result});
    } catch (error){
        console.error('Manager could not update.');
        res.status(500).json({ error: 'Manager could not update.' });
    }
}

module.exports = {
    login,
    register,
    deactive,
    getInformationByEmail,
    updateResident
};