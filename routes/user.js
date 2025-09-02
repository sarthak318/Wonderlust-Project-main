const express = require("express");
const router = express.Router();
const User=require("../models/user");
const wrapAsync = require("../utility/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middlewares");
const userController=require("../controllers/users");


router.get("/signup",userController.renderSignupForm);
router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);


router.post("/login",saveRedirectUrl,passport.authenticate("local",{
        failureRedirect:"/login", failureFlash:true
    }),wrapAsync(userController.login));


router.get("/logout",userController.logout);

module.exports=router;