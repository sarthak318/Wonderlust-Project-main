if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride=require("method-override");
const path=require("path");
const ExpressError=require("./utility/ExpressError.js");
const ejsMate=require("ejs-mate");
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
const searchRoute=require("./routes/search.js");
const anchorRoute=require("./routes/Anchor.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");
const passport=require("passport");
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600 ,// time period in seconds
});

const sessionOption={
    stroe:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);
app.use("/",searchRoute);
app.use("/",anchorRoute);
app.get("/",(req,res)=>{
    res.redirect("./listings");
})

app.listen(8080,()=>{
    console.log("Server is listning at port :8080");
});

main()
    .then((res)=>{
        console.log("Connected to DB");
    })
    .catch(err => console.log(err));



async function main() {
  await mongoose.connect(dbUrl);
};


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});

// ERROR HANDLING
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
    res.status(statusCode).send(message);
});

app.use((err,req,res,next)=>{
    console.log(err);
    res.send("Some Error Occured");
});


