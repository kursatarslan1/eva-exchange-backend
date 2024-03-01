const { client } = require('../middleware/database');

class Block {
    constructor(block_id, apartment_id, block_name, unit_count) {
        this.block_id = block_id;
        this.apartment_id = apartment_id;
        this.block_name = block_name;
        this.unit_count = unit_count;
    }

    static async create(blockData) {
        try {
            const queryText = 'INSERT INTO blocks (apartment_id, block_name, unit_count) VALUES ($1, $2, $3) RETURNING block_id';
            const values = [blockData.apartment_id, blockData.block_name, blockData.unit_count];
            const result = await client.query(queryText, values);
            return result.rows[0].block_id; // Tüm işlemler başarıyla tamamlandı
        } catch (error) {
            console.error('Error executing create query: ', error);
        }
    }
}

module.exports = { Block };