const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');

router.use(express.json());

router.post('/login', userController.login);


module.exports = router;