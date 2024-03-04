const { client } =  require('../middleware/database');

class RequestsAndComplaints{
    constructor(rac_id, apartment_id, content, publisher, publisher_id, created_at, priority, request_type, status){
        this.rac_id = rac_id;
        this.apartment_id = apartment_id;
        this.content = content;
        this.publisher = publisher;
        this.publisher_id = publisher_id;
        this.created_at = created_at;
        this.priority = priority;
        this.request_type = request_type;
        this.status = status;
    }

    static async create(apartment_id, content, publisher, publisher_id, created_at, priority, request_type, status){
        const queryText = 'INSERT INTO requests_and_complaints (apartment_id, content, publisher, publisher_id, created_at, priority, request_type, status) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
        const values = [apartment_id, content, publisher, publisher_id, created_at, priority, request_type, status];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error creating request or complaints: ', error);
        }
    }

    static async getRac(apartment_id){
        const queryText = 'SELECT * FROM requests_and_complaints WHERE apartment_id = $1 AND status IS DISTINCT FROM $2;';
        const values = [apartment_id, 3];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.error('Error getting request or complaints: ', error);
        }
    }

    static async deleteRac(rac_id){
        const queryText = 'DELETE FROM requests_and_complaints WHERE rac_id = $1';
        const values = [rac_id];

        try{
            await client.query(queryText, values);
            return true;
        }catch (error){
            console.error('Error deleting request or complaints: ', error);
        }
    }

    static async updateRac(rac_id, status){
        const queryText = 'UPDATE requests_and_complaints SET status = $1 WHERE rac_id = $2';
        const values = [status, rac_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Error updating rac: ', error);
        }
    }
}

module.exports = { RequestsAndComplaints }