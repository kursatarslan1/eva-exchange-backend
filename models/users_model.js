const { client } = require("../middleware/database");

class User{
    constructor(user_id, username){
        this.user_id = user_id;
        this.username = username;
    }

    static async GetUserById(user_id){
        const queryText = 'SELECT * FROM users WHERE user_id = $1;';
        const values = [user_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error){
            console.log('Error getting user by id: ', error);
        }
    }

    static async GetBalanceByUserId(user_id){
        const queryText = 'SELECT cash FROM users WHERE user_id = $1;';

        try{
            const result = await client.query(queryText, [user_id]);
            return result.rows[0].cash;
        } catch (error){
            console.log('error getting balance by user id: ', error);
        }
    }
}

module.exports = { User };