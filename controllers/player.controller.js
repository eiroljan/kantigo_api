const Player = require("../models/player.model");

exports.getAll = async (req, res) => {
  try {
    const data = await Player.findAll(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Player.create(req.body);
    res.status(201).json({ message: "Player created", id });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid competition_id or team_id" });
    }
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Jersey number already exists for this team" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Player.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Player.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
