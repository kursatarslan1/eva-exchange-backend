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

    static async create(dependent_resident_id, apartment_id, first_name, last_name, phone_number, email, record_status){
        const queryText = 'INSERT INTO cohabitants (dependent_resident_id, apartment_id, first_name, last_name, phone_number, email, record_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cohabitants_id';
        const values = [dependent_resident_id, apartment_id, first_name, last_name, phone_number, email, record_status];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error executing create query: ', error);
        }
    }

    static async findByResidentId(dependent_resident_id){
        const queryText = 'SELECT * FROM cohabitants WHERE dependent_resident_id = $1 AND record_status = $2';
        const values = [dependent_resident_id, 'A'];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.error('Error getting cohabitants: ', error);
        }
    }

    static async findByUnitId(unit_id) {
        const queryText = 'SELECT resident_id FROM residents WHERE unit_id = $1 AND record_status = $2';
        const values = [unit_id, 'A'];

        try{
            const result = await client.query(queryText, values);
            if(result) {
                const cohabitantsQuery = 'SELECT * FROM cohabitants WHERE dependent_resident_id = $1 AND record_status = $2';
                const values = [result.rows[0].resident_id, 'A'];
                
                const cohabitants = await client.query(cohabitantsQuery, values);
                return cohabitants.rows;
            }
        } catch (error) {
            console.log('Konut sakini bilgileri alınırken bir hata ile karşılaşıldı.');
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
        }
    }

    static async updateCohabitants(cohabitants_id, first_name, last_name, phone_number, email){
        try{
            const updateFields = [
                "first_name",
                "last_name",
                "phone_number",
                "email"
            ];

            const updateValues = [
                first_name, last_name, phone_number, email
            ];

            const queryText = `
                UPDATE cohabitants 
                SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")}
                WHERE cohabitants_id = $${updateFields.length + 1} RETURNING *
            `;

            const values = [...updateValues, cohabitants_id];

            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Could not update cohabitant informations.');
        }
    }
}

module.exports = { Cohabitants };