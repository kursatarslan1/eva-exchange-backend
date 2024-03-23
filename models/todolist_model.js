const {client} = require('../middleware/database');

class ToDoList{
    constructor(task_id, apartment_id, manager_id, content, status){
        this.task_id = task_id;
        this.apartment_id = apartment_id;
        this.manager_id = manager_id;
        this.content = content;
        this.status = status;
    }

    static async create(apartment_id, manager_id, content){
        const queryText = 'INSERT INTO tasks (apartment_id, manager_id, content, status) VALUES($1,$2,$3, $4);';
        const values = [apartment_id, manager_id, content, 'X'];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Error creating to do: ', error);
            return false;
        }
    }

    static async getToDoListByManagerId(manager_id){
        const queryText = 'SELECT * FROM tasks WHERE manager_id = $1 AND status = $2';
        const values = [manager_id, 'X'];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting to do list: ', error);
        }
    }

    static async completeTaskById(task_id){
        const queryText = 'UPDATE tasks SET status = $1 WHERE task_id = $2';
        const values = ['D', task_id];

        try {
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Error updating task: ', error);
        }
    }

    static async getCompletedTaskByManagerId(manager_id){
        const queryText = 'SELECT * FROM tasks WHERE manager_id = $1 AND status = $2';
        const values = [manager_id, 'D'];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting to do list: ', error);
        }
    }

    static async removeTaskByTaskId(task_id){
        const queryText = 'DELETE FROM tasks WHERE task_id = $1';
        const values = [task_id];

        try {
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Error deleting task: ', error);
        }
    }
}

module.exports = { ToDoList }