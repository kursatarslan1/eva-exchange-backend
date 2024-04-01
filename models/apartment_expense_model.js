const { client } = require('../middleware/database');

class ApartmentExpense{
    constructor(expense_id, apartment_id, expense_name, expense_amount, expense_date, expense_period, is_one_time_expense){
        this.expense_id = expense_id;
        this.apartment_id = apartment_id;
        this.expense_name = expense_name;
        this.expense_amount = expense_amount;
        this.expense_date = expense_date;
        this.expense_period = expense_period;
        this.is_one_time_expense = is_one_time_expense;
    }

    static async createFixedExpense(apartment_id, expense_name, expense_amount, expense_period, expense_content){
        const queryText = 'INSERT INTO apartment_expense (apartment_id, expense_name, expense_amount, expense_date, expense_period, is_one_time_expense, expense_content) VALUES($1,$2,$3,$4,$5,$6, $7)';
        const values = [apartment_id, expense_name, expense_amount, new Date(), expense_period, false, expense_content];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Error creating fixed expense: ', error);
        }
    }

    static async getFixedExpenses(apartment_id){
        const queryText = 'SELECT * FROM apartment_expense WHERE apartment_id = $1';
        const values = [apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting fixed expense: ', error);
        }
    }

    static async deleteFixedExpense(expense_id){
        const queryText = 'DELETE FROM apartment_expense WHERE expense_id = $1';
        const values = [expense_id];

        try{
            await client.query(queryText, values);
            return true; 
        }catch(error){
            console.log(error);
        }

    }

    static async updateFixedExpense(expense_id, expense_name, expense_amount, expense_period, expense_content){
        const query = {
            text: 'UPDATE apartment_expense SET expense_name = $2, expense_amount = $3, expense_period = $4, expense_content = $5 WHERE expense_id = $1',
            values: [expense_id, expense_name, expense_amount, expense_period, expense_content]
        };
    
        try {
            await client.query(query);
            console.log("Expense updated successfully");
            return true;
        } catch (err) {
            console.error("Error updating expense:", err);
            throw err;
        }
    }
}

module.exports = { ApartmentExpense };