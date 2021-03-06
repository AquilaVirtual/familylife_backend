const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyparser = require("body-parser");
const routes = require("./backend/routes");
const session = require("express-session");
require('dotenv').config()


//Instantiate Server
const server = express();

//Bringin Mongoose Database
const mongoose = require("mongoose");

 const db = process.env.DATABASE;
 
//Connect Database
mongoose
  .connect(db)
  .then(() => console.log("\n=== connected to mongo ===\n"))
  .catch(err => console.log("database is not connected"));

//Security
server.use(helmet());

//Permissions
server.use(cors());

//Enable to parse Json object
server.use(express.json());
server.use(bodyparser.json()); //express.jason;
server.use("/", routes);

server.use(require("body-parser").text());

//Status server
const port = process.env.PORT || 3002;
server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
