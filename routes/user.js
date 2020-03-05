const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var getUserModel = req => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return new User({
                email: req.body.email,
                password: hash
            });
        });
};

router.post("/sign/up", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const model = new User({
                email: req.body.email,
                password: hash
            });
            model.save().then(result => {
                res.status(201).json({ message: "created", users: [result] })
            }).catch(err => {
                res.status(500).json({error: err})
            });
        });
});

var authDenial = res => res.status(401).json({ message: "Auth failed"});

router.post("/sign/in", (req, res, next) => {
    let fetchedUser;
    User.findOne( { email: req.body.email })
        .then(user => {
            if (!user) {
                return authDenial(res);
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        }).then(result => {
            if (!result) {
                return authDenial(res);
            }
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id}, "S2U!GVr@h6R7bBfm", {
                expiresIn: "1h"
            });
            return res.status(200).json({ token: token, expiresIn: 3600 });
        }).catch(err => {
            return authDenial(res);
        });

});

module.exports = router;
