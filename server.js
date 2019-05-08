const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan());
server.use(cors());

module.exports = server;
