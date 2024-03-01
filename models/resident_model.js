const { client } =  require('../middleware/database');

class Resident{
    constructor(resident_id, status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status){
        this.resident_id = resident_id;
        this.status = status;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.apartment_id = apartment_id;
        this.block_id = block_id;
        this.unit_id = unit_id;
        this.email = email;
        this.tenant = tenant;
        this.photo = photo;
        this.country = country;
        this.city = city;
        this.state = state;
        this.record_status = record_status;
    }

    static async create(status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status){
        const queryText = 'INSERT INTO residents (status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING resident_id'
        const values = [status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status]
        
        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error){
            console.error('Error executing create query: ', error);
        }
    }

    static async findByEmail(email){
        const queryText = 'SELECT * FROM residents WHERE email = $1 and record_status = $2';
        const values = [email, 'A'];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error){
            console.error('Error executing findByEmail query: ', error);
        }
    }

    static async DeactiveAccount(resident_id){
        const queryText = 'UPDATE residents SET record_status = $1 WHERE resident_id = $2'
        const values = ['P', resident_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error executing deactive query: ', error);
        }
    }

    static async UpdateResidentById(resident_id, first_name, last_name, phone_number, photo, country, city, state){
        try{
            const updateFields = [
                "first_name",
                "last_name",
                "phone_number",
                "photo",
                "country",
                "city",
                "state"
            ]

            const updateValues = [
                first_name, last_name, phone_number, photo, country, city, state
            ];

            const queryText = `
                UPDATE residents 
                SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")}
                WHERE resident_id = $${updateFields.length + 1} RETURNING *
            `;

            const values = [...updateValues, resident_id];

            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error){
            console.error('Yönetici bilgileri güncellenirken hata oluştu: ', error);
        }
    }
}

module.exports = { Resident };