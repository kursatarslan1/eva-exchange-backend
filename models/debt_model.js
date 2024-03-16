const { client } =  require('../middleware/database');

class Debt{
    constructor(debt_id, resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type){
        this.debt_id = debt_id;
        this.resident_id = resident_id;
        this.apartment_id = apartment_id;
        this.block_id = block_id;
        this.unit_id = unit_id;
        this.amount = amount;
        this.created_at = created_at;
        this.payment_date = payment_date;
        this.last_payment_date = last_payment_date;
        this.description = description;
        this.status = status;
        this.debit_type = debit_type;
    }

    static async create(resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type){
        const queryText = 'INSERT INTO debt (resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
        const values = [resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, "Not pay", debit_type];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error creating debt: ', error);
        }
    }

    static async massDebitCreate(apartment_id, description, debit_type, last_payment_date, amount) {
        try {
            const residentQuery = 'SELECT resident_id, block_id, unit_id FROM residents WHERE apartment_id = $1 AND record_status = $2 AND status = $3';
            const residentResult = await client.query(residentQuery, [apartment_id, 'A', 'A']);
            
            for (const row of residentResult.rows) {
                const resident_id = row.resident_id;
                const created_at = new Date(); 
                const payment_date = null; 
                const block_id = row.block_id;
                const unit_id = row.unit_id;
                
                await this.create(resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, "Not pay", debit_type);
            }
            return true; 
        } catch (error) {
            console.error('Error creating mass debt: ', error);
            return false; 
        }
    }

    static async getDebtListByResidentId(resident_id){
        const queryText = 'SELECT * FROM debt WHERE resident_id = $1';
        const values = [resident_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.error('Error getting debt list: ', error);
        }
    }

    static async PayDebt(debt_id){
        try {
            const query = `
                UPDATE debt
                SET status = $1
                WHERE debt_id = $2
            `;
            const values = ["Payed", debt_id];
            await client.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating debt:', error);
        }
    }
}

module.exports = { Debt };