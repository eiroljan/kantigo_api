const db = require("../config/db");

// Get All
exports.findAll = async () => {
  const [rows] = await db.execute(`
    SELECT 
      c.id,
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
