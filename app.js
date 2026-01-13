const express = require("express");
const app = express();

const db = require("../Api/config/db");

app.use(express.json());

app.use("/api/competitions", require("./routes/competitions"));
app.use("/api/teams", require("./routes/team"));
app.use("/api/matches", require("./routes/match"));
app.use("/api/players", require("./routes/player"));

app.get("/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ status: "OK", db: "connected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
