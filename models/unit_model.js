const { client } = require('../middleware/database');

class Unit {
    static async createUnitsForBlocks(blocksData) {
        try {
            for (let blockData of blocksData) {
                const { block_id, apartment_id, unit_count } = blockData;
                const values = Array.from({ length: unit_count }, (_, index) => [block_id, apartment_id, index + 1]); // Unit numaralarını 1'den başlayarak oluşturur
                const queryText = 'INSERT INTO units (block_id, apartment_id, unit_number) VALUES ' + values.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(',');
                await client.query(queryText, values.flat());
            }
            return true; // Tüm işlemler başarıyla tamamlandı
        } catch (error) {
            console.error('Error executing createUnitsForBlocks query: ', error);
            throw error;
        }
    }
}

module.exports = Unit;
