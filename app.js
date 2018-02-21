var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am that I am",
    resave: false,
    saveUninitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
          console.log(err);
        } else {
          //render show template with that campground
          res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", function(req, res ) {
      // find campground by id
      Campground.findById(req.params.id, function(err, campground) {
          if(err) {
              console.log(err);
          } else {
              res.render("comments/new", {campground: campground});
          }
      })
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
          //create new comment
          Comment.create(req.body.comment, function(err, comment) {
              if(err) {
                  console.log(err);
              } else {
                //connect new comment to campground
                  campground.comments.push(comment);
                  campground.save();
                  //redirect to show page
                  res.redirect("/campgrounds/" + campground._id);
              }
          })
        }
    });
});

//==============
// AUTH ROUTES
//==============

//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
          console.log(err);
          return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//SHOW LOGIN FORM
app.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }), function(req, res) {
    res.send("LOGIN LOGIC HAPPENS HERE");
});

//logout ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

app.listen(3000, function(req, res){
    console.log("YelpCamp server has started!");
});
