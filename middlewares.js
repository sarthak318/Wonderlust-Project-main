const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utility/ExpressError.js");
const {reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path," .. ",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.currUrl=req.originalUrl;
        req.flash("error","You must be loggid in to add new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.currUrl){
        res.locals.redirectUrl=req.session.currUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details.map((el)=>el.message).join(","));
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details.map((el)=>el.message).join(","));
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
