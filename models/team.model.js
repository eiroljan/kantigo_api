const db = require("../config/db");

exports.create = async (data) => {
  const sql = `
    INSERT INTO teams
    (competition_id, team_name, short_name, coach_name, assistant_coach, team_color, team_picture)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    data.competition_id,
    data.team_name,
    data.short_name,
    data.coach_name ?? null,
    data.assistant_coach ?? null,
    data.team_color ?? null,
    data.team_picture ?? null
  ]);

  return result.insertId;
};

exports.findAll = async () => {
  const [rows] = await db.execute(`
    SELECT *
    FROM teams
    ORDER BY team_name
  `);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM teams WHERE id = ?`,
    [id]
  );
  return rows[0];
};

exports.findByIdWithPlayers = async (teamId) => {
  const [rows] = await db.execute(
    `
    SELECT
    t.id AS team_id,
    t.competition_id,
    t.team_name,
    t.short_name,
    t.coach_name,
    t.assistant_coach,
    t.team_color,
    t.team_picture,
    t.created_at,

    p.id AS player_id,
    p.jersey,
    p.first_name,
    p.last_name,
    p.position,
    p.age,
    p.height,
    p.player_picture,
    p.active
    FROM teams t
    JOIN competitions c
      ON c.id = t.competition_id
    LEFT JOIN players p
      ON p.team_id = t.id
    AND p.competition_id = c.id
    WHERE t.id = ?
    ORDER BY p.jersey;
    `,
    [teamId]
  );

  return rows;
};





exports.update = async (id, data) => {
  const sql = `
    UPDATE teams SET
      team_name = ?,
      short_name = ?,
      coach_name = ?,
      assistant_coach = ?,
      team_color = ?,
      team_picture = ?
    WHERE id = ?
  `;

  const [result] = await db.execute(sql, [
    data.team_name,
    data.short_name,
    data.coach_name ?? null,
    data.assistant_coach ?? null,
    data.team_color ?? null,
    data.team_picture ?? null,
    id
  ]);

  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM teams WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};
