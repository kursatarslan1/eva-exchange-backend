const { client } =  require('../middleware/database');

class Apartment{
    constructor(apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status){
        this.apartment_id = apartment_id;
        this.apartment_name = apartment_name;
        this.apartment_country = apartment_country;
        this.apartment_city = apartment_city;
        this.apartment_state = apartment_state;
        this.apartment_full_address = apartment_full_address;
        this.apartment_due_amount = apartment_due_amount;
        this.apartment_license = apartment_license;
        this.record_status = record_status;
    }

    static async create(apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status){
        const queryText = 'INSERT INTO apartment (apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';
        const values = [apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status];

        try{
            await client.query(queryText, values);
            return apartment_id;
        } catch (error){
            console.error('Error executing create query: ', error);
            throw error;
        }
    }

    static async createRelation(manager_id, apartment_id){
        const queryText = 'INSERT INTO manager_apartment_relation (manager_id, apartment_id) VALUES($1,$2)';
        const values = [manager_id, apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0]
        }catch (error){
            console.error('Error creating relation query: ', error);
            throw error;
        }
    }
}

module.exports = { Apartment };