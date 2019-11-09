/* eslint-disable */

  
var button = document.getElementById("archiveButton");
var boring = document.getElementById("archive");
var cool = document.getElementById("cool");
cool.style.display = "none";
var isBoring = true;

button.addEventListener("click",function(){
  isBoring = !isBoring;
  
  if(isBoring == true){
    button.innerHTML = "cool";
    boring.style.display = "block";
    cool.style.display = "none";
  }
  else{
    cool.style.display = "block";
    button.innerHTML = "list";
    boring.style.display = "none";
  }
},false);



