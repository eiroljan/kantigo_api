const Match = require("../models/match.model");

exports.getAll = async (req, res) => {
  try {
    const data = await Match.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await Match.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Match.create(req.body);
    res.status(201).json({ message: "Match created", id });
  } catch (err) {
    if (
      err.code === "ER_NO_REFERENCED_ROW_2" ||
      err.code === "ER_DUP_ENTRY"
    ) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affected = await Match.update(req.params.id, req.body);

    if (!affected) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ message: "Match updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const affected = await Match.remove(req.params.id);

    if (!affected) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ message: "Match deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
