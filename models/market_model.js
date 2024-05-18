const { client } = require("../middleware/database");

class Market {
    constructor(id, share_symbol, seller_portfolio_id, quantity, price) {
        this.id = id;
        this.share_symbol = share_symbol;
        this.seller_portfolio_id = seller_portfolio_id;
        this.quantity = quantity;
        this.price = price;
    }

    static async GetMarket() {
        const queryText = 'SELECT * FROM market;';

        try {
            const result = await client.query(queryText, []);
            return result.rows;
        } catch (error) {
            console.log('Error getting market: ', error);
        }
    }

    static async AddMarket(share_symbol, seller_portfolio_id, quantity, price) {
        const today = new Date();
        const queryText = 'INSERT INTO market (share_symbol, seller_portfolio_id, quantity, price, last_updated) VALUES($1,$2,$3,$4,$5);';
        const values = [share_symbol, seller_portfolio_id, quantity, price,today];

        try{
            const result = await client.query(queryText,values);
            return true || result;

        }catch(error){
            console.log('Error adding market: ', error);
            return false;
        }
    }

    static async GetShareInfoByMarketId(market_id){
        const queryText = 'SELECT share_symbol, seller_portfolio_id, quantity, price, id, last_updated FROM market WHERE id = $1;';
    
        try{
            const result = await client.query(queryText, [market_id]);
            return result.rows[0];
        } catch (error){
            console.log('Error getting market information: ', error);
            return false;
        }
    }

    static async RemoveShareFromMarket(market_id, quantity, seller_portfolio_id){
        const queryText = 'UPDATE portfolio SET quantity=$1 WHERE portfolio_id=$2;';
        const values = [quantity, seller_portfolio_id];
        try{
            const result = await client.query(queryText, values);
            if(result){
                this.Delist(market_id);
            }
        } catch (error) {
            console.log('Error removing share on market: ', error);
            return false;
        }
    }

    static async Delist(market_id){
        const queryText = 'DELETE FROM market WHERE id = $1;';

        try{
            await client.query(queryText, [market_id]);
            return true;
        } catch (error){
            console.log('Error delist: ', error);
            return false;
        }
    }

    static async UpdatePriceByMarketId(market_id, new_price){
        const queryText = 'UPDATE market SET price =$1 WHERE id=$2;';
        const values = [new_price, market_id];

        try{
            const result = await client.query(queryText, values);
            if(result){
                await this.UpdateDateByMarketId(market_id);
                return true;
            }
        } catch (error){
            console.log('Error updating price: ', error);
            return false;
        }
    }

    static async UpdateDateByMarketId(market_id){
        const currentTime = new Date(); 
        const queryText = 'UPDATE market SET last_updated=$1 WHERE id = $2;';
        const values = [currentTime, market_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.log('Error updating date: ', error);
        }
    }
}

module.exports = { Market };