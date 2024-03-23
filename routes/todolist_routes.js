const express = require('express');
const router = express.Router();
const todolistController = require('../controllers/todolist_controller');

router.use(express.json());

router.post('/create', todolistController.createTask);
router.get('/getUncompletedTaskByManagerId', todolistController.getTasksByManagerId);
router.get('/getCompletedTaskByManagerId', todolistController.getCompletedTaskByManagerId)
router.put('/updateTaskByTaskId', todolistController.completeTaskById);
router.delete('/deleteTaskById', todolistController.deleteTaskByTaskId);

module.exports = router;