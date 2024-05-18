const { client } = require("../middleware/database");
const { Market } = require("../models/market_model");
const { Portfolio } = require("../models/portfolio_model");
const { User } = require("../models/users_model");
const { Trade } = require("../models/trade_model");

class Share{
    constructor(id, symbol, price, last_updated){
        this.id = id;
        this.symbol = symbol;
        this.price = price;
        this.last_updated = last_updated;
    }

    static async GetShareByShareSymbol(symbol){
        const queryText = 'SELECT * FROM shares WHERE symbol = $1;';

        try{
            const result = await client.query(queryText, [symbol]);
            return result.rows[0];
        } catch (error){
            console.log('Error getting share by id: ', error);
        }
    }

    static async getAllShares(){
        const queryText = 'SELECT * FROM shares;';

        try{
            const result = await client.query(queryText, []);
            return result.rows;
        } catch (error){
            console.log('Error getting all share: ', error);
        }
    }

    static async buyShare(marketInfo, buyer_portfolio_id, quantity){
        const buyer_user_id = await Portfolio.GetUserIdByPortfolioId(buyer_portfolio_id);
        const shareQuantity = await Portfolio.GetShareQuantity(buyer_user_id, marketInfo.share_symbol);

        const queryText = 'UPDATE portfolio SET quantity = $1 WHERE portfolio_id = $2;';
        const values = [shareQuantity + quantity, buyer_portfolio_id];

        const currentTime = new Date();

        try{
            const result = await client.query(queryText, values);
            if(result){
                const buyerUserBalance = await User.GetBalanceByUserId(buyer_user_id);
                const updateBuyerBalanceQueryText = 'UPDATE users SET cash = $1 WHERE user_id =$2;';
                const buyerValues=[Number(buyerUserBalance) - Number((quantity*(marketInfo.price))), buyer_user_id]; 

                await client.query(updateBuyerBalanceQueryText, buyerValues);

                const seller_user_id = await Portfolio.GetUserIdByPortfolioId(marketInfo.seller_portfolio_id);
                const sellerUserBalance = await User.GetBalanceByUserId(seller_user_id);

                const updateSellerBalanceQueryText = 'UPDATE users SET cash = $1 WHERE user_id= $2;';
                const sellerValues = [Number(sellerUserBalance) + Number((quantity*(marketInfo.price))), seller_user_id];

                if(!buyerUserBalance || !sellerUserBalance){
                    return false;
                }

                await client.query(updateSellerBalanceQueryText, sellerValues);
                
                if(marketInfo.quantity == quantity){
                    await Market.Delist(marketInfo.id);
                } else {
                    const remainQuantity = marketInfo.quantity - quantity;
                    const updateRemainQuantityQueryText = 'UPDATE market SET quantity = $1 WHERE id =$2;';
                    const updateRemainQuantityValues = [remainQuantity, marketInfo.id];

                    await client.query(updateRemainQuantityQueryText, updateRemainQuantityValues);
                }
            const tradeResult = await Trade.AddTradeLog(marketInfo.seller_portfolio_id, buyer_portfolio_id, marketInfo.share_symbol, quantity, marketInfo.price, currentTime);
            if(!tradeResult){
                return false;
            }
            return true;
            }
        } catch (error){
            console.log(error);
            return false;
        }
    }

    static async sellShare(user_id,share_symbol, portfolio_id, quantity, price, user_share_quantity){
        const queryText = 'UPDATE portfolio SET quantity = $1 WHERE user_id = $2 AND share_symbol = $3;';
        const values = [user_share_quantity-quantity, user_id, share_symbol];
        
        try{
            const result = await client.query(queryText,values);
            const addMarket = await Market.AddMarket(share_symbol,portfolio_id,quantity,price);
            return true;
        }catch(error){
            console.log('hata var: ', error);
            return false;
        }
    }
}

module.exports = { Share };