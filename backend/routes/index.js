const express = require("express");
const ParentController = require("../controllers/parentController");
const ChoresController = require("../controllers/choresController");
const AssignmentController = require("../controllers/assignmentController");
const ActivityController = require("../controllers/activityController");
const MemberController = require("../controllers/memberController");
const  { authenticate }  = require("../services/authenticate")

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
router.get("/api/user/family/:username", authenticate, (request, response) => {
  ParentController.getAllFamilyMembers(request, response);
})

//Chores go here
router.post("/api/chore/create", (request, response) => {
  ChoresController.createChore(request, response);
});
router.get("/api/chore/:username", (request, response) => {
  ChoresController.getChores(request, response);
});
router.get("/api/chore/all", (request, response) => {
  ChoresController.getAllChores(request, response);
});
router.delete("/api/chore/deletechore/:_id", (request, response) => {
  ChoresController.deleteChore(request, response);
});

//Assignments go here
router.post("/api/assignment/create", authenticate, (request, response) => {
  AssignmentController.createAssignment(request, response);
});
router.get("/api/assignment/:username", authenticate, (request, response) => {
  AssignmentController.getAssignments(request, response);
});
router.get("/api/assignment/all", (request, response) => {
  AssignmentController.getAllAssignments(request, response);
});
router.delete("/api/assignment/:_id",  authenticate, (request, response) => {
  AssignmentController.deleteAssignment(request, response);
});
router.put("/api/assignment/:_id", (request, response) => {
  AssignmentController.updateAssignment(request, response);
});

//Activities go here
router.post("/api/activity/create", authenticate, (request, response) => {
  ActivityController.createActivity(request, response); 
});
router.get("/api/activity/get/primary/:username", authenticate, (request, response) => {
  ActivityController.getActivityForPrimaryAccount(request, response);
});
router.get("/api/activity/get/member/:username", authenticate, (request, response) => {
  ActivityController.getActivityForMember(request, response);
});
router.get("/api/activity/all", (request, response) => {
  ActivityController.getAllActivities(request, response);
});
router.put("/api/activity/edit/:_id", (request, response) => {
  ActivityController.updateActivity(request, response);
});
router.delete("/api/activity/delete/:_id", authenticate, (request, response) => {
  ActivityController.deleteActivity(request, response);
});
router.put("/api/activity/add_member_to_activity/:_id", (request, response) => {
  ActivityController.addMemberToActivity(request, response);
});
//Members go here
router.post("/api/member/create", authenticate, (request, response) => {
  MemberController.createMember(request, response); 
});
router.get("/api/member/get/:id", (request, response) => {
  MemberController.getMember(request, response); 
});
router.put("/api/member/update/:username", authenticate, (request, response) => {
  MemberController.updateMember(request, response); 
});
router.put("/api/member/resetpassword/:id", authenticate, (request, response) => {
  MemberController.resetPassword(request, response); 
});
router.post("/api/member/login", (request, response) => {
  MemberController.logInMember(request, response); 
});
router.get("/api/member/family/:username", authenticate,(request, response) => {
  MemberController.getAllMembers(request, response); 
});
router.delete("/api/member/:id", authenticate,(request, response) => {
  MemberController.deleteMember(request, response); 
});
module.exports = router;
