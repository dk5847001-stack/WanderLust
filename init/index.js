const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const data = require("./data.js");


const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log('mongodb connected successful');
})
.catch((err)=>{
    console.log(err);
    
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner: "69e9b66ae7a28ed4bcdad369"}));
    await Listing.insertMany(initData.data);
    console.log('data was initialize successully');
}
initDB();