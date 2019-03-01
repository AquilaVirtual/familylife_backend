const Chores = require("../models/chores");
const Parent = require("../models/parent");
const Member = require("../models/member");

const mongoose = require("mongoose");

const createChore = (request, response) => {
  const { title, username, name } = request.body;
  //console.log("Giving jwt", request.jwtObj);
  //if (request.jwtObj) {
    Parent.findOne({ username: username })
      .then(user => {
        Member.findOne({ name: name })
          .then(member => {
            console.log("Found Member", member);
            //Only create an assignment if a member exists with the provided name
            if (member) {
              const chore = new Chores({
                _id: new mongoose.Types.ObjectId(),
                title, 
                parentId: user._id,             
                createdFor: member._id
              });
              chore
                .save()
                .then(savechore => {
                  console.log("Saved Chores".savechore);
                  const id = savechore._id;
                  Parent.findOneAndUpdate(
                    { username: username },
                    { $push: { chores: id } }
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
                .json({ errorMessage: "Could not find a member by that name" });
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
  // } else {
  //   response.status(422).json({ errorMessage: "User Not Logged In" });
  // }
};

const getChores = (request, response) => {
  const { username } = request.params;
  Parent.findOne({ username: username })  
    .then(parent => {
      if(parent) {
        Member.find({
          parentId: parent._id
        })
        .then(members => {        
          console.log("Family members", members)
          Chores.find({parentId: parent._id})
          .then(chores => {
            console.log("Here are Chores Found", chores)
            for (let i = 0; i < members.length; i++) {
              for(let j = 0; j < chores.length; j++) {
                if (members[i]._id.toString() === chores[j].createdFor.toString()) {
                  console.log("Found match!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                  members[i].chore.push(chores[j])
                }
              }
            }            
            console.log("Members after pushing", members)
            response.status(200).json(members);
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
};
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
  getAllChores
};
