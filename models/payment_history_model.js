const { client } =  require('../middleware/database');

class PaymentHistory{
    constructor(payment_id, resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type){
        this.payment_id = payment_id;
        this.resident_id = resident_id;
        this.apartment_id = apartment_id;
        this.amount = amount;
        this.payment_date = payment_date;
        this.payment_method = payment_method;
        this.description = description;
        this.payment_type = payment_type;
    }

    static async create(resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type){
        const queryText = 'INSERT INTO payment_history (resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type) VALUES($1, $2, $3, $4, $5, $6, $7)';
        const values = [resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error creating debt: ', error);
            throw error;
        }
    }

    static async getPaymentHistoryById(resident_id){
        const queryText = 'SELECT * FROM payment_history WHERE resident_id = $1';
        const values = [resident_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.error('Error getting payment history: ', error);
            throw error;
        }
    }
}

module.exports = { PaymentHistory };