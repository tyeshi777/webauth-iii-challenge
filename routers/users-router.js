const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("./users-model.js");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `welcome ${username}, ${token}`
        });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    roles: ["users"]
  };
  const options = {
    expiresIn: "2hr"
  };
  return jwt.sign(payload, secrets.jwt.secret, options);
}
module.exports = router;
