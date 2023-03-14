const express = require("express");
const bodyparser = require("body-parser");
const date=require(__dirname+"/date.js");
const app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const item=["Mayank","Shahi"];
const work=[];
app.get("/", function(req, res) {
  const day=date.getDate();

  res.render("list", {
    ListTitle: day,newListItem:item
  });
});

app.get("/work",function(req,res)
{
  res.render("list", {
    ListTitle: "Work Day",newListItem:work
  });
});
app.post("/",function(req,res)
{
  if(req.body.button==="Work Day"){
    const temp=req.body.newItem;
    work.push(temp);
    res.redirect("/work");
  }else{
    const temp=req.body.newItem;
    item.push(temp);
    res.redirect("/");
  }
});

app.get("/about",function(req,res)
{
  res.render("about");
});
app.listen(3000, function() {
  console.log("Server started at 3000 pin");
});
