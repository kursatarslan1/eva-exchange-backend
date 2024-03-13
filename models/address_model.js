const { client } =  require('../middleware/database');

class Country{
    constructor(country_id, short_name, name, phone_code){
        this.country_id = country_id;
        this.short_name = short_name;
        this.name = name;
        this.phone_code = phone_code;
    }

    static async Countries(){
        try{
            const queryText = 'SELECT * FROM countries';
            const result = await client.query(queryText, []);
            return result.rows;
        } catch (error) {
            console.error('Error getting country list: ', error);
        }
    }
}

class City{
    constructor(city_id, name, country_id){
        this.city_id = city_id;
        this.name = name;
        this.country_id = country_id;
    }

    static async Cities(country_id){
        try{
            const queryText = 'SELECT * FROM states WHERE country_id = $1';
            const values = [country_id];
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (error) {
            console.error('Error gettin city list: ', error);
        }
    } 

    static async CitiesByName(country_name){
        try {
            const queryText = 'SELECT id FROM countries WHERE name = $1';
            const values = [country_name];
            const result = await client.query(queryText, values);
            return this.Cities(result.rows[0]); // will be testes
        } catch (con) {
            console.error('Error gettin city list: ', error);
        }
    }
}

class State{
    constructor(state_id, name, city_id){
        this.state_id = state_id;
        this.name = name;
        this.city_id = city_id;
    }

    static async States(city_id){
        try{
           const queryText = 'SELECT * FROM cities WHERE state_id = $1';
           const values = [city_id];
           const result = await client.query(queryText, values);
           return result.rows;
        } catch (error) {
            console.error('Error getting state list: ', error);
        }
    }

    static async StatesByName(city_name){
        try{
            const queryText = 'SELECT id FROM states WHERE name = $1';
            const values = [city_name];
            const result = await client.query(queryText, values);
            return this.States(result.rows[0]); // will be tested
         } catch (error) {
             console.error('Error getting state list: ', error);
         }
    }
}

module.exports = { Country, City, State };