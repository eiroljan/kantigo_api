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
        -- Match
        m.id AS match_id,
        m.match_key,
        m.match_date,
        m.match_time,

        -- Competition
        c.id AS competition_id,
        c.organizer_id,
        c.competition_name,
        c.competition_date,
        c.venue AS competition_venue,
        c.competition_picture,

        -- Home team
        home.id AS home_team_id,
        home.team_name AS home_team_name,
        home.short_name AS home_short_name,
        home.coach_name AS home_coach,
        home.assistant_coach AS home_assistant_coach,
        home.team_color AS home_team_color,
        home.team_picture AS home_team_picture,

        -- Away team
        away.id AS away_team_id,
        away.team_name AS away_team_name,
        away.short_name AS away_short_name,
        away.coach_name AS away_coach,
        away.assistant_coach AS away_assistant_coach,
        away.team_color AS away_team_color,
        away.team_picture AS away_team_picture,

        -- Players
        p.id AS player_id,
        p.team_id,
        p.jersey,
        p.first_name,
        p.last_name,
        p.age,
        p.height,
        p.position,
        p.player_picture,
        p.active

      FROM matches m
      JOIN competitions c ON c.id = m.competition_id
      JOIN teams home ON home.id = m.home_team_id
      JOIN teams away ON away.id = m.away_team_id
      LEFT JOIN players p
        ON p.team_id IN (m.home_team_id, m.away_team_id)
        AND p.competition_id = m.competition_id

      WHERE m.match_key = ?
      ORDER BY p.team_id, p.jersey
      `,
      [matchKey]
    );

    if (!rows.length) return null;


    const match = {
      id: rows[0].match_id,
      match_key: rows[0].match_key,
      match_date: rows[0].match_date,
      match_time: rows[0].match_time,

      competition: {
        id: rows[0].competition_id,
        organizer_id: rows[0].organizer_id,
        name: rows[0].competition_name,
        date: rows[0].competition_date,
        venue: rows[0].competition_venue,
        picture: rows[0].competition_picture
      },

      home: {
        id: rows[0].home_team_id,
        name: rows[0].home_team_name,
        short_name: rows[0].home_short_name,
        coach: rows[0].home_coach,
        assistant_coach: rows[0].home_assistant_coach,
        color: rows[0].home_team_color,
        picture: rows[0].home_team_picture,
        players: []
      },

      away: {
        id: rows[0].away_team_id,
        name: rows[0].away_team_name,
        short_name: rows[0].away_short_name,
        coach: rows[0].away_coach,
        assistant_coach: rows[0].away_assistant_coach,
        color: rows[0].away_team_color,
        picture: rows[0].away_team_picture,
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
        age: r.age,
        height: r.height,
        position: r.position,
        picture: r.player_picture,
        active: r.active
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
