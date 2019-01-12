const express = require("express");
const ParentController = require("../controllers/parentController");
const router = express.Router();


//Insanity check
router.get("/", (request, response) => {
    response.status(200).json({ API: "Server running OK." });
  });

  router.post("/api/user/register", (request, response) => {
    ParentController.register(request, response);
  });

  router.post("/api/user/login", (request, response) => {
    ParentController.login(request, response);
  });

  router.post("/api/user/:id", (request, response) => {
    ParentController.getParentById(request, response);
  });

  router.post("/api/user/:id", (request, response) => {
    ParentController.deleteParentById(request, response);
  });
module.exports = router;