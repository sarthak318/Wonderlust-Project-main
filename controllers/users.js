const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup=async (req,res)=>{
    try {
        let {username , email ,password}=req.body;
        let newUser=new User({
            username:username,
            email:email
        });
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust!");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to Wonderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    // console.dir(req);
    // console.log(req);
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
};