const { client } = require("../middleware/database");

class PaymentHistory {
  constructor(
    payment_id,
    resident_id,
    apartment_id,
    amount,
    payment_date,
    payment_method,
    description,
    payment_type
  ) {
    this.payment_id = payment_id;
    this.resident_id = resident_id;
    this.apartment_id = apartment_id;
    this.amount = amount;
    this.payment_date = payment_date;
    this.payment_method = payment_method;
    this.description = description;
    this.payment_type = payment_type;
  }

  static async create(
    resident_id,
    apartment_id,
    amount,
    payment_date,
    payment_method,
    description,
    payment_type,
    debt_id
  ) {
    const queryText =
      "INSERT INTO payment_history (resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING payment_id";
    const values = [
      resident_id,
      apartment_id,
      amount,
      new Date(),
      payment_method,
      description,
      payment_type,
    ];

    try {
      const result = await client.query(queryText, values);
      if (result) {
        const updateDebt = "UPDATE debt SET status = $1 WHERE debt_id = $2;";
        const values = ["Payed", debt_id];

        const updateDebtResult = await client.query(updateDebt, values);
        if (!updateDebtResult) {
          const deletePayment =
            "DELETE FROM payment_history WHERE payment_id = $1;";
          await client.query(deletePayment, [result.payment_id]);
          return false;
        }
        return true;
      } else return false;
    } catch (error) {
      console.error("Error creating debt: ", error);
    }
  }

  static async getPaymentHistoryById(resident_id) {
    const queryText = "SELECT * FROM payment_history WHERE resident_id = $1";
    const values = [resident_id];

    try {
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.error("Error getting payment history: ", error);
    }
  }
}

module.exports = { PaymentHistory };
