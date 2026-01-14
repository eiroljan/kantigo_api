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

// Get match full details by match_key
exports.findByMatchKey = async (matchKey) => {
  const [rows] = await db.execute(
    `
    SELECT
      m.id AS match_id,
      m.match_key,

      home.id AS home_team_id,

      away.id AS away_team_id,

      p.id AS player_id,
      p.team_id,
      p.jersey,
      p.first_name,
      p.last_name,
      p.position

    FROM matches m
    JOIN teams home ON home.id = m.home_team_id
    JOIN teams away ON away.id = m.away_team_id
    LEFT JOIN players p
      ON p.team_id IN (m.home_team_id, m.away_team_id)

    WHERE m.match_key = ?
    ORDER BY p.team_id, p.jersey
    `,
    [matchKey]
  );

  if (!rows.length) return null;

  const match = {
    match_id: rows[0].match_id,
    match_key: rows[0].match_key,
    home: {
      id: rows[0].home_team_id,
      name: rows[0].home_team_name,
      players: []
    },
    away: {
      id: rows[0].away_team_id,
      name: rows[0].away_team_name,
      players: []
    }
  };

  for (const r of rows) {
    if (!r.player_id) continue;

    const player = {
      id: r.player_id,
      jersey: r.jersey,
      first_name: r.first_name,
      last_name: r.last_name,
      position: r.position
    };

    if (r.team_id === match.home.id) {
      match.home.players.push(player);
    } else if (r.team_id === match.away.id) {
      match.away.players.push(player);
    }
  }

  return match;
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
