const { client } = require("../middleware/database");

class PeriodicPayments {
  constructor(
    period_id,
    apartment_id,
    unit_id,
    period_name,
    start_date,
    end_date,
    description,
    amount
  ) {
    this.period_id = period_id;
    this.apartment_id = apartment_id;
    this.unit_id = unit_id;
    this.period_name = period_name;
    this.start_date = start_date;
    this.end_date = end_date;
    this.description = description;
    this.amount = amount;
  }

  static async create(
    apartment_id,
    unit_id,
    period_name,
    start_date,
    end_date,
    description,
    amount
  ) {
    const queryText =
      "INSERT INTO payment_periods (apartment_id, unit_id, period_name, start_date, end_date, description, amount) VALUES($1, $2, $3, $4, $5, $6, $7);";
    const values = [apartment_id, unit_id, period_name, start_date, end_date, description, amount];

    try {
      await client.query(queryText, values);
      return true;
    } catch (error) {
      console.log("Error creating periodic payments: ", error);
      return false;
    }
  }

  static async getPeriodicPayments(apartment_id) {
    const queryText = "SELECT * FROM payment_periods WHERE apartment_id = $1;";

    try {
      const result = await client.query(queryText, [apartment_id]);
      return result.rows;
    } catch (error) {
      console.log("Error getting periodic payments");
      return false;
    }
  }

  static async deletePeriodicPayment(period_id) {
    const queryText = "DELETE FROM payment_periods WHERE period_id = $1;";

    try {
      await client.query(queryText, [period_id]);
      return true;
    } catch (error) {
      console.log("Error deleting periodic payment: ", error);
      return false;
    }
  }
}

module.exports = { PeriodicPayments };
