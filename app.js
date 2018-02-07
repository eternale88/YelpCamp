var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds")



mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();

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

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log("err");
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

//Create - add new campground to database
app.post("/campgrounds", function(req, res) {

  //get data from form and add to campGrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description
  var newCampground = {name: name, image: image, description: desc};
  // create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
        console.log(err);
      } else {
        //redirect back to campgrounds page
        res.redirect("/campgrounds");
      }
  });
});

//New - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
          console.log(err);
        } else {
          //render show template with that campground
          res.render("show", {campground: foundCampground});
        }
    });
});
app.listen(3000, function(req, res){
    console.log("YelpCamp server has started!");
});
