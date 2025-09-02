const express = require("express");
const router = express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync = require("../utility/wrapAsync");

router.get("/terms",wrapAsync(async(req,res)=>{
    res.render("Anchor/Terms.ejs")
}))
router.get("/privacy",wrapAsync(async(req,res)=>{
    res.render("Anchor/Privacy.ejs")
}))
router.get("/companyDetails",wrapAsync(async(req,res)=>{
    res.render("Anchor/CompanyDetails.ejs")
}))

module.exports=router;
