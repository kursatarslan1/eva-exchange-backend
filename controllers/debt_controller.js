const { Debt } = require("../models/debt_model");

async function create(req, res) {
  const {
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
  } = req.body;

  try {
    const debtRes = await Debt.create(
      resident_id,
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

    if (!debtRes) {
      console.error("Request or complaints creation failed");
    }
    res.json({ success: "true" });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
}

async function massDebitCreate(req, res) {
  const {
    apartment_id,
    description,
    debit_type,
    last_payment_date,
    amount,
    include_empty_units,
  } = req.body;

  try {
    const massDebtRes = await Debt.massDebitCreate(
      apartment_id,
      description,
      debit_type,
      last_payment_date,
      amount,
      include_empty_units
    );
    if (massDebtRes) {
      res.json({ success: "true" });
    }
  } catch (error) {
    console.log(
      "toplu borçlandırma yapılırken bir hata ile karşılaşıldı: ",
      error
    );
  }
}

async function getNotPayedDebts(req, res) {
  const { unit_id } = req.query;

  try {
    const result = await Debt.getNotPayedDebtsByUnitId(unit_id);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getPayedDebts(req, res) {
  const { unit_id } = req.query;

  try {
    const result = await Debt.getPayedDebtsByUnitId(unit_id);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getDebtList(req, res) {
  const { resident_id } = req.query;

  try {
    const result = await Debt.getDebtListByResidentId(resident_id);
    res.json({ result });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
}

async function updateDebt(req, res) {
  const { debt_id } = req.query;

  try {
    await Debt.PayDebt(debt_id);
    res.json({ message: "Update debt. " });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
}

async function totalExpectedRevenue(req, res) {
  const { apartment_id, year, month } = req.query;

  try {
    const result = await Debt.TotalExpectedRevenue(month, year, apartment_id);
    if (!result) {
      res.status(500).json({ success: false });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function totalRevenue(req, res) {
  const { apartment_id, year, month } = req.query;

  try {
    const result = await Debt.TotalRevenue(month, year, apartment_id);
    if (!result) {
      res.status(500).json({ success: false });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getDebtUserList(req, res) {
  const { date, apartment_id } = req.query;

  try {
    const result = await Debt.getDebtUserList(date, apartment_id);
    if (!result) {
      res.status(500).json({ success: false });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getUnitDebtList(req, res) {
  const { apartment_id,date  } = req.query;

  try {
    const result = await Debt.getUnitDebtList(date, apartment_id);
    if (!result) {
      res.status(500).json({ success: false });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

module.exports = {
  create,
  getDebtList,
  updateDebt,
  massDebitCreate,
  totalExpectedRevenue,
  totalRevenue,
  getDebtUserList,
  getNotPayedDebts,
  getPayedDebts,
  getUnitDebtList,
};
