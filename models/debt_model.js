const { client } = require('../middleware/database');

class Debt {
    constructor(debt_id, resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type) {
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

    static async create(resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type) {
        const queryText = 'INSERT INTO debt (resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
        const values = [resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, "Not pay", debit_type];

        try {
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.error('Error creating debt: ', error);
        }
    }

    static async massDebitCreate(apartment_id, description, debit_type, last_payment_date, amount, include_empty_units) {
        try {
            if (include_empty_units) {
                const queryText = 'SELECT block_id, unit_id FROM units WHERE apartment_id = $1';
                const queryResult = await client.query(queryText, [apartment_id]);

                for (const row of queryResult.rows) {
                    const block_id = row.block_id;
                    const unit_id = row.unit_id;
                    const created_at = new Date();
                    const payment_date = null;

                    await this.create(null, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, "Not pay", debit_type);
                }
            } else {
                const queryText = 'SELECT block_id, unit_id FROM units WHERE apartment_id = $1 AND is_using = $2';
                const values = [apartment_id, 'E'];

                const queryResult = await client.query(queryText, values);

                for (const row of queryResult.rows) {
                    const block_id = row.block_id;
                    const unit_id = row.unit_id;
                    const created_at = new Date();
                    const payment_date = null;

                    await this.create(null, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, "Not pay", debit_type);
                }
            }
            return true;
        } catch (error) {
            console.error('Error creating mass debt: ', error);
            return false;
        }
    }

    static async getDebtListByResidentId(resident_id) {
        const queryText = 'SELECT * FROM debt WHERE resident_id = $1';
        const values = [resident_id];

        try {
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.error('Error getting debt list: ', error);
        }
    }

    static async PayDebt(debt_id) {
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

    static async TotalExpectedRevenue(month, year, apartment_id) {
        try {
            const queryText = `SELECT sum(amount) as total_expected_revenue
            FROM debt
            WHERE EXTRACT(MONTH FROM created_at) = $1
              AND EXTRACT(YEAR FROM created_at) = $2
              AND apartment_id = $3`;
            const values = [month, year, apartment_id];

            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting total expected revenue: ', error);
        }
    }

    static async TotalRevenue(month, year, apartment_id) {
        try {
            const queryText = `SELECT sum(amount) as total_expected_revenue
            FROM debt
            WHERE EXTRACT(MONTH FROM created_at) = $1
              AND EXTRACT(YEAR FROM created_at) = $2
              AND apartment_id = $3
              AND status = $4`;
            const values = [month, year, apartment_id, 'Payed'];

            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting total expected revenue: ', error);
        }
    }

    static async getDebtUserList(apartment_id) {
        try {
            const queryText = `SELECT *
                FROM residents
                INNER JOIN debt
                ON residents.block_id = debt.block_id AND residents.unit_id = debt.unit_id
                WHERE residents.status = $1 and residents.record_status = $2 and residents.apartment_id = $3`;
            const values = ['A', 'A', apartment_id];

            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting total expected revenue: ', error);
        }
    }
}

module.exports = { Debt };