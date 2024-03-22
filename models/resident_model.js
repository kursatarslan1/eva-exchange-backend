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

    static async create(status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status, address){
        const queryText = 'INSERT INTO residents (status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING resident_id'
        const values = [status, first_name, last_name, phone_number, apartment_id, block_id, unit_id, email, tenant, photo, country, city, state, record_status, address]
        
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

    static async findByUnitId(unit_id){
        const queryText = 'SELECT r.resident_id, r.first_name, r.last_name, r.phone_number, r.email, r.tenant, r.photo, r.address, u.notes FROM residents as r INNER JOIN units u ON r.unit_id = u.unit_id WHERE r.unit_id = $1 AND r.record_status = $2;';
        const values = [unit_id, 'A'];

        try {
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch(error) {
            console.log('Konut sakini bilgileri alınırken bir hata oluştu: ', error);
        }
    }

    static async findByResidentId(resident_id){
        const queryText = 'SELECT * FROM residents WHERE resident_id = $1 AND record_status = $2';
        const values = [resident_id, 'A'];

        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.log('Resident bilgileri alınırken bir hata oluştu: ', error);
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

    static async GetAllResidentByApartmentId(apartment_id){
        const queryText = 'SELECT * FROM residents WHERE apartment_id = $1 AND status = $2 AND record_status = $3;';
        const values = [apartment_id, 'A', 'A'];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error){
            console.log('Cannot get residents: ', error);
        }
    }

    static async GetAllWaitingApprovalResidents(apartment_id) {
        const queryText = 'SELECT * FROM residents WHERE apartment_id = $1 AND status = $2';
        const values = [apartment_id, 'P'];

        try{
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.log('Onayda bekleyen kullanıcılar getirilirken bir hata oluştu.')
        }
    }
    
    static async ApproveResident(resident_id) {
        const queryText = 'UPDATE residents SET status = $1 WHERE resident_id = $2 RETURNING *';
        const values = ['A', resident_id];

        try{
            const resident = await client.query(queryText, values);
            if(resident){
                await this.AddResidentToUnits(resident.rows[0]);
                return true;
            }
        } catch (error) {
            console.log('Kullanıcı onaylanırken bir hata oluştu: ', error);
        }
    }

    static async AddResidentToUnits(resident){
        const fullName = `${resident.first_name} ${resident.last_name}`; 
        const queryText = 'UPDATE units SET is_using = $1, resident_name = $2 WHERE unit_id = $3';
        const values = ['E', fullName, resident.unit_id];

        try{
            const result = await client.query(queryText, values);
            if(result){
                return true;
            }
        } catch (error) {
            console.log('Konut sakini bilgileri daireye yazılırken bir hata oluştu: ', error);
        }
    }

    static async RejectResident(resident_id){
        const queryText = 'UPDATE residents SET status = $1 WHERE resident_id = $2';
        const values = ['R', resident_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error) {
            console.log('Kullanıcı reddedilirken bir hata oluştu: ', error);
        }
    }
}

module.exports = { Resident };