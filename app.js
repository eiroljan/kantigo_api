const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/competitions", require("./routes/competitions"));
app.use("/api/teams", require("./routes/team"));
app.use("/api/matches", require("./routes/match"));
app.use("/api/players", require("./routes/player"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
