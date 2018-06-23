/* eslint-disable */

//////////////////////////////////////////////////////////
window.onload = function run() {
  // all of your code goes in here
  // it runs after the DOM is built

  var test = document.getElementById("test");
  var testLabel = document.getElementById("label1");
  // this handler will be executed every time the cursor is moved over a different list item
  test.addEventListener("mouseover", function (event) {
    // highlight the mouseover target
    event.target.style.color = "orange";
  }, false);


  test.addEventListener("mousemove", function (event) {


    var sizingRatio = 1; //initialize
    var barSizingRatio = 1;

    var squareSize = 187.5; //size of a side
    
    var centerX = 851; //unique to each square
    var centerY = 712; //unique to each square
    var x = event.pageX;
    var y = event.pageY;
    console.log(x);

    var maxDistance = Math.sqrt(2) * squareSize;
    var xdist = x - centerX;
    var ydist = y - centerY;
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);

    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93.75) {
      currentDistance = 93.75;
    }
    sizingRatio = Math.round((-16 / 1875 * currentDistance + 9 / 5) * 100) / 100;
    barSizingRatio = Math.round((-58 / 187 * currentDistance + 30) * 100) / 100;

    test.style.transformOrigin = "50% 50%";
    test.style.transform = "scale(" + sizingRatio + ")";


    test.style.zIndex = "1";



    testLabel.style.transformOrigin = "left";
    testLabel.style.transform = "scale(" + barSizingRatio + ")";
    testLabel.style.zIndex = "0";

  }, false);

  test.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    test.style.transformOrigin = "50% 50%";
    test.style.transform = "scale(1)";
    event.target.style.color = "red";
    test.style.zIndex = "0";
  }, false);

  test.onclick = function () {
    //location.href = "www.yoursite.com";
    window.open("google.com");
  };









  ////////////////

  var test2 = document.getElementById("test2");
  // this handler will be executed every time the cursor is moved over a different list item
  test2.addEventListener("mouseover", function (event) {
    // highlight the mouseover target
    event.target.style.color = "orange";
  }, false);


  test2.addEventListener("mousemove", function (event) {
    var sizingRatio = 1; //initialize
    var squareSize = 187.5; //size of a side

    var centerX = 851 + 187.5; //unique to each square
    var centerY = 712; //unique to each square
    var x = event.pageX;
    var y = event.pageY;

    var maxDistance = Math.sqrt(2) * squareSize;
    var xdist = x - centerX;
    var ydist = y - centerY;
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);

    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93.25) {
      currentDistance = 93.25;
    }
    sizingRatio = Math.round((-1 / 125 * currentDistance + 9 / 5) * 100) / 100;

    test2.style.transformOrigin = "50% 50%";
    test2.style.transform = "scale(" + sizingRatio + ")";

    /*
    resizes but nto about center
    $('#test').width("+=1");
    $('#test').height("+=1");
    */

    test2.style.zIndex = "1";

  }, false);

  test2.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    test2.style.transformOrigin = "50% 50%";
    test2.style.transform = "scale(1)";
    event.target.style.color = "red";
    test2.style.zIndex = "0";
  }, false);

  test2.onclick = function () {
    //location.href = "www.yoursite.com";
    window.open("google.com");
  };









  ///////////////////

  var test3 = document.getElementById("test3");
  // this handler will be executed every time the cursor is moved over a different list item
  test3.addEventListener("mouseover", function (event) {
    // highlight the mouseover target
    event.target.style.color = "orange";
  }, false);


  test3.addEventListener("mousemove", function (event) {
    var sizingRatio = 1; //initialize
    var squareSize = 187.5; //size of a side

    var centerX = 476 + 187.5 + 187.5; //unique to each square
    var centerY = 686; //unique to each square
    var x = event.pageX;
    var y = event.pageY;

    var maxDistance = Math.sqrt(2) * squareSize;
    var xdist = x - centerX;
    var ydist = y - centerY;
    var currentDistance = Math.sqrt(xdist * xdist + ydist * ydist);

    /*
        Remember that the -1/200 reflected the max distance between when the mouse enters and the CENTER of the square in question
    */
    if (currentDistance > 93.75) {
      currentDistance = 93.75;
    }
    sizingRatio = Math.round((-1 / 125 * currentDistance + 9 / 5) * 100) / 100;

    test3.style.transformOrigin = "50% 50%";
    test3.style.transform = "scale(" + sizingRatio + ")";

    /*
    resizes but nto about center
    $('#test').width("+=1");
    $('#test').height("+=1");
    */

    test3.style.zIndex = "1";

  }, false);

  test3.addEventListener("mouseout", function (event) {
    // highlight the mouseover target
    test3.style.transformOrigin = "50% 50%";
    test3.style.transform = "scale(1)";
    event.target.style.color = "red";
    test3.style.zIndex = "0";
  }, false);

  test3.onclick = function () {
    //location.href = "www.yoursite.com";
    window.open("google.com");
  };
}
