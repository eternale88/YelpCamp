var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

//SCHEMA Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Yosemite",
//     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/YosemitePark2_amk.jpg/1280px-YosemitePark2_amk.jpg"
//   }, function(err, campground){
//       if(err){
//         console.log(err);
//       } else {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//       }
//   });


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

// var campGrounds = [
//   {name: "Ocean Beach", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cliff_House_from_Ocean_Beach.jpg/350px-Cliff_House_from_Ocean_Beach.jpg"},
//   {name: "Yosemite", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/YosemitePark2_amk.jpg/1280px-YosemitePark2_amk.jpg"},
//   {name: "Sequoia", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sequoiagrove2005.jpg/1024px-Sequoiagrove2005.jpg"},
//   {name: "Ocean Beach", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cliff_House_from_Ocean_Beach.jpg/350px-Cliff_House_from_Ocean_Beach.jpg"},
//   {name: "Yosemite", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/YosemitePark2_amk.jpg/1280px-YosemitePark2_amk.jpg"},
//   {name: "Sequoia", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sequoiagrove2005.jpg/1024px-Sequoiagrove2005.jpg"}
// ]

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log("err");
    } else {
      res.render("campgrounds", {campgrounds: allCampgrounds});
    }
  });
});

app.post("/campgrounds", function(req, res) {

  //get data from form and add to campGrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  // create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
        console.log(err);
      } else {
        //redirect back to campgrounds page
        res.redirect("/campgrounds");
      }
  });
  //redirect back to campgrounds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

app.listen(3000, function(req, res){
  console.log("YelpCamp server has started!");
});
