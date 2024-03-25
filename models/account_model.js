const { client } =  require('../middleware/database');

class Account{
    constructor(account_id, apartment_id, account_name, account_owner_name, iban_number, bank_name, account_type){
        this.account_id = account_id;
        this.apartment_it = apartment_id;
        this.account_name = account_name;
        this.account_owner_name = account_owner_name;
        this.iban_number = iban_number;
        this.bank_name = bank_name;
        this.account_type = account_type;
    }

    static async create(apartment_id, account_name, account_owner_name, iban_number, bank_name, account_type){
        const queryText = 'INSERT INTO account_information (apartment_id, account_name, account_owner_name, iban_number, bank_name, account_type) VALUES($1, $2, $3, $4, $5, $6);'
        const values = [apartment_id, account_name, account_owner_name, iban_number, bank_name, account_type];

        try {
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Error creating account: ', error);
        }
    }

    static async getAccounts(apartment_id){
        const queryText = 'SELECT * FROM account_information WHERE apartment_id = $1';
        
        try{
            const result = await client.query(queryText, [apartment_id]);
            return result.rows;
        } catch (error) {
            console.log('Error getting account information: ', error);
        }
    }

    static async deleteAccount(account_id){
        const queryText = 'DELETE FROM account_information WHERE account_id = $1;';

        try{
            await client.query(queryText, [account_id]);
            return true;
        } catch (error) {
            console.log('Error account delete query: ', error);
        }
    }

    static async updateAccount(account_id, account_name, account_owner_name, iban_number, bank_name, account_type){
        try{
            const query = `
                UPDATE account_information 
                SET 
                    account_name = $1,
                    account_owner_name = $2,
                    iban_number = $3,
                    bank_name = $4,
                    account_type = $5
                WHERE account_id = $6
                `;

            const result = await client.query(query, [account_name, account_owner_name, iban_number, bank_name, account_type, account_id]);
            return true;
        } catch (error){
            console.log('Error updating account:', error);
            return false;
        }
    } 
}

module.exports = { Account };