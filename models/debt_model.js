const { client } = require("../middleware/database");

class Debt {
  constructor(
    debt_id,
    resident_id,
    apartment_id,
    block_id,
    unit_id,
    amount,
    created_at,
    payment_date,
    last_payment_date,
    description,
    status,
    debit_type
  ) {
    this.debt_id = debt_id;
    this.resident_id = resident_id;
    this.apartment_id = apartment_id;
    this.block_id = block_id;
    this.unit_id = unit_id;
    this.amount = amount;
    this.created_at = created_at;
    this.payment_date = payment_date;
    this.last_payment_date = last_payment_date;
    this.description = description;
    this.status = status;
    this.debit_type = debit_type;
  }

  static async create(
    resident_id,
    apartment_id,
    block_id,
    unit_id,
    amount,
    created_at,
    payment_date,
    last_payment_date,
    description,
    status,
    debit_type
  ) {
    const queryText =
      "INSERT INTO debt (resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
    const values = [
      resident_id,
      apartment_id,
      block_id,
      unit_id,
      amount,
      created_at,
      payment_date,
      last_payment_date,
      description,
      status,
      debit_type,
    ];

    try {
      await client.query(queryText, values);
      return true;
    } catch (error) {
      console.error("Error creating debt: ", error);
    }
  }

  static async checkPayedDebt(unit_id, status, debit_type) {
    const queryText = `
        SELECT 
          CASE 
            WHEN 
              COUNT(*) > 0 THEN 'true'
            ELSE 'false'
          END AS result
        FROM 
          debt
        WHERE 
          unit_id = $1 
          AND debit_type = $2 
          AND status = $3
          AND payment_date >= CURRENT_DATE + INTERVAL '1 month';
      `;
    const values = [unit_id, debit_type, status];

    try {
      const result = await client.query(queryText, values);
      if (result.rows[0].result == "true") return true;
      else return false;
    } catch (error) {
      console.log("Error getting payed debts: ", error);
    }
  }

  static async massDebitCreate(
    apartment_id,
    description,
    debit_type,
    last_payment_date,
    amount,
    include_empty_units
  ) {
    try {
      if (include_empty_units) {
        const queryText =
          "SELECT block_id, unit_id FROM units WHERE apartment_id = $1";
        const queryResult = await client.query(queryText, [apartment_id]);

        for (const row of queryResult.rows) {
          const block_id = row.block_id;
          const unit_id = row.unit_id;

          // check payed debts
          const result = await this.checkPayedDebt(
            unit_id,
            "Payed",
            debit_type
          );

          if (!result) {
            const created_at = new Date();
            const payment_date = null;

            await this.create(
              null,
              apartment_id,
              block_id,
              unit_id,
              amount,
              created_at,
              payment_date,
              last_payment_date,
              description,
              "Not pay",
              debit_type
            );
          } else continue;
        }
      } else {
        const queryText =
          "SELECT block_id, unit_id FROM units WHERE apartment_id = $1 AND is_using = $2";
        const values = [apartment_id, "E"];

        const queryResult = await client.query(queryText, values);

        for (const row of queryResult.rows) {
          const block_id = row.block_id;
          const unit_id = row.unit_id;

          // check payed debts
          const result = await this.checkPayedDebt(
            unit_id,
            "Payed",
            debit_type
          );

          if (!result) {
            const created_at = new Date();
            const payment_date = null;

            await this.create(
              null,
              apartment_id,
              block_id,
              unit_id,
              amount,
              created_at,
              payment_date,
              last_payment_date,
              description,
              "Not pay",
              debit_type
            );
          } else continue;
        }
      }
      return true;
    } catch (error) {
      console.error("Error creating mass debt: ", error);
      return false;
    }
  }

  static async getNotPayedDebtsByUnitId(unit_id) {
    const queryText = "SELECT * FROM debt WHERE unit_id = $1 AND status = $2;";
    const values = [unit_id, "Not pay"];

    try {
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.log("Error getting debt list by unit id: ", error);
    }
  }

  static async getPayedDebtsByUnitId(unit_id) {
    const queryText = "SELECT * FROM debt WHERE unit_id = $1 AND status = $2;";
    const values = [unit_id, "Payed"];

    try {
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.log("Error getting debt list by unit id: ", error);
    }
  }

  static async getDebtListByResidentId(resident_id) {
    const queryText = "SELECT * FROM debt WHERE resident_id = $1";
    const values = [resident_id];

    try {
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.error("Error getting debt list: ", error);
    }
  }

  static async PayDebt(debt_id) {
    try {
      const query = `
                UPDATE debt
                SET status = $1
                WHERE debt_id = $2
            `;
      const values = ["Payed", debt_id];
      await client.query(query, values);
      return true;
    } catch (error) {
      console.error("Error updating debt:", error);
    }
  }

  static async TotalExpectedRevenue(month, year, apartment_id) {
    try {
      const queryText = `SELECT sum(amount) as total_expected_revenue
            FROM debt
            WHERE EXTRACT(MONTH FROM created_at) = $1
              AND EXTRACT(YEAR FROM created_at) = $2
              AND apartment_id = $3`;
      const values = [month, year, apartment_id];

      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.log("Error getting total expected revenue: ", error);
    }
  }

  static async TotalRevenue(month, year, apartment_id) {
    try {
      const queryText = `SELECT sum(amount) as total_expected_revenue
            FROM debt
            WHERE EXTRACT(MONTH FROM created_at) = $1
              AND EXTRACT(YEAR FROM created_at) = $2
              AND apartment_id = $3
              AND status = $4`;
      const values = [month, year, apartment_id, "Payed"];

      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.log("Error getting total expected revenue: ", error);
    }
  }

  static async getDebtUserList(date, apartment_id) {
    try {
      const queryText = `SELECT *
      FROM residents
      INNER JOIN debt ON residents.block_id = debt.block_id 
          AND residents.unit_id = debt.unit_id
      WHERE residents.status = $1 
          AND residents.record_status = $2 
          AND residents.apartment_id = $3
          AND date_trunc('month', debt.payment_date) = date_trunc('month', $4::timestamp)
          OR date_trunc('month', debt.created_at) = date_trunc('month', $4::timestamp)`;
      const values = ["A", "A", apartment_id, date];

      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.log("Error getting user debt list: ", error);
    }
  }

  static async getUnitDebtList(date, apartment_id) {
    try {
      const queryText = `SELECT * FROM debt WHERE apartment_id = $1 AND date_trunc('month', debt.payment_date) = date_trunc('month', $2::timestamp)
      OR date_trunc('month', debt.created_at) = date_trunc('month', $2::timestamp)`;
      const result = await client.query(queryText, [apartment_id, date]);
      return result.rows;
    } catch (error) {
      console.log("Error getting unit debt list: ", error);
    }
  }
}

module.exports = { Debt };
