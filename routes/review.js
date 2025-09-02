const express = require("express");
const router = express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middlewares.js");
const reviewController=require("../controllers/reviews.js");

// REVIEWS ROUTES
// CREATE ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;


