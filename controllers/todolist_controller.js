const { ToDoList } = require('../models/todolist_model');

async function createTask(req, res) {
    const { apartment_id, manager_id, content } = req.body;

    try {
        const createResponse = await ToDoList.create(apartment_id, manager_id, content);
        if (!createResponse) {
            res.json({ success: false });
        }
        res.json({ success: true });
    } catch (error) {
        console.log('unexpected error creating task: ', error);
        res.json({ success: false });
    }
}

async function getTasksByManagerId(req, res) {
    const { manager_id } = req.query;

    try {
        const result = await ToDoList.getToDoListByManagerId(manager_id);
        if (!result) {
            res.json({ success: false })
        }
        res.json({ result });
    } catch (error) {
        res.json({ success: false });
    }
}

async function completeTaskById(req, res) {
    const { task_id } = req.body;

    try {
        const completeResult = await ToDoList.completeTaskById(task_id);
        if (!completeResult) {
            res.json({ success: false });
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
}

async function getCompletedTaskByManagerId(req, res) {
    const { manager_id } = req.query;

    try {
        const listResult = await ToDoList.getCompletedTaskByManagerId(manager_id);
        if (!listResult) {
            res.json({ success: false });
        }
        res.json({ listResult });
    } catch (error) {
        res.json({ success: false });
    }
}

async function deleteTaskByTaskId(req, res){
    const { task_id } = req.body;

    try {
        const deleteResponse = await ToDoList.removeTaskByTaskId(task_id);
        if(!deleteResponse){
            res.json({ success: false });
        }
        res.json({ success: true });
    } catch (error){
        res.json({ success: false });
    }
}

module.exports = {
    createTask,
    getTasksByManagerId,
    completeTaskById,
    getCompletedTaskByManagerId,
    deleteTaskByTaskId
}