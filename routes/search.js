const express = require("express");
const router = express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync = require("../utility/wrapAsync");

router.post("/search",wrapAsync(async(req,res)=>{
    console.log(req.body);
    let title=req.body.title;
    let listing= await Listing.find({title:req.body.title});
    console.log(listing)
    res.render("listings/search.ejs",{listing,title})
    // res.send("Request reciece");
}))

router.get("/search/category/:key",wrapAsync(async(req,res)=>{
    let {key:category}=req.params;
    if(category=="trending"){
        let listings= await Listing.find();
        console.log(listings);
        res.render("listings/listings.ejs",{listings})
    }
    let listings= await Listing.find({category:category});
    console.log(listings)
    res.render("listings/listings.ejs",{listings})
}))

module.exports=router;
