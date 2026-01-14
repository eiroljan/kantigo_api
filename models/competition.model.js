const db = require("../config/db");

// Get All
exports.findAll = async () => {
  const [rows] = await db.execute(`
    SELECT 
      c.id,
      c.organizer_id,
      c.competition_name,
      c.competition_date,
      c.venue,
      c.competition_picture
    FROM competitions c
  `);
  return rows;
};

// Get By Id
exports.findById = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT 
      c.id,
      c.organizer_id,
      c.competition_name,
      c.competition_date,
      c.venue,
      c.competition_picture
    FROM competitions c
    WHERE c.id = ?
    `,
    [id]
  );

  return rows[0];
};

exports.findTeamsByCompetitionId = async (competitionId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      competition_id,
      team_name,
      short_name,
      coach_name,
      assistant_coach,
      team_color,
      team_picture,
      created_at
    FROM teams
    WHERE competition_id = ?
    ORDER BY team_name
    `,
    [competitionId]
  );

  return rows;
};


exports.findTeamsAndPlayersByCompetitionId = async (competitionId) => {
  const [rows] = await db.execute(
    `
    SELECT
      t.id AS team_id,
      t.team_name,
      t.short_name,
      t.coach_name,
      t.assistant_coach,
      t.team_color,
      t.team_picture,

      p.id AS player_id,
      p.jersey,
      p.first_name,
      p.last_name,
      p.age,
      p.height,
      p.position,
      p.player_picture,
      p.active
    FROM teams t
    LEFT JOIN players p ON p.team_id = t.id
    WHERE t.competition_id = ?
    ORDER BY t.team_name, p.jersey
    `,
    [competitionId]
  );

  return rows;
};

exports.findPlayersByCompetitionAndTeam = async (competitionId, teamId) => {
  const [rows] = await db.execute(
    `
    SELECT
      p.id,
      p.team_id,
      p.jersey,
      p.first_name,
      p.last_name,
      p.age,
      p.height,
      p.position,
      p.player_picture,
      p.active
    FROM players p
    JOIN teams t ON t.id = p.team_id
    WHERE t.competition_id = ?
      AND t.id = ?
    ORDER BY p.jersey
    `,
    [competitionId, teamId]
  );

  return rows;
};








// Create
exports.create = async (data) => {
  const sql = `
    INSERT INTO competitions
    (organizer_id, competition_name, competition_date, venue, competition_picture)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    data.organizer_id,
    data.competition_name,
    data.competition_date,
    data.venue,
    data.competition_picture ?? null
  ]);

  return result.insertId;
};

// ✅ Update
exports.update = async (id, data) => {
  const sql = `
    UPDATE competitions SET
      organizer_id = ?,
      competition_name = ?,
      competition_date = ?,
      venue = ?,
      competition_picture = ?
    WHERE id = ?
  `;

  const [result] = await db.execute(sql, [
    data.organizer_id,
    data.competition_name,
    data.competition_date,
    data.venue,
    data.competition_picture ?? null,
    id
  ]);

  return result.affectedRows;
};

// ✅ Delete
exports.remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM competitions WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};
