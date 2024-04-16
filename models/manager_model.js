const { client } = require("../middleware/database");

class Manager {
  constructor(
    manager_id,
    first_name,
    last_name,
    email,
    phone_number,
    photo,
    address,
    manager_role,
    record_status
  ) {
    this.manager_id = manager_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone_number = phone_number;
    this.photo = photo;
    this.address = address;
    this.manager_role = manager_role;
    this.record_status = record_status;
  }

  static async create(
    first_name,
    last_name,
    email,
    phone_number,
    photo,
    address,
    manager_role,
    record_status
  ) {
    const queryText =
      "INSERT INTO managers (first_name, last_name, email, phone_number, photo, address, manager_role, record_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING manager_id";
    const values = [
      first_name,
      last_name,
      email,
      phone_number,
      photo,
      address,
      manager_role,
      record_status,
    ];

    try {
      const result = await client.query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error executing create query: ", error);
    }
  }

  static async findByEmail(email) {
    const queryText =
      "SELECT * FROM managers WHERE email = $1 and record_status = $2";
    const values = [email, "A"];

    try {
      const result = await client.query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error executing findByEmail query: ", error);
    }
  }

  static async findById(id) {
    const queryText =
      "SELECT * FROM managers WHERE manager_id = $1 and record_status = $2";
    const values = [id, "A"];

    try {
      const result = await client.query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.log("Error getting manager by id: ", error);
    }
  }

  static async DeactiveAccount(manager_id) {
    const queryText =
      "UPDATE managers SET record_status = $1 WHERE manager_id = $2";
    const values = ["P", manager_id];

    try {
      await client.query(queryText, values);
      return true;
    } catch (error) {
      console.error("Error executing deactive query: ", error);
    }
  }

  static async UpdateManagerById(id, first_name, last_name, phone_number) {
    try {
      const updateFields = ["first_name", "last_name", "phone_number"];

      const updateValues = [first_name, last_name, phone_number];

      const queryText = `
                UPDATE managers 
                SET ${updateFields
                  .map((field, index) => `${field} = $${index + 1}`)
                  .join(", ")}
                WHERE manager_id = $${updateFields.length + 1} RETURNING *
            `;

      const values = [...updateValues, id];

      const result = await client.query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.error("Yönetici bilgileri güncellenirken hata oluştu: ", error);
    }
  }
}

module.exports = { Manager };
