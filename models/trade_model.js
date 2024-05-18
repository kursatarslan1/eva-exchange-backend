const { client } = require("../middleware/database");

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
}

module.exports = { Trade };