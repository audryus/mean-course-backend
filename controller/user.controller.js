const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/user.schema");

var authDenial = res =>
  res.status(401).json({ message: "Invalid authentication credentials" });

exports.create = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const model = new User({
      email: req.body.email,
      password: hash
    });
    model
      .save()
      .then(result => {
        res.status(201).json({ message: "created", users: [result] });
      })
      .catch(err => {
        res.status(500).json({ message: "User already have account." });
      });
  });
};

exports.login = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return authDenial(res);
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return authDenial(res);
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      );
      return res
        .status(200)
        .json({ token: token, expiresIn: 3600, userId: fetchedUser._id });
    })
    .catch(err => {
      return authDenial(res);
    });
};
