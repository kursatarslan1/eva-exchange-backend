const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');

// GET user by ID
router.get('/getUserById', userController.getUserById);

module.exports = router;
