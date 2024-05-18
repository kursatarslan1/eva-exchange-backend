const { client } = require("../middleware/database");

async function ShareSymbolValidation(symbol) {
    try{
        const query = {
            text: 'SELECT EXISTS(SELECT 1 FROM public.shares WHERE symbol = $1)',
            values: [symbol.toUpperCase()],
        };
    
        const result = await client.query(query);
        return result.rows[0].exists;
    } catch (error){
        console.error('Veritabanı hatası:', error);
    }
}

module.exports = { ShareSymbolValidation };
