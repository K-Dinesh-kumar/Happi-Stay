const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.signup)
    .post(userController.addNewUser);

router.route("/login")
    .get(userController.login)
    .post(
        saveRedirectUrl,
        passport.authenticate(
            'local',
            {
                failureRedirect: '/login',
                failureFlash: true
            }
        ), userController.userLogin);

router.get("/logout", userController.logout);

module.exports = router;