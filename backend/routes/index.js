const express = require("express");
const ParentController = require("../controllers/parentController");
const ChoresController = require("../controllers/choresController");
const AssignmentController = require("../controllers/AssignmentController");
const router = express.Router();

//Insanity check
router.get("/", (request, response) => {
  response.status(200).json({ API: "Server running OK." });
});
//Users go here
router.get("/api/user", (request, response) => {
  ParentController.getAllParents(request, response);
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

router.delete("/api/user/:id", (request, response) => {
  ParentController.deleteParentById(request, response);
});
router.put("/api/user/:id", (request, response) => {
  ParentController.updateParent(request, response);
});

//Chores go here
router.post("/api/chore/create", (request, response) => {
  ChoresController.createChore(request, response);
});
router.get("/api/chore", (request, response) => {
  ChoresController.getChores(request, response);
});

//Assignments go here
router.post("/api/assignment/create", (request, response) => {
  AssignmentController.createAssignment(request, response);
});
router.get("/api/assignment", (request, response) => {
  AssignmentController.getAssignments(request, response);
});
module.exports = router;
