const { client } = require("../middleware/database");

class Portfolio{
    constructor(portfolio_id, user_id, share_symbol, quantity){
        this.portfolio_id = portfolio_id;
        this.user_id = user_id;
        this.share_symbol = share_symbol;
        this.quantity = quantity;
    }

    static async GetPortfolioById(portfolio_id){
        const queryText = 'SELECT * FROM portfolio WHERE portfolio_id = $1;';

        try{
            const result = await client.query(queryText, [portfolio_id]);
            return result.rows[0];
        } catch (error){
            console.log('Error getting portfolio by id: ', error);
        }
    }

    static async getUserIdByPortfolioId(portfolio_id){
        const queryText = 'SELECT user_id FROM portfolio WHERE portfolio_id = $1;';

        try{
            const result = await client.query(queryText, [portfolio_id]);
            return result.rows[0].user_id;
        } catch (error){
            console.log('error getting user id by portfolio id: ', error);
            return false;
        }
    }
    static async getShareQuantity(user_id, share_symbol){
        const queryText = 'SELECT quantity FROM portfolio WHERE user_id = $1 AND share_symbol = $2;';
        const values = [user_id , share_symbol];
        try{
            const result = await client.query(queryText,values);
            return result.rows[0].quantity;
        }catch(error){
            console.log('error getting share quantity: ', error);
            return false;
        }

    }

    static async GetOrCreatePortfolio(user_id, share_symbol){
        const queryText = 'SELECT portfolio_id FROM portfolio WHERE share_symbol = $1 AND user_id=$2;';
        const values = [share_symbol, user_id];

        try{
            const result = await client.query(queryText, values);
            if(!result.rows[0]){
                const insertQuery = 'INSERT INTO portfolio (user_id, share_symbol, quantity) VALUES($1,$2,$3) RETURNING portfolio_id;';
                const insertValues = [user_id, share_symbol, 0];

                const portfolioResult = await client.query(insertQuery, insertValues);
                return portfolioResult.rows[0].portfolio_id;
            } else {
                return result.rows[0].portfolio_id;
            }
        } catch (error){
            console.log('error getting share portfolio: ', error);
            return false;
        }
    }
}

module.exports = { Portfolio };