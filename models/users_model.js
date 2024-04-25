const { client } = require("../middleware/database");

class User{
    constructor(user_id, first_name, last_name, email, phone, password_hash, address, created_at){
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.password_hash = password_hash;
        this.address = address;
        this.created_at = created_at;
    }

    static async login(email, password_hash){
        const queryText = 'SELECT * FROM users WHERE email = $1 AND password_hash = $2;';
        const values = [email, password_hash];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error){
            console.log('Error login: ', error);
        }
    }
}

module.exports = { User };