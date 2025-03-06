const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.addNewUser = wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Happi-Stay!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})

module.exports.login = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome back to Happi-Stay!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
}

