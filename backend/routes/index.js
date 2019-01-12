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
module.exports = router;