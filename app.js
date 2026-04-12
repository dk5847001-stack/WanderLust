const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Subscriber = require("./models/subscriber.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const PORT = 3000;
const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log('Mongodb connected successfully');
})
.catch((err)=>{
    console.log(err);
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine("ejs", ejsMate);

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res)=>{
    res.render("home");
});

//index route
app.get("/listings", async (req, res)=>{
   const allListings = await Listing.find({})
   res.render("listings/index", {allListings})
})

// new routes
app.get("/listings/new", async (req, res)=>{
    res.render("listings/new.ejs");
})

// create routes
app.post("/listings", async (req, res)=>{
    const {title, description, price, location, country} = req.body;
    await Listing.create({title, description, price, location, country})
    res.redirect("/listings")
})

// edit routes
app.get("/listings/:id/edit", async (req, res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id)
    res.render("listings/edit.ejs", {listings})
})

// update routes
app.put("/listings/:id", async (req, res)=>{
    const {id} = req.params;
    const {title, description, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, price, location, country})
    res.redirect("/listings")
})

// delete routes
app.delete("/listings/:id", async (req, res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
})

// show routes
app.get("/listings/:id", async (req, res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id)
    res.render("listings/show.ejs", {listings})
})

// subscriber routes
app.post("/subscriber", async (req, res)=>{
    try{
        const {email} = req.body;
        // basic validation
        if(!email){
            return res.status(400).send("Email is required");
        }
        // save to db
        await Subscriber.create({email});
        console.log('Subscriber created successfully');
        // redirect or response
        res.redirect("/")
    } catch(err){
        console.error(err);
        res.status(500).send("something went wrong")
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
});






// app.get("/testListing", async (req, res)=>{
//     const sampleListings = new listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calanguate, Goa",
//         country: "India"
//     })
//     await sampleListings.save();
//     console.log('sample listing is seved successfully');
//     res.send("listing created successfully")
// })