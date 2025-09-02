const mongoose = require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");



main()
    .then((res)=>{
        console.log("Connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
};


async function initDB(){
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>(
        {...obj,owner:'669aa6e2d3bd6e9c96e4b729'}
    ));
    await Listing.insertMany(initData.data);
    console.log("Database Initallised");
}

initDB();