const { client } =  require('../middleware/database');

class Apartment{
    constructor(apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status){
        this.apartment_id = apartment_id;
        this.apartment_name = apartment_name;
        this.apartment_country = apartment_country;
        this.apartment_city = apartment_city;
        this.apartment_state = apartment_state;
        this.apartment_full_address = apartment_full_address;
        this.apartment_due_amount = apartment_due_amount;
        this.apartment_license = apartment_license;
        this.record_status = record_status;
    }

    static async create(apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status){
        const apartment_id = generateApartmentId();
        const queryText = 'INSERT INTO apartment (apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';
        const values = [apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount, apartment_license, record_status];

        try{
            await client.query(queryText, values);
            return apartment_id;
        } catch (error){
            console.error('Error executing create query: ', error);
        }
    }

    static async createRelation(manager_id, apartment_id){
        const queryText = 'INSERT INTO manager_apartment_relation (manager_id, apartment_id) VALUES($1,$2)';
        const values = [manager_id, apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0]
        }catch (error){
            console.error('Error creating relation query: ', error);
        }
    }

    static async getRelationApartment(manager_id){
        const queryText = 'SELECT * FROM manager_apartment_relation WHERE manager_id = $1';
        const values = [manager_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.error('Error getting relation apartment: ', error);
        }
    }

    static async getApartmentDetail(manager_id, apartment_id){
        const queryText = `
        SELECT
            ai.apartment_id,
            ai.apartment_name,
            ai.apartment_country,
            ai.apartment_city,
            ai.apartment_state,
            ai.apartment_full_address,
            ai.apartment_due_amount,
            ai.apartment_license,
            json_agg(
                json_build_object(
                    'block_id', abi.block_id,
                    'block_name', abi.block_name,
                    'units', (
                        SELECT json_agg(
                            json_build_object(
                                'unit_id', unit.unit_id,
                                'unit_number', unit.unit_number
                            )
                        )
                        FROM units unit
                        WHERE unit.block_id = abi.block_id
                    )
                )
            ) AS blocks
        FROM
            manager_apartment_relation mar
        JOIN
            apartment ai ON mar.apartment_id = ai.apartment_id
        LEFT JOIN (
            SELECT DISTINCT apartment_id, block_id, block_name
            FROM blocks
        ) abi ON ai.apartment_id = abi.apartment_id
        WHERE
            mar.manager_id = $1 AND ai.apartment_id = $2
        GROUP BY
            ai.apartment_id,
            ai.apartment_name,
            ai.apartment_country,
            ai.apartment_city,
            ai.apartment_state,
            ai.apartment_full_address,
            ai.apartment_due_amount,
            ai.apartment_license;
    `;
        const values = [manager_id, apartment_id];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.error('Error getting relation apartment: ', error);
        }
    }

    static async updateApartmentInfo(apartment_id, apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount){
        try{
            const updateFields = [
                "apartment_name",
                "apartment_country",
                "apartment_city",
                "apartment_state",
                "apartment_full_address",
                "apartment_due_amount"
            ]

            const updateValues = [
                apartment_name, apartment_country, apartment_city, apartment_state, apartment_full_address, apartment_due_amount
            ];

            const queryText = `
                UPDATE apartment 
                SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")}
                WHERE apartment_id = $${updateFields.length + 1} RETURNING *
            `;

            const values = [...updateValues, apartment_id];

            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Yönetici bilgileri güncellenirken hata oluştu: ', error);
        }
    }
}

function generateApartmentId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  }

module.exports = { Apartment };