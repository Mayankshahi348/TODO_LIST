// jshint esversion:6

exports.getDate=function(){
  const today = new Date();
  const option = {
    weeekday: "long",
    day: "numeric",
    month: "long"
  }
  const day = today.toLocaleDateString("en-US", option);
  return day;
}

exports.getDay=function(){
  const today = new Date();
  const option = {
    day: "numeric",
  }
  const day = today.toLocaleDateString("en-US", option);
  return day;
}
