const { client } = require('../middleware/database');

class Password {
    constructor(user_id, password_hash, is_manager){
        this.user_id = user_id;
        this.password_hash = password_hash;
        this.is_manager = is_manager;
    }

    static async create(user_id, password_hash, is_manager){
        const queryText = 'INSERT INTO passwords(user_id, password_hash, is_manager) VALUES($1, $2, $3) RETURNING password_id';
        const values = [user_id, password_hash, is_manager];

        try {
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error executing create query:', error);
        }
    }

    static async findByUserId(userId, is_manager) {
        const queryText = 'SELECT * FROM passwords WHERE user_id = $1 AND is_manager = $2';
        const values = [userId, is_manager];

        try {
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error executing findByUserId query:', error);
        }
    }
}

module.exports = { Password };