const { PaymentHistory } = require("../models/payment_history_model");

async function createPayment(req, res) {
  const {
    resident_id,
    apartment_id,
    amount,
    payment_date,
    payment_method,
    description,
    payment_type,
    debt_id,
    card_owner_name,
    card_number,
    card_exp_date,
    card_cvv,
    iban_number
  } = req.body;

  try {
    // payment history e gitmeden önce ilgili servise git, ilgili servisten dönen cevap true ise:
    const paymentHistoryResult = await PaymentHistory.create(
      resident_id,
      apartment_id,
      amount,
      payment_date,
      payment_method,
      description,
      payment_type,
      debt_id
    );

    if (!paymentHistoryResult) {
      res
        .status(500)
        .json({ error: "Getting error execution create payment history" });
    }

    res.json({ success: "true" });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
}

async function getPaymentHistory(req, res) {
  const { resident_id } = req.query;

  try {
    const result = await PaymentHistory.getPaymentHistoryById(resident_id);
    res.json({ result });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
}

module.exports = { createPayment, getPaymentHistory };
