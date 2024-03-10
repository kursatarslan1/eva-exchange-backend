const { Country } = require('../models/address_model');
const { City } = require('../models/address_model');
const { State } = require('../models/address_model');

async function getCountry(req, res){
    try{
        const countryList = await Country.Countries();
        res.json({countryList});
    } catch (error){
        console.error('error in country list: ', error);
        res.status(500).json({error: 'Cannot get country list.'});
    }
}

async function getCity(req, res){
    const { country_id } = req.query;
    try{
        const cityList = await City.Cities(country_id);
        res.json({cityList});
    } catch (error) {
        console.error('error in city list: ', error);
        res.status(500).json({error: 'Cannot get city list.'});
    }
}

async function getCityByName(req, res){
    const { country_name } = req.query;
    try{
        const cityList = await City.CitiesByName(country_name);
        res.json({cityList});
    }
    catch (error) {
        console.error('error in city list: ', error);
        res.status(500).json({error: 'Cannot get city list.'});
    }
}

async function getState(req, res){
    const { city_id } = req.query;
    try{
        const stateList = await State.States(city_id);
        res.json({stateList});
    } catch (error) {
        console.error('error in state list: ', error);
        res.status(500).json({error: 'Cannot get state list.'});
    }
}

module.exports = { getCountry, getCity, getState , getCityByName};