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

exports.getTeams = async (req, res) => {
  try {
    const competitionId = req.params.id;

    const teams = await Competition.findTeamsByCompetitionId(competitionId);

    if (!teams.length) {
      return res.status(404).json({
        message: "No teams found for this competition"
      });
    }

    res.json({
      competition_id: Number(competitionId),
      teams
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeamsAndPlayers = async (req, res) => {
  try {
    const competitionId = Number(req.params.id);

    const rows = await Competition.findTeamsAndPlayersByCompetitionId(competitionId);

    if (!rows.length) {
      return res.status(404).json({ message: "No teams found for this competition" });
    }

    // 🔁 Group data
    const teamsMap = {};

    rows.forEach(row => {
      if (!teamsMap[row.team_id]) {
        teamsMap[row.team_id] = {
          id: row.team_id,
          team_name: row.team_name,
          short_name: row.short_name,
          coach_name: row.coach_name,
          assistant_coach: row.assistant_coach,
          team_color: row.team_color,
          team_picture: row.team_picture,
          players: []
        };
      }

      if (row.player_id) {
        teamsMap[row.team_id].players.push({
          id: row.player_id,
          jersey_number: row.jersey_number,
          first_name: row.first_name,
          last_name: row.last_name,
          position: row.position,
          player_picture: row.player_picture,
          active: row.active
        });
      }
    });

    res.json({
      competition_id: competitionId,
      teams: Object.values(teamsMap)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeamPlayers = async (req, res) => {
  try {
    const competitionId = Number(req.params.id);
    const teamId = Number(req.params.teamId);

    const players = await Competition.findPlayersByCompetitionAndTeam(
      competitionId,
      teamId
    );

    if (!players.length) {
      return res.status(404).json({
        message: "No players found for this team in the competition"
      });
    }

    res.json({
      competition_id: competitionId,
      team_id: teamId,
      players
    });
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
