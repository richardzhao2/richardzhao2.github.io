/* eslint-disable */

//////////////////////////////////////////////////////////
window.onload = function run() {
  // all of your code goes in here
  // it runs after the DOM is built

  var engee = document.getElementById("engee");
  var engeeOffsetLeft = $('#engee').offset().left;
  var engeeOffsetTop = $('#engee').offset().top;
  var engeeLabel = document.getElementById("label1");

  engee.addEventListener("mousemove", function (event) {


    var sizingRatio = 1; //initialize
    var barSizingRatio = 1;
    
    var width = $('#engee').width();
    var height = width;

   
    var mouseX = event.pageX -  engeeOffsetLeft;//
    var mouseY = event.pageY - engeeOffsetTop;
    

    var centerX = width/2 - 1.5; //like 562.75
    var centerY = height/2 - 1.5;

    var xdist = Math.abs(mouseX - centerX);
    var ydist = Math.abs(mouseY - centerY);
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);
    
    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93) {
      currentDistance = 93;
    }
    
    
    sizingRatio = (-1/ 93  * currentDistance + 2);
    barSizingRatio = (-14/93 * currentDistance + 15);
    
   
    engee.style.transform = "scale(" + sizingRatio + ")";
    engee.style.zIndex = "1";

    engeeLabel.style.transform = "scale(" + barSizingRatio + ")";
    engeeLabel.style.zIndex = "2";


    
  }, false);

  engee.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    engee.style.transformOrigin = "50% 50%";
    engee.style.transform = "scale(1)";
    engee.style.zIndex = "0";
  }, false);

  engee.onclick = function () {
    location.href = "https://github.com/richardzhao2/engee";
  };




  var schedulize = document.getElementById("schedulize");
  var schedulizeOffsetLeft = $('#schedulize').offset().left;
  var schedulizeOffsetTop = $('#schedulize').offset().top;
  var schedulizeLabel = document.getElementById("label2");

  schedulize.addEventListener("mousemove", function (event) {


    var sizingRatio = 1; //initialize
    var barSizingRatio = 1;
    
    var width = $('#schedulize').width();
    var height = width;

   
    var mouseX = event.pageX -  schedulizeOffsetLeft;//
    var mouseY = event.pageY - schedulizeOffsetTop;
    

    var centerX = width/2 - 1.5; //like 562.75
    var centerY = height/2 - 1.5;

    var xdist = Math.abs(mouseX - centerX);
    var ydist = Math.abs(mouseY - centerY);
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);
    
    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93) {
      currentDistance = 93;
    }
    
    
    sizingRatio = (-1/ 93  * currentDistance + 2);
    barSizingRatio = (-14/93 * currentDistance + 15);
    
   
    schedulize.style.transform = "scale(" + sizingRatio + ")";
    schedulize.style.zIndex = "1";

    schedulizeLabel.style.transform = "scale(" + barSizingRatio + ")";
    schedulizeLabel.style.zIndex = "0";


    
  }, false);

  schedulize.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    schedulize.style.transformOrigin = "50% 50%";
    schedulize.style.transform = "scale(1)";
    schedulize.style.zIndex = "0";
  }, false);

  schedulize.onclick = function () {
    location.href = "https://github.com/richardzhao2/Schedulize";
  };


  ///////////////////

  var epm = document.getElementById("epm");
  var epmOffsetLeft = $('#epm').offset().left;
  var epmOffsetTop = $('#epm').offset().top;
  var epmLabel = document.getElementById("label3");
  // this handler will be executed every time the cursor is moved over a different list item

  epm.addEventListener("mousemove", function (event) {


    var sizingRatio = 1; //initialize
    var barSizingRatio = 1;
    
    var width = $('#epm').width();
    var height = width;

   
    var mouseX = event.pageX -  epmOffsetLeft;//
    var mouseY = event.pageY - epmOffsetTop;
    

    var centerX = width/2 - 1.5; //like 562.75
    var centerY = height/2 - 1.5;

    var xdist = Math.abs(mouseX - centerX);
    var ydist = Math.abs(mouseY - centerY);
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);
    
    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93) {
      currentDistance = 93;
    }
    
    
    sizingRatio = (-1/ 93  * currentDistance + 2);
    barSizingRatio = (-14/93 * currentDistance + 15);
    
   
    epm.style.transform = "scale(" + sizingRatio + ")";
    epm.style.zIndex = "1";

    epmLabel.style.transform = "scale(" + barSizingRatio + ")";
    epmLabel.style.zIndex = "0";


    
  }, false);

  epm.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    epm.style.transformOrigin = "50% 50%";
    epm.style.transform = "scale(1)";
    epm.style.zIndex = "0";
  }, false);

  epm.onclick = function () {
    location.href = "https://github.com/richardzhao2/EPM-Dashboard";
  
  };


  var blood = document.getElementById("blood");
  var bloodOffsetLeft = $('#blood').offset().left;
  var bloodOffsetTop = $('#blood').offset().top;
  var bloodLabel = document.getElementById("label4");
  
  blood.addEventListener("mousemove", function (event) {


    var sizingRatio = 1; //initialize
    var barSizingRatio = 1;
    
    var width = $('#blood').width();
    var height = width;

   
    var mouseX = event.pageX -  bloodOffsetLeft;//
    var mouseY = event.pageY - bloodOffsetTop;
    

    var centerX = width/2 - 1.5; //like 562.75
    var centerY = height/2 - 1.5;

    var xdist = Math.abs(mouseX - centerX);
    var ydist = Math.abs(mouseY - centerY);
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);
    
    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93) {
      currentDistance = 93;
    }
    
    
    sizingRatio = (-1/ 93  * currentDistance + 2);
    barSizingRatio = (-14/93 * currentDistance + 15);
    
   
    blood.style.transform = "scale(" + sizingRatio + ")";
    blood.style.zIndex = "1";

    bloodLabel.style.transform = "scale(" + barSizingRatio + ")";
    bloodLabel.style.zIndex = "0";


    
  }, false);

  blood.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    blood.style.transformOrigin = "50% 50%";
    blood.style.transform = "scale(1)";
    blood.style.zIndex = "0";
  }, false);

  blood.onclick = function () {
    location.href = "https://github.com/richardzhao2/Blood-Money";
    
  };

  
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
      boring.style.display = "none";
      cool.style.display = "block";
    }
  },false);


}
