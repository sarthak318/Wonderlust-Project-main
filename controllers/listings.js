const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    let listings=await Listing.find({})
    res.render("listings/listings.ejs",{listings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let listing=new Listing(req.body.listing);
    listing.owner=req.user._id;
    listing.image={url,filename};
    await listing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
};

module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    let place=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!place){
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    console.log(place);

    res.render("listings/show.ejs",{place});
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let place = await Listing.findById(id);
    if(!place){
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    let orignalImageUrl=place.image.url;
    orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{place,orignalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(`${id}`);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};