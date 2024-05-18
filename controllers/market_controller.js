const { Market } = require("../models/market_model");
const { Portfolio } = require("../models/portfolio_model");

async function GetMarket(req, res){
    try{
        const market = await Market.GetMarket();

        if(!market){
            return res.status(400).json({ error: "Market Not Found" });
        }

        res.json({ market });
    } catch (error){
        console.log("Error getting market - in market controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}


async function RemoveShareFromMarket(req, res){
    const { user_id, market_id } = req.query;

    const marketInfo = await Market.GetShareInfoByMarketId(market_id);
    if(!marketInfo){
        return res.status(400).json({ error: "Market Not Found" });
    }
    const sellerUserId = await Portfolio.getUserIdByPortfolioId(marketInfo.seller_portfolio_id);
    const shareQuantity = await Portfolio.getShareQuantity(user_id,marketInfo.share_symbol);

    try{
        if(user_id != sellerUserId){
            return res.status(401).json({ error: "Unauthorizated" });
        }
        const result = await Market.RemoveShareFromMarket(market_id, shareQuantity + marketInfo.quantity, marketInfo.seller_portfolio_id);
        if(!result){
            return res.status(417).json({ error: "Expectation Failed" });
        }
        return res.json({ success: true });
    } catch (error){
        console.log('Error removing market: ', error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

async function UpdatePriceByMarketId(req, res){
    const { market_id, new_price } = req.body;

    try{
        const marketInfo = await Market.GetShareInfoByMarketId(market_id);
        const lastUpdatedDate = marketInfo.last_updated;
        const currentTime = new Date();

        const timeDifference = currentTime - lastUpdatedDate;
        const differenceInHours = timeDifference / (1000 * 60 * 60);

        if(differenceInHours >= 1){
            const updatePriceResult = await Market.UpdatePriceByMarketId(market_id, new_price);
            if(!updatePriceResult){
                return res.status(400).json({ error: 'Unexpected Error' });
            }
            return res.json({ success: 'Price update successful.' });
        } else{
            return res.status(400).json({ error: 'You cannot update price before one hour.' });
        }
    } catch (error){
        console.log('Error updating price: ', error);
        return res.status(400).json({ error: 'Unexpected error' });
    }
}

module.exports = { GetMarket, RemoveShareFromMarket, UpdatePriceByMarketId };