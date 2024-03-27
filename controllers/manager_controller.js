const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Manager } = require('../models/manager_model');
const { Password } = require('../models/password_model');
const checkTokenValidity = require('../helpers/check_token_validity');
const { Resident } = require('../models/resident_model');

async function register(req, res) {
    const { first_name, last_name, password, email, phone_number, photo, address, manager_role, record_status } = req.body;

    try {
        // E-posta adresiyle kullanıcı araması yap
        const existingUser = await Manager.findByEmail(email);

        // Eğer kullanıcı varsa, hata mesajı gönder
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        const userResult = await Manager.create(first_name, last_name, email, phone_number, photo, address, manager_role, record_status);

        const hashedPassword = await bcrypt.hash(password, 10);
        await Password.create(userResult.manager_id, hashedPassword, 'E');

        const token = jwt.sign({ userResult }, process.env.JWT_SECRET);

        res.json({ userResult, token });
    } catch (error) {
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

        res.json({ token });
    } catch (error) {
        console.error('Login error: ' + error);
        res.status(500).json({ error: 'Login unsuccessful' });
    }
}

async function getInformationByToken(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const { choosen } = req.query;

    if (!token) {
        return res.status(401).json({ message: 'Token geçersiz' });
    }

    try {
        const tokenValid = await tokenIsValid(token);
        if (!tokenValid) {
            return res.status(401).json({ message: 'Token geçersiz' });
        }

        const decoded = jwt.decode(token);
        if (choosen == 1) {
            const email = decoded.manager.email;

            const manager = await Manager.findByEmail(email);

            if (!manager) {
                return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
            }

            res.json({
                id: manager.manager_id,
                email: manager.email,
                manager_role: manager.manager_role,
                first_name: manager.first_name,
                last_name: manager.last_name,
                photo: manager.photo,
                role: 'manager',
                phone_number: manager.phone_number
            });
        } else {
            const email = decoded.resident.email;
            const resident = await Resident.findByEmail(email);

            if(!resident){
                return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
            }

            res.json({
                id: resident.resident_id,
                email: resident.email,
                apartment_id: resident.apartment_id,
                tenant: resident.tenant,
                phone_number: resident.phone_number,
                first_name: resident.first_name,
                last_name: resident.last_name,
                photo: resident.photo,
                address: resident.address,
                role: 'resident'
            })
        }


    } catch (error) {
        return res.status(401).json({ message: 'Token geçersiz' });
    }
}

async function getInformationByEmail(req, res) {
    const { email } = req.query;

    try {
        const result = await Manager.findByEmail(email);
        return res.json({ result });
    } catch (error) {
        console.error('Login error: ' + error);
        res.status(500).json({ error: 'Cannot get manager info' });
    }
}

async function deactive(req, res) {
    const { manager_id } = req.query;
    try {
        const manager = await Manager.DeactiveAccount(manager_id);

        if (!manager) {
            return res.status(401).json({ error: 'Manager not found' });
        }

        res.json({ message: 'deactive user' });
    } catch (error) {
        console.error('Deactive error: ' + error);
        res.status(500).json({ error: 'Deactive account unsuccessful' });
    }
}

async function updateManager(req, res) {
    const { manager_id, first_name, last_name, phone_number, photo, address } = req.body;

    try {
        const result = await Manager.UpdateManagerById(manager_id, first_name, last_name, phone_number, photo, address);
        if (!result) {
            return res.status(401).json({ error: 'Manager could not update.' })
        }
        res.json({ result });
    } catch (error) {
        console.error('Manager could not update.');
        res.status(500).json({ error: 'Manager could not update.' });
    }
}

async function tokenIsValid(token) {

    try {
        const tokenValid = await checkTokenValidity(token);
        if (!tokenValid) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    login,
    register,
    deactive,
    getInformationByEmail,
    updateManager,
    tokenIsValid,
    getInformationByToken
};