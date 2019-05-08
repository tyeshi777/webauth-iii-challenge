const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routers/users-router.js");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe",
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 25,
    secure: false
  },
  resave: false,
  saveUninitialized: true,
  store: new knexSessionStore({
    knex: require("./data/dbConfig.js"),
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(express.json());
server.use(helmet());
server.use(morgan());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api", userRouter);

module.exports = server;
