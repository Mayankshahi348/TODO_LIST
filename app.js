//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/todoDB",{useNewUrlParser:true,useUnifiedTopology: true},(err)=>{
  if(err)
  {
    console.log(err);
  }else{
    console.log("Successfully Connected");
  }
});

const itemSchema={
  name:String
};

const Item=mongoose.model("Item",itemSchema);

const one=new Item({
  name:"Welcome to to do list"
});
const two=new Item({
  name:"Hit + sign to add new item"
});
const three=new Item({
  name:"Hit this to delete the item"
});
const defaultitem = [one,two,three];

const listSchema={
  name:String,
  items:[itemSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/:customListName",function(req,res)
{
  const customListName=_.capitalize(req.params.customListName);

  List.findOne({name: customListName},function(err,foundList)
{
  if(!err)
  {
    if(!foundList)
    {
      //create new List
      const list=new List({
        name:customListName,
        items:defaultitem
      });
      list.save();
      res.redirect("/"+customListName);
    }else{
      res.render("list", {listTitle:foundList.name, newListItems: foundList.items});
    }
  }
});
});
app.get("/", function(req, res) {

 Item.find({},function(err,listItem)
{
  if(listItem.length===0){
    Item.insertMany(defaultitem,function(err)
    {
      if(err){
        console.log(err);
      }else{
        console.log("Successfully added!");
      }
      res.redirect("/");
    });
  }else{
  res.render("list", {listTitle:"TODAY", newListItems: listItem});
  }
});
});

app.post("/", function(req, res){

  const newItemGot = req.body.newItem;
  const listName=req.body.list;
  const newitemData=new Item({
    name:newItemGot
  });

  if(listName==="TODAY"){
    newitemData.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName},function(err,foundItem)
  {
    foundItem.items.push(newitemData);
    foundItem.save();
    res.redirect("/"+listName);
  });
  }
});



// app.get("/about", function(req, res){
//   res.render("about");
// });

app.post("/delete",function(req,res)
{
  const deleteItemId=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="TODAY")
  {
    Item.findByIdAndRemove(deleteItemId,function(err)
    {
      if(!err){
        console.log("Successfully Deleted!");
      }
      res.redirect("/");
  });
}else
{
  List.findOneAndUpdate({name: listName},{$pull: {items: {_id: deleteItemId}}},function(err)
{
  if(!err)
  {
    console.log("Successfully Deleted!");
  }
  res.redirect("/"+listName);
});
}
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
