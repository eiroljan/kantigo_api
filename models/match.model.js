const db = require("../config/db");

// Get all matches
exports.findAll = async () => {
  const [rows] = await db.execute(`
    SELECT 
      m.id,
      m.match_key,
      m.competition_id,
      m.home_team_id,
      m.away_team_id,
      m.match_date,
      m.match_time,
      m.created_at
    FROM matches m
    ORDER BY m.match_date, m.match_time
  `);
  return rows;
};

// Get match by ID
exports.findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM matches WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// Create match
exports.create = async (data) => {
  const sql = `
    INSERT INTO matches
    (match_key, competition_id, home_team_id, away_team_id, match_date, match_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    data.match_key,
    data.competition_id,
    data.home_team_id,
    data.away_team_id,
    data.match_date,
    data.match_time
  ]);

  return result.insertId;
};

// Update match
exports.update = async (id, data) => {
  const sql = `
    UPDATE matches SET
      match_key = ?,
      competition_id = ?,
      home_team_id = ?,
      away_team_id = ?,
      match_date = ?,
      match_time = ?
    WHERE id = ?
  `;

  const [result] = await db.execute(sql, [
    data.match_key,
    data.competition_id,
    data.home_team_id,
    data.away_team_id,
    data.match_date,
    data.match_time,
    id
  ]);

  return result.affectedRows;
};

// Delete match
exports.remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM matches WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};
