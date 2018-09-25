/* eslint-disable */

  
var button = document.getElementById("archiveButton");
var boring = document.getElementById("archive");
var cool = document.getElementById("cool");
boring.style.display = "none";
var isBoring = false;

button.addEventListener("click",function(){
  isBoring = !isBoring;
  
  if(isBoring == true){
    button.innerHTML = "back";
    boring.style.display = "block";
    cool.style.display = "none";
  }
  else{
    cool.style.display = "block";
    button.innerHTML = "archive";
    boring.style.display = "none";
  }
},false);



