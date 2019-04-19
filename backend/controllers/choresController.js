const Chores = require("../models/chores");
const Parent = require("../models/parent");
const Member = require("../models/member");

const mongoose = require("mongoose");

const createChore = (request, response) => {
  const { title, username, name } = request.body;
  //console.log("Giving jwt", request.jwtObj);
  //if (request.jwtObj) {
  let personId = "";
  Parent.findOne({ username: username })
    .then(user => {
      Parent.findOne({ name: name })
        .then(parent => {
          Member.findOne({ name: name })
            .then(member => {
              console.log("Found Member", member);
              //Only create a chore if a member exists with the provided name
              if (parent) {
                personId = parent._id;
              } else if (member) {
                personId = member._id;
              }
              if (personId) {
                const chore = new Chores({
                  _id: new mongoose.Types.ObjectId(),
                  title,
                  parentId: user._id,
                  createdFor: personId
                });
                chore
                  .save()
                  .then(savechore => {
                    const id = savechore._id;
                    Parent.findOneAndUpdate(
                      { username: username },
                      { $push: { choresIds: id } }
                    )
                      .then(user => {
                        response.status(200).json(savechore);
                      })
                      .catch(err => {
                        response.status(500).json({
                          errorMessage: "Error pushing chores onto Parent",
                          err
                        });
                      });
                  })
                  .catch(err => {
                    response
                      .status(500)
                      .json({ errorMessage: "Error saving chore", err });
                  });
              } else {
                response
                  .status(404)
                  .json({
                    errorMessage: "Could not find a member by that name"
                  });
              }
            })
            .catch(err => {
              console.log("Error here", err);
              response.status(404).json({
                errorMessage: "Could not find a member by that name",
                err
              });
            });
        })
        .catch(err => {
          console.log("Error here", err);
          response
            .status(500)
            .json({ errorMessage: "Error creating chore", err });
        });
    })
    .catch(err => {
      console.log("Error here", err);
      response.status(500).json({ errorMessage: "Error creating chore", err });
    });
  // } else {
  //   response.status(422).json({ errorMessage: "User Not Logged In" });
  // }
};

const getChores = (request, response) => {
  const { username } = request.params;
  Parent.findOne({ username: username })
    .then(parent => {
      Member.findOne({ username: username })
        .then(member => {
          if (parent) {
            Member.find({
              parentId: parent._id
            })
              .then(members => {
                Chores.find({ parentId: parent._id })
                  .then(foundChores => {
                    for (let j = 0; j < foundChores.length; j++) {
                      if (
                        parent._id.toString() ===
                        foundChores[j].createdFor.toString()
                      ) {
                        parent.chores.push(foundChores[j]);
                      }
                    }
                    for (let i = 0; i < members.length; i++) {
                      for (let j = 0; j < foundChores.length; j++) {
                        if (
                          members[i]._id.toString() ===
                          foundChores[j].createdFor.toString()
                        ) {
                          members[i].chores.push(foundChores[j]);
                        }
                      }
                    }
                    members.push(parent);
                    response.status(200).json(members);
                  })
                  .catch(err => {
                    console.log("Something bad", err);
                  });
              })
              .catch(err => {
                console.log("Something bad", err);
              });
          } else if (member) {
            Member.find({
              parentId: member.parentId
            })
              .then(members => {
                Parent.findOne({ _id: member.parentId })
                  .then(parentFound => {
                    Chores.find({ parentId: parentFound._id })
                      .then(foundChores => {
                        for (let j = 0; j < foundChores.length; j++) {
                          if (
                            parentFound._id.toString() ===
                            foundChores[j].createdFor.toString()
                          ) {
                            parentFound.chores.push(foundChores[j]);
                          }
                        }
                        Chores.find({ parentId: member.parentId })
                          .then(choresFound => {
                            for (let i = 0; i < members.length; i++) {
                              for (let j = 0; j < choresFound.length; j++) {
                                if (
                                  members[i]._id.toString() ===
                                  choresFound[j].createdFor.toString()
                                ) {
                                  members[i].chores.push(choresFound[j]);
                                }
                              }
                            }
                            members.push(parentFound);
                            response.status(200).json(members);
                          })
                          .catch(err => {
                            //These are all for development purposes. I'll write appropriate status code for all of them
                            console.log("Something bad", err);
                          });
                      })
                      .catch(err => {
                        console.log("Something bad", err);
                      });
                    console.log("Members after pushing", members);
                  })
                  .catch(err => {
                    console.log("Something bad", err);
                  });
              })
              .catch(err => {
                console.log("Something bad", err);
              });
          }
        })
        .catch(err => {
          console.log("Something bad", err);
        });
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};

const deleteChore = (request, response) => {
  const { _id } = request.params;
Chores.findOneAndRemove({_id: request.params})
.then(deletedChore => {  
  Parent.findOneAndUpdate(
    { _id: deletedChore.parentId },
    { $pull: { choresIds: deletedChore._id } }
  )
    .then(user => {
      response.status(200).json(deletedChore);
    })
    .catch(err => {
      response.status(500).json({
        errorMessage: "Error pushing chores onto Parent",
        err
      });
    });
})
.catch(err => {
  console.log("Something went wrong while deleting chore", err)
})
}
const getAllChores = (request, response) => {
  Chores.find({})
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
module.exports = {
  createChore,
  getChores,
  deleteChore,
  getAllChores
};
