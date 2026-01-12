const Competition = require("../models/competition.model");

exports.getAll = async (req, res) => {
  try {
    const data = await Competition.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await Competition.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.create = async (req, res) => {
  try {
    const id = await Competition.create(req.body);
    res.status(201).json({ message: "Competition created", id });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid organizer_id" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affected = await Competition.update(req.params.id, req.body);

    if (!affected) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.json({ message: "Competition updated" });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid organizer_id" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const affected = await Competition.remove(req.params.id);

    if (!affected) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.json({ message: "Competition deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
