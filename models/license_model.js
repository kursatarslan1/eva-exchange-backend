const { client } =  require('../middleware/database');
const { v4: uuidv4 } = require('uuid');

class License{
    constructor(license_id, key_value, is_used, apartment_id, manager_id, valid_duration, assigned_date, expiration_Date){
        this.license_id = license_id;
        this.key_value = key_value;
        this.is_used = is_used;
        this.apartment_id = apartment_id;
        this.manager_id = manager_id;
        this.valid_duration = valid_duration;
        this.assigned_date = assigned_date;
        this.expiration_Date = expiration_Date;
    }

    static async create(valid_duration){
        const uniqeKey = generateUniqueKey();
        const queryText = 'INSERT INTO license_key (key_value, valid_duration) VALUES ($1, $2) RETURNING key_value';
        const values = [uniqeKey, valid_duration];
        try{
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (error){
            console.error('Error creating license: ', error);
        }
    } 

    static async getLicenseKey(apartment_id){
        const queryText = 'SELECT * FROM license_key WHERE apartment_id = $1';
        const values = [apartment_id];
        
        try{
            const result = await client.query(queryText, values);
            return result.rows;                
        }  catch (error){
            console.error('Error getting license: ', error);
        }
    }

    static async assign(key_value, manager_id, apartment_id, valid_duration) {
        try {
            const is_used = true;
            const assigned_date = new Date();
            const expiration_Date = calculateExpirationDate(valid_duration, assigned_date);
            const values = [is_used, apartment_id, manager_id, valid_duration, assigned_date, expiration_Date, key_value];
            const updateFields = ["is_used", "apartment_id", "manager_id", "valid_duration", "assigned_date", "expiration_date"];
            const queryText = `
                UPDATE license_key
                SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")}
                WHERE key_value = $${updateFields.length + 1}
            `;
    
            const assignResult = await client.query(queryText, values);
            return assignResult.rows[0];
        } catch (error) {
            console.error('Error assigning license: ', error);
        }
    }
}

const generateUniqueKey = () => {
    return uuidv4(); // UUIDv4 kullanarak benzersiz bir anahtar oluşturur
};

const calculateExpirationDate = (validDuration, assignedDate) => {
    const millisecondsInDay = 1000 * 60 * 60 * 24; // Bir günün milisaniye cinsinden değeri
    const assignedDateTime = new Date(assignedDate).getTime(); // assignedDate'i milisaniye cinsine çevirir
    const expirationDateTime = assignedDateTime + (validDuration * millisecondsInDay); // assignedDateTime'e validDuration günü ekler
    const expirationDate = new Date(expirationDateTime).toISOString().split('T')[0]; // Sonucu yyyy-mm-dd formatında bir dizeye dönüştürür
    return expirationDate;
  };

module.exports = { License };