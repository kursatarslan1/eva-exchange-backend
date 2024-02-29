const { client } =  require('../middleware/database');

class KnowledgeAndRules{
    constructor(knowledge_and_rules_id, apartment_id, publisher_manager_id, publisher_name, content, publish_date){
        this.knowledge_and_rules_id = knowledge_and_rules_id;
        this.apartment_id = apartment_id;
        this.publisher_manager_id = publisher_manager_id;
        this.publisher_name = publisher_name;
        this.content = content;
        this.publish_date = publish_date;
    }

    static async create(apartment_id, publisher_manager_id, publisher_name, content, publish_date){
        const queryText = 'INSERT INTO knowledge_and_rules (apartment_id, publisher_manager_id, publisher_name, content, publish_date) VALUES($1, $2, $3, $4, $5)';
        const values = [apartment_id, publisher_manager_id, publisher_name, content, publish_date];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error creating knowledge and rules: ', error);
        }
    }

    static async getKnowledgeAndRules(apartment_id){
        const queryText = 'SELECT * FROM knowledge_and_rules WHERE apartment_id = $1';
        const values = [apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.error('Error getting knowledge and rules: ', error);
        }
    }

    static async deleteKnowledgeAndRules(knowledge_and_rules_id){
        const queryText = 'DELETE FROM knowledge_and_rules WHERE knowledge_and_rules_id = $1';
        const values = [knowledge_and_rules_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error delete knowledge and rules: ', error);
        }
    }
}

module.exports = { KnowledgeAndRules };