const { client } =  require('../middleware/database');

class Cohabitants{
    constructor(cohabitants_id, dependent_resident_id, first_name, last_name, phone_number, email, record_status){
        this.cohabitants_id = cohabitants_id;
        this.dependent_resident_id = dependent_resident_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.email = email;
        this.record_status = record_status;
    }

    static async create(dependent_resident_id, first_name, last_name, phone_number, email, record_status){
        const queryText = 'INSERT INTO cohabitants (dependent_resident_id, first_name, last_name, phone_number, email, record_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING cohabitants_id';
        const values = [dependent_resident_id, first_name, last_name, phone_number, email, record_status];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error executing create query: ', error);
            throw error;
        }
    }

    static async findByResidentId(dependent_resident_id){
        const queryText = 'SELECT * FROM cohabitants WHERE dependent_resident_id = $1';
        const values = [dependent_resident_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.error('Error getting cohabitants: ', error);
            throw error;
        }
    }

    static async deleteCohabitants(cohabitants_id){
        const queryText = 'UPDATE cohabitants SET record_status = $1 WHERE cohabitants_id = $2';
        const values = ['P', cohabitants_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.error('Error executing delete query: ', error);
            throw error;
        }
    }
}

module.exports = { Cohabitants };