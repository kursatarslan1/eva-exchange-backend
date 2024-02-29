const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Manager } = require('../models/manager_model');
const { Password } = require('../models/password_model');

async function register(req, res) {
    const { first_name, last_name, password, email, phone_number, photo, address, manager_role, record_status } = req.body;

    try{
        // E-posta adresiyle kullanıcı araması yap
        const existingUser = await Manager.findByEmail(email);

        // Eğer kullanıcı varsa, hata mesajı gönder
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        const userResult = await Manager.create(first_name, last_name, email, phone_number, photo, address, manager_role, record_status);

        const hashedPassword = await bcrypt.hash(password, 10); 
        await Password.create(userResult.manager_id, hashedPassword, 'E');

        res.json({message: 'User registered successfully.'});
    } catch (error){
        console.error('Error register: ' + error);
        res.status(500).json({ error: 'User not created' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const manager = await Manager.findByEmail(email);

        if (!manager) {
            return res.status(401).json({ error: 'Manager not found' });
        }

        const passwordRecord = await Password.findByUserId(manager.manager_id, 'E');

        if (!passwordRecord) {
            return res.status(401).json({ error: 'Password error' });
        }

        const passwordMatch = await bcrypt.compare(password, passwordRecord.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password error' });
        }

        const token = jwt.sign({ manager }, process.env.JWT_SECRET);

        res.json({ manager, token });
    } catch (error) {
        console.error('Login error: ' + error);
        res.status(500).json({ error: 'Login unsuccessful' });
    }
}

async function deactive(req, res) {
    const { manager_id } = req.body;
    try{
        const manager = await Manager.DeactiveAccount(manager_id);

        if(!manager) {
            return res.status(401).json({ error: 'Manager not found' });
        }

        res.json({ message: 'deactive user' });
    } catch (error) {
        console.error('Deactive error: ' + error);
        res.status(500).json({ error: 'Deactive account unsuccessful' });
    }
}

module.exports = {
    login,
    register,
    deactive
};