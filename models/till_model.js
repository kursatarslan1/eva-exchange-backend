const { client } =  require('../middleware/database');

class Till{
    constructor(till_id, till_name, apartment_id, block_id, total_expected_revenue, total_expected_expense, current_revenue, current_expense){
        this.till_id = till_id;
        this.till_name = till_name;
        this.apartment_id = apartment_id;
        this.block_id = block_id;
        this.total_expected_revenue = total_expected_revenue;
        this.total_expected_expense = total_expected_expense;
        this.current_expense = current_expense;
        this.current_revenue = current_revenue;
    }

    static async getAllTillInfo(apartment_id){
        const queryText = 'SELECT * FROM till_info WHERE apartment_id = $1';
        const values =[apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting till info: ', error);
        }
    }

    static async getBlockTillInfoByBlockId(block_id){
        const queryText = 'SELECT * FROM till_info WHERE block_id = $1';
        const values = [block_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Error getting till of block info: ', error);
        }
    }

    static async getApartmentExpensesForAccounting(apartment_id){
        const queryText = `
            WITH RECURSIVE recursive_expenses AS (
                SELECT 
                    expense_id, 
                    apartment_id, 
                    expense_name, 
                    expense_amount, 
                    expense_date, 
                    expense_period, 
                    is_one_time_expense,
                    expense_content,
                    CAST(expense_date AS TIMESTAMP) AS next_due_date
                FROM 
                    public.apartment_expense
                WHERE 
                    is_one_time_expense = false
                    AND apartment_id = $1 

                UNION ALL

                SELECT 
                    ae.expense_id, 
                    ae.apartment_id, 
                    ae.expense_name, 
                    ae.expense_amount, 
                    ae.expense_date, 
                    ae.expense_period, 
                    ae.is_one_time_expense,
                    ae.expense_content,
                    CASE 
                        WHEN ae.expense_period = 0 THEN NULL
                        ELSE 
                            CASE 
                                WHEN ae.expense_period = 1 THEN re.next_due_date + INTERVAL '1 month'
                                ELSE re.next_due_date + ae.expense_period * INTERVAL '1 month'
                            END
                    END
                FROM 
                    recursive_expenses re
                JOIN 
                    public.apartment_expense ae 
                ON 
                    re.expense_id = ae.expense_id
                WHERE 
                    ae.is_one_time_expense = false
                    AND ae.expense_date <= CURRENT_DATE
                    AND (
                        ae.expense_period = 0 
                        OR re.next_due_date <= CURRENT_DATE
                    )
            )
            SELECT 
                SUM(expense_amount) AS total_expense_amount
            FROM 
                recursive_expenses
            WHERE 
                (DATE_TRUNC('month', next_due_date) = DATE_TRUNC('month', CURRENT_DATE)
                OR next_due_date IS NULL)
                AND apartment_id = $1;
            `;
        const values = [apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0].total_expense_amount;
        } catch (error) {
            console.log('Error getting apartment expenses: ', error);
        }
    }

    static async getApartmentOneTimeExpenseForAccounting(apartment_id){
        const queryText = `
            SELECT COALESCE(SUM(expense_amount), 0) AS total_expense_amount
            FROM apartment_expense 
            WHERE apartment_id = $1 
            AND expense_period IS NULL
            AND DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE);
            `;
        const values = [apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0].total_expense_amount;
        } catch (error) {
            console.log('Error getting one time apartment_expenses: ', error);
        }
    }

    static async getDebtInfoForAccounting(date, apartment_id){
        const cashAndCardIncomeForCurrentMonth = `
            SELECT
                SUM(CASE WHEN payment_method = 'card' AND DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', $1::date) THEN amount ELSE 0 END) AS total_card_income,
                SUM(CASE WHEN payment_method = 'cash' AND DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', $1::date) THEN amount ELSE 0 END) AS total_cash_income
            FROM
                payment_history
            WHERE	
                apartment_id = $2
        `;
        const values = [date, apartment_id];
    
        const totalExpectedQueryForCurrentMonth = `
            SELECT 
                SUM(CASE WHEN status = 'Not pay' THEN amount ELSE 0 END) AS total_expected_income
            FROM
                debt
            WHERE
                DATE_TRUNC('month', created_at) = DATE_TRUNC('month', $1::date)
                AND apartment_id = $2
        `;
    
        try{
            const result = await client.query(cashAndCardIncomeForCurrentMonth, values);
            const expectedResult = await client.query(totalExpectedQueryForCurrentMonth, values);
            return [result.rows[0].total_card_income, result.rows[0].total_cash_income, expectedResult.rows[0].total_expected_income];
        } catch (error) {
            console.log('Error getting debts for accounting: ', error);
        }
    }    

    static async computeAccount(date, apartment_id){
        const apartmentExpense = await this.getApartmentExpensesForAccounting(apartment_id);
        const oneTimeApartmentExpense = await this.getApartmentOneTimeExpenseForAccounting(apartment_id);
        const debtIncome = await this.getDebtInfoForAccounting(date, apartment_id);
        
        let totalApartmentExpense = apartmentExpense + oneTimeApartmentExpense;
        let totalCardIncome = debtIncome[0];
        let totalCashIncome = debtIncome[1];
        let totalExpectedIncome = debtIncome[2];

        return {
            totalCardIncome: totalCardIncome,
            totalCashIncome: totalCashIncome,
            totalExpectedIncome: totalExpectedIncome,
            totalApartmentExpense: totalApartmentExpense
        };
    }
}

module.exports = {Till};