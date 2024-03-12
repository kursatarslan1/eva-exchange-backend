const { client } = require('../middleware/database');

class Unit {
    static async createUnitsForBlocks(blocksData) {
        try {
            for (let blockData of blocksData) {
                const { block_id, apartment_id, unit_count } = blockData;
                const values = Array.from({ length: unit_count }, (_, index) => [block_id, apartment_id, index + 1, 'H', 'empty']); // Unit numaralarını 1'den başlayarak oluşturur
                const queryText = 'INSERT INTO units (block_id, apartment_id, unit_number, is_using, resident_name) VALUES ' + values.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(',');
                await client.query(queryText, values.flat());
            }
            return true; // Tüm işlemler başarıyla tamamlandı
        } catch (error) {
            console.error('Error executing createUnitsForBlocks query: ', error);
        }
    }

    static async createNote(unit_id, note) {
        const queryText = 'UPDATE units SET notes = $1 WHERE unit_id = $2';
        const values = [note, unit_id];

        try{
            const result = await client.query(queryText, values);
            if(result) {
                return true;
            }
        } catch (error) {
            console.log('Notlar güncellenirken bir hata ile karşılaşıldı: ', error);
        }
    }
}

module.exports = { Unit };
