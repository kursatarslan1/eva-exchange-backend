const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resident } = require("../models/resident_model");
const { Password } = require("../models/password_model");
const { uploadPhoto } = require("../helpers/uploadPhoto");

async function register(req, res) {
  const {
    password,
    first_name,
    last_name,
    phone_number,
    apartment_id,
    block_id,
    unit_id,
    email,
    tenant,
    avatar,
    address,
  } = req.body;
  try {
    // E-posta adresiyle kullanıcı araması yap
    const existingUser = await Resident.findByEmail(email);

    // Eğer kullanıcı varsa, hata mesajı gönder
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    //
    let photo = await uploadPhoto(avatar[0].base64, avatar[0].path);
    //

    const userResult = await Resident.create(
      "P",
      first_name,
      last_name,
      phone_number,
      apartment_id,
      block_id,
      unit_id,
      email,
      tenant,
      photo,
      "A",
      address
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    await Password.create(userResult.resident_id, hashedPassword, "H");

    res.json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error register: " + error);
    res.status(500).json({ error: "User not created" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const resident = await Resident.findByEmail(email);

    if (!resident) {
      return res.status(401).json({ error: "Resident not found" });
    }

    const passwordRecord = await Password.findByUserId(
      resident.resident_id,
      "H"
    );

    if (!passwordRecord) {
      return res.status(401).json({ error: "Password error" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      passwordRecord.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Password error" });
    }

    const token = jwt.sign({ resident }, process.env.JWT_SECRET);

    res.json({ resident, token });
  } catch (error) {
    console.error("Login error: " + error);
    res.status(500).json({ error: "Login unsuccessful" });
  }
}

async function changePassword(req, res) {
  const { user_id, old_password, new_password } = req.body;

  try {
    const resident = await Resident.findById(user_id);

    if (!resident) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordRecord = await Password.findByUserId(
      resident.resident_id,
      "H"
    );
    const passwordMatch = await bcrypt.compare(
      old_password,
      passwordRecord.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await Password.changePassword(resident.resident_id, hashedPassword, "H");

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password: " + error);
    res.status(500).json({ error: "Password could not be changed" });
  }
}

async function getInformationByEmail(req, res) {
  const { email } = req.query;

  try {
    const result = await Resident.findByEmail(email);
    return res.json({ result });
  } catch (error) {
    console.error("Login error: " + error);
    res.status(500).json({ error: "Cannot get manager info" });
  }
}

async function getInformationByUnitId(req, res) {
  const { unit_id } = req.query;

  try {
    const result = await Resident.findByUnitId(unit_id);
    return res.json({ result });
  } catch (error) {
    console.log("Konut sakini bilgileri alınırken bir hata oluştu: ", error);
    res.status(500).json({ error: "Cannot get resident info" });
  }
}

async function getInformationByResidentId(req, res) {
  const { resident_id } = req.query;

  try {
    const result = await Resident.findByResidentId(resident_id);
    return res.json({ result });
  } catch (error) {
    console.log(
      "Resident bilgileri alınırken bir hata oluştu: (controller) ",
      error
    );
    res.status(500).json({ error: "Cannot get resident info" });
  }
}

async function deactive(req, res) {
  const { resident_id } = req.body;
  try {
    const resident = await Resident.DeactiveAccount(resident_id);

    if (!resident) {
      return res.status(401).json({ error: "Resident not found" });
    }

    res.json({ success: "true" });
  } catch (error) {
    console.error("Deactive error: " + error);
    res.status(500).json({ error: "Deactive account unsuccessful" });
  }
}

async function updateResident(req, res) {
  const {
    resident_id,
    first_name,
    last_name,
    phone_number,
    photo,
    country,
    city,
    state,
  } = req.body;

  try {
    const result = await Resident.UpdateResidentById(
      resident_id,
      first_name,
      last_name,
      phone_number,
      photo,
      country,
      city,
      state
    );
    if (!result) {
      return res.status(401).json({ error: "Resident could not update." });
    }
    res.json({ result });
  } catch (error) {
    console.error("Manager could not update.");
    res.status(500).json({ error: "Manager could not update." });
  }
}

async function GetAllResidentByApartmentId(req, res) {
  const { apartment_id } = req.query;

  try {
    const result = await Resident.GetAllResidentByApartmentId(apartment_id);
    res.json({ result });
  } catch (error) {
    console.error("Cannot get residents: ", error);
    res.status(500).json({ error: "Cannot get residents." });
  }
}

async function GetAllWaitingApprovalResidents(req, res) {
  const { apartment_id } = req.query;

  try {
    const result = await Resident.GetAllWaitingApprovalResidents(apartment_id);
    if (result) res.json({ result });
    else res.json({ success: "false" });
  } catch (error) {
    res.status(500).json({ error: "Cannot get residents." });
  }
}

async function ApproveResident(req, res) {
  const { resident_id } = req.body;

  try {
    const result = await Resident.ApproveResident(resident_id);
    if (result) res.json({ success: "true" });
    else res.json({ success: "false" });
  } catch (error) {
    res.status(500).json({ error: "Cannot approve resident." });
  }
}

async function RejectResident(req, res) {
  const { resident_id } = req.body;

  try {
    const result = await Resident.RejectResident(resident_id);
    if (result) res.json({ success: "true" });
    else res.json({ success: "false" });
  } catch (error) {
    res.status(500).json({ error: "Cannot reject resident." });
  }
}

module.exports = {
  login,
  register,
  deactive,
  getInformationByEmail,
  updateResident,
  GetAllResidentByApartmentId,
  GetAllWaitingApprovalResidents,
  ApproveResident,
  RejectResident,
  getInformationByUnitId,
  getInformationByResidentId,
  changePassword,
};
