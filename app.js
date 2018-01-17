var express = require("express");

var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

var campGrounds = [
  {name: "Ocean Beach", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cliff_House_from_Ocean_Beach.jpg/350px-Cliff_House_from_Ocean_Beach.jpg"},
  {name: "Yosemite", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/YosemitePark2_amk.jpg/1280px-YosemitePark2_amk.jpg"},
  {name: "Sequoia", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sequoiagrove2005.jpg/1024px-Sequoiagrove2005.jpg"}
]

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){

  res.render("campgrounds", {campGrounds: campGrounds});
});

app.post("/campgrounds", function(req, res) {

  //get data from form and add to campGrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campGrounds.push(newCampground);
  //redirect back to campgrounds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

app.listen(3000, function(req, res){
  console.log("YelpCamp server has started!");
});
