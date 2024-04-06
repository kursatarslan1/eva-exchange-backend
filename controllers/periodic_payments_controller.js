const { PeriodicPayments } = require("../models/periodic_payments_model");

async function createPeriodicPayment(req, res) {
  const { apartment_id, unit_id, period_name, start_date, end_date, description, amount } = req.body;

  try {
    const periodicRes = await PeriodicPayments.create(
      apartment_id,
      unit_id,
      period_name,
      start_date,
      end_date,
      description,
      amount
    );
    if (!periodicRes) {
      res.status(401).json({ success: false });
    }
    res.json({ success: true });
  } catch (error) {
    console.log("Error creating periodic payment: ", error);
    res.status(500).json({ success: false });
  }
}

async function getPeriodicPayments(req, res) {
  const { apartment_id } = req.query;

  try {
    const result = await PeriodicPayments.getPeriodicPayments(apartment_id);
    res.json({ result });
  } catch (error) {
    console.log("Error getting periodic payments: ", error);
  }
}

async function deletePeriodicPayment(req, res) {
  const { period_id } = req.query;

  try {
    await PeriodicPayments.deletePeriodicPayment(period_id);
    res.json({ success: true });
  } catch (error) {
    console.log("Error deleting periodic payment: ", error);
    res.json({ success: false });
  }
}

module.exports = {
  createPeriodicPayment,
  getPeriodicPayments,
  deletePeriodicPayment,
};
