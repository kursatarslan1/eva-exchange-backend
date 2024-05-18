const Shares = require("../models/Shares");

async function ShareSymbolValidation(symbol) {
    try {
        const share = await Shares.findOne({ where: { symbol } });
        
        return !!share;
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        throw error;
    }
}

module.exports = { ShareSymbolValidation };
