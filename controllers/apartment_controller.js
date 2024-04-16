const { Apartment } = require("../models/apartment_model");
const { Block } = require("../models/block_model");
const { Unit } = require("../models/unit_model");

async function createApartment(req, res) {
  const {
    manager_id,
    apartment_name,
    apartment_country,
    apartment_city,
    apartment_state,
    apartment_full_address,
    apartment_due_amount,
    apartment_license,
    record_status,
    blocks,
  } = req.body;

  try {
    const apartmentResult = await Apartment.create(
      apartment_name,
      apartment_country,
      apartment_city,
      apartment_state,
      apartment_full_address,
      apartment_due_amount,
      apartment_license,
      record_status
    );

    if (!apartmentResult) {
      console.error("Apartment creation failed");
      return res.status(500).json({ error: "Create apartment unsuccessful" });
    }

    await Apartment.createRelation(manager_id, apartmentResult);

    for (const block of blocks) {
      block.apartment_id = apartmentResult;

      const blockResult = await Block.create(block);

      if (!blockResult) {
        console.error("Block creation failed");
        return res.status(500).json({ error: "Create block unsuccessful" });
      }

      block.block_id = blockResult;

      await Unit.createUnitsForBlocksT([block]);
      await Apartment.createTill(apartmentResult, block.block_id);
    }

    res.json({ message: "Success create apartment and blocks" });
  } catch (error) {
    console.error("Create error: " + error);
    res.status(500).json({ error: "Create apartment and blocks unsuccessful" });
  }
}

async function getApartment(req, res) {
  const manager_id = req.query.manager_id;

  try {
    const apartments = await Apartment.getRelationApartment(manager_id);
    res.json({ apartments });
  } catch (error) {
    console.error("get error: " + error);
    res.status(500).json({ error: "get apartment unsuccessful" });
  }
}

async function getApartmentDetail(req, res) {
  const { manager_id, apartment_id } = req.query;

  try {
    const apartmentDetail = await Apartment.getApartmentDetail(
      manager_id,
      apartment_id
    );
    res.json({ apartmentDetail });
  } catch (error) {
    console.error("get error: " + error);
    res.status(500).json({ error: "get apartment unsuccessful" });
  }
}

async function getApartmentDetailById(req, res) {
  const { apartment_id } = req.query;

  try {
    const apartmentDetail = await Apartment.getApartmentDetailById(
      apartment_id
    );
    res.json({ apartmentDetail });
  } catch (error) {
    console.error("get error: " + error);
    res.status(500).json({ error: "get apartment unsuccessful" });
  }
}

async function updateApartment(req, res) {
  const {
    apartment_id,
    apartment_name,
    apartment_full_address,
    apartment_due_amount,
  } = req.body;

  try {
    const result = await Apartment.updateApartmentInfo(
      apartment_id,
      apartment_name,
      apartment_full_address,
      apartment_due_amount
    );
    if (!result) {
      return res.status(401).json({ error: "Apartment could not update" });
    }
    res.json({ result });
  } catch (error) {
    console.error("Apartment could not update");
    res.status(500).json({ error: "Apartment could not update." });
  }
}

async function getBlockInfoByApartmentId(req, res) {
  const { apartment_id } = req.query;

  try {
    const result = await Apartment.getBlockInfoByApartmentId(apartment_id);
    res.json({ result });
  } catch (error) {
    console.error("Blok bilgileri alınamadı.", error);
    res.status(400).json({ error: "Blok bilgileri alınamadı." });
  }
}

async function getUnitInfoByBlockId(req, res) {
  const { block_id } = req.query;

  try {
    const result = await Apartment.getUnitInfoByBlockId(block_id);
    res.json({ result });
  } catch (error) {
    console.error("Daire bilgileri alınamadı.", error);
    res.status(400).json({ error: "Daire bilgileri alınamadı." });
  }
}

module.exports = {
  createApartment,
  getApartment,
  getApartmentDetail,
  updateApartment,
  getBlockInfoByApartmentId,
  getUnitInfoByBlockId,
  getApartmentDetailById,
};
