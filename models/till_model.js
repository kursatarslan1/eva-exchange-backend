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
}

module.exports = {Till};