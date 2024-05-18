const { client } = require("../middleware/database");
const { Portfolio } = require("../models/portfolio_model")

class Trade{
    constructor(trade_id, seller_portfolio_id, buyer_portfolio_id, symbol, quantity, price, trade_timestamp){
        this.trade_id = trade_id;
        this.seller_portfolio_id = seller_portfolio_id;
        this.buyer_portfolio_id = buyer_portfolio_id;
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.trade_timestamp = trade_timestamp;
    }

    static async getTradesByPortfolioId(portfolio_id){
        const queryText = 'SELECT * FROM trade WHERE seller_portfolio_id = $1 OR buyer_portfolio_id = $1;';

        try{
            const result = await client.query(queryText, [portfolio_id]);
            return result.rows;
        } catch (error){
            console.log('Error getting trade by portfolio id: ', error);
            return false;
        }
    }

    static async AddTradeLog(seller_portfolio_id, buyer_portfolio_id, symbol, quantity, price, trade_timestamp){
        const queryText = 'INSERT INTO trade (seller_portfolio_id, buyer_portfolio_id, symbol, quantity, price, trade_timestamp) VALUES($1,$2,$3,$4,$5,$6);';
        const values = [seller_portfolio_id, buyer_portfolio_id, symbol, quantity, price, trade_timestamp];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.log('Error adding trade to db: ', error);
            return false;
        }
    }

    static async GetBuyHistoryByUserId(user_id){
        const queryText = 'SELECT * FROM trade WHERE buyer_portfolio_id = $1;';
        const portfolioIds = await Portfolio.GetPortfolioIdsByUserId(user_id);
        let combinedResults = [];

        for (let idCount = 0; idCount < portfolioIds.length; idCount++) {
            const result = await client.query(queryText, [portfolioIds[idCount].portfolio_id]);
            combinedResults = combinedResults.concat(result.rows);
        }
        return combinedResults;
    }

    static async GetSellHistoryByUserId(user_id){
        const queryText = 'SELECT * FROM trade WHERE seller_portfolio_id = $1;';
        const portfolioIds = await Portfolio.GetPortfolioIdsByUserId(user_id);
        let combinedResults = [];

        for (let idCount = 0; idCount < portfolioIds.length; idCount++) {
            const result = await client.query(queryText, [portfolioIds[idCount].portfolio_id]);
            combinedResults = combinedResults.concat(result.rows);
        }
        return combinedResults;
    }
}

module.exports = { Trade };