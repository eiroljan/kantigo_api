const db = require("../config/db");

// Get players with optional filters
exports.findAll = async ({ team_name, competition_id, competition_name }) => {
  let sql = `
    SELECT 
      p.id,
      p.jersey,
      p.first_name,
      p.last_name,
      p.position,
      p.age,
      p.height,
      p.player_picture,
      p.active,
      t.team_name,
      c.competition_name
    FROM players p
    JOIN teams t ON t.id = p.team_id
    JOIN competitions c ON c.id = p.competition_id
    WHERE 1=1
  `;

  const params = [];

  if (team_name) {
    sql += ` AND t.team_name = ?`;
    params.push(team_name);
  }

  if (competition_id) {
    sql += ` AND p.competition_id = ?`;
    params.push(competition_id);
  }

  if (competition_name) {
    sql += ` AND c.competition_name = ?`;
    params.push(competition_name);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};


// Get player by ID
exports.findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM players WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// Create player
exports.create = async (data) => {
  const [result] = await db.execute(
    `
    INSERT INTO players
    (competition_id, team_id, jersey, first_name, last_name, age, height, position, player_picture, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.competition_id,
      data.team_id,
      data.jersey,
      data.first_name,
      data.last_name,
      data.age || null,
      data.height || null,
      data.position || null,
      data.player_picture || null,
      data.active ?? 1
    ]
  );
  return result.insertId;
};

// Update player
exports.update = async (id, data) => {
  const [result] = await db.execute(
    `
    UPDATE players SET
      competition_id = ?,
      team_id = ?,
      jersey = ?,
      first_name = ?,
      last_name = ?,
      age = ?,
      height = ?,
      position = ?,
      player_picture = ?,
      active = ?
    WHERE id = ?
    `,
    [
      data.competition_id,
      data.team_id,
      data.jersey,
      data.first_name,
      data.last_name,
      data.age || null,
      data.height || null,
      data.position || null,
      data.player_picture || null,
      data.active ?? 1,
      id
    ]
  );
  return result.affectedRows;
};

// Delete player
exports.remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM players WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};
