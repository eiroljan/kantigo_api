const Team = require("../models/team.model");

exports.create = async (req, res) => {
  try {
    const { competition_id, team_name, short_name } = req.body;

    if (!competition_id || !team_name || !short_name) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const id = await Team.create(req.body);
    res.status(201).json({ message: "Team created", id });

  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid competition_id" });
    }

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Team already exists" });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affected = await Team.update(req.params.id, req.body);

    if (!affected) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const affected = await Team.remove(req.params.id);

    if (!affected) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
