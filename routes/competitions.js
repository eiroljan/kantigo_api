const express = require("express");
const router = express.Router();
const controller = require("../controllers/competition.controller");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/:id/teams", controller.getTeams);
router.get("/:id/teams/players", controller.getTeamsAndPlayers);
router.get("/:id/teams/:teamId/players",controller.getTeamPlayers);


module.exports = router;
