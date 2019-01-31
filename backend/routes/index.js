const express = require("express");
const ParentController = require("../controllers/parentController");
const ChoresController = require("../controllers/choresController");
const AssignmentController = require("../controllers/assignmentController");
const ActivityController = require("../controllers/ActivityController");
const  { authenticate }  = require("../authenticate")

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
router.get("api/user/logout", (request, response) => {
  ParentController.logoutParent(request, response);
})

//Chores go here
router.post("/api/chore/create", (request, response) => {
  ChoresController.createChore(request, response);
});
router.get("/api/chore", (request, response) => {
  ChoresController.getChoresByParent(request, response);
});
router.get("/api/chore/all", (request, response) => {
  ChoresController.getAllChores(request, response);
});

//Assignments go here
router.post("/api/assignment/create", authenticate, (request, response) => {
  AssignmentController.createAssignment(request, response);
});
router.get("/api/assignment/:username", authenticate, (request, response) => {
  AssignmentController.getAssignmentsByParent(request, response);
});
router.get("/api/assignment/all", (request, response) => {
  AssignmentController.getAllAssignments(request, response);
});
router.delete("/api/assignment/:_id", (request, response) => {
  AssignmentController.deleteAssignment(request, response);
});
router.put("/api/assignment/:_id", (request, response) => {
  AssignmentController.updateAssignment(request, response);
});

//Activities go here
router.post("/api/activity/create", authenticate, (request, response) => {
  ActivityController.createActivity(request, response);
});
router.get("/api/activity", authenticate, (request, response) => {
  ActivityController.getActivitiesByParent(request, response);
});
router.get("/api/activity/all", (request, response) => {
  ActivityController.getAllActivities(request, response);
});
router.put("/api/activity/:_id", (request, response) => {
  ActivityController.updateActivity(request, response);
});
router.delete("/api/activity/:_id", (request, response) => {
  ActivityController.deleteActivity(request, response);
});
module.exports = router;
