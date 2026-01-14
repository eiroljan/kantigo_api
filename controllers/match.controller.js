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

exports.getMatchByKey = async (req, res) => {
  try {
    const { match_key } = req.params;

    console.log("MATCH KEY:", match_key);

    const match = await Match.findByMatchKey(match_key);

    res.json(match);
  } catch (err) {
    console.error("❌ ERROR STACK:", err);
    console.error("❌ ERROR MESSAGE:", err.message);
    console.error("❌ ERROR CODE:", err.code);

    res.status(500).json({
      message: "Server error",
      error: err.message,
      code: err.code
    });
  }
};


// exports.getMatchByKey = async (req, res) => {
//   try {
//     console.log("PARAMS:", req.params);

//     const { match_key } = req.params;

//     const match = await Match.findByMatchKey(match_key);

//     if (!match) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.json(match);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



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
