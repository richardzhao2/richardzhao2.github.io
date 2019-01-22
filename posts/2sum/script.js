var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

// dict of an array of x-coordinates of circles
var dict = {
	0: [50,106,162,218,274,330,386],
	1: [50,106,162,218,274,330,386],
	2: [50,106,162,218,274,330,386],
	3: [50,106,162,218,274,330,386],
	4: [50,106,162,218,274,330,386],
	5: [50,106,162,218,274,330,386],
	6: [50,106,162,218,274,330,386],
	7: [50,106,162,218,274,330,386],
	8: [50,106,162,218,274,330,386],
	9: [50,106,162,218,274,330,386],
	10: [50,106,162,218,274,330,386],
	11: [50,106,162,218,274,330,386],
	12: [50,106,162,218,274,330,386],
};

var hashArray = ['-', '-', '-' , '-', '-', '-', '-'];
var circleNumberDict = {
	0: 4,
	1: 3,
	2: 5,
	3: 12,
	4: 7,
	5: 1,
	6: 9
};


		
var svg = d3.select('.chart')
	.append("svg")
	.attr('width', '100%')
	.attr('height', '100%');

var circles = svg.selectAll("circle")
	.data(dict[0])
	.enter()
	.append("circle");

circles.attr('cx',15)
	.attr('cy', '50%')
	.attr("r", 15)
	.attr("fill", "white")
	.attr("stroke", "black");



var text = svg.selectAll("text.circletext")
	.data(dict[0])
	.enter()
	.append("text")
	.attr('class', 'circletext')
	.text(function(d, i) {
		return circleNumberDict[i];
	})
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	.attr("x", 10)
	.attr("y", '51%');

var hashRects = svg.selectAll("rect")
	.data(hashArray)
	.enter()
	.append("rect");

var hashText = svg.selectAll('text.hashlabels')
	.data(dict[0])
	.enter()
	.append('text')
	.attr('class','hashlabels')
	.text(function(d, i) {
		return circleNumberDict[i];
	})
	.attr('text-anchor', 'middle')
	.attr('fill', 'black')
	.attr('x', 100)
	.attr('y', 100)
	.attr('opacity', 0.5);

var targetLabel = svg.selectAll('text.target')
	.data(dict[0])
	.enter()
	.append('text')
	.attr('class','target')
	.text('Target: 19')
	.attr('text-anchor', 'middle')
	.attr('fill', 'black')
	.attr('x', 50)
	.attr('y', 30)
	.attr('opacity', 0.1);




// resize function to set dimensions on load and on page resize
function handleResize() { 
	//var stepHeight = Math.floor(window.innerHeight * 0.1);
	//step.style('height', stepHeight + 'px');


	// 2. update height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;

	graphic
		.style('width', bodyWidth + 'px')
		.style('height', window.innerHeight + 'px');

	// 3. update width of chart by subtracting from text width
	var chartMargin = 32;  
	var textWidth = text.node().offsetWidth;
	var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
	// make the height 1/2 of viewport
	var chartHeight = Math.floor(window.innerHeight / 2);

	chart
		.style('width', chartWidth + 'px')
		.style('height', chartHeight + 'px');

	// 4. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) { 
    // response = { element, direction, index }
    // fade in current step
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })

    // update graphic based on step here
	var stepData = step.attr('data-step');
	var curCoordinates = dict[response.index];
	d3.select('.chart').selectAll('circle')
		.transition()
		.attr('cx', function(d,i) {
			return curCoordinates[i];
		});
	
	d3.select('.chart').selectAll('text.circletext')
		.transition()
		.attr('x', function(d,i){
			return curCoordinates[i];
		});
	
	if (response.index >= 1) {
		d3.selectAll('text.target')
			.transition().duration(500)
			.attr('opacity', 0.4);
	}

	else {
		d3.selectAll('text.target')
			.transition().duration(500)
			.attr('opacity', 0);
	}

	if (response.index == 1) {
		var circleElements = circles.nodes();
		var textElements = text.nodes();

		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});

		d3.select(circleElements[4])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');
		d3.select(circleElements[3])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');
			
		d3.select(textElements[4])
			.transition().duration(500)
			.attr('y','41%')
		d3.select(textElements[3])
			.transition().duration(500)
			.attr('y','41%')
		
	}

	else if (response.index == 2) {
		var circleElements = circles.nodes();
		var textElements = text.nodes();

		d3.select('.chart').selectAll('circle')
			.transition()
				.attr('fill', 'white')
				.duration(1000)
				.delay(function(d, i){
					return i*100;
				})
				.on("start", function repeat(){
					d3.active(this)
						.attr('cy','40%')
					.transition()
						.attr('cy', '50%')
					.transition()
						.on('start', repeat);
				});
		
		d3.select('.chart').selectAll('text.circletext')
			.transition()
				.duration(1000)
				.delay(function(d, i){
					return i*100;
				})
				.on("start", function repeat(){
					d3.active(this)
						.attr('y','41%')
					.transition()
						.attr('y', '51%')
					.transition()
						.on('start', repeat);
				});
				

	}

	else if (response.index == 3){
		var circleElements = circles.nodes();
		var textElements = text.nodes();

		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});

		d3.select(circleElements[0])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[0])
			.transition().duration(500)
			.attr('y','41%')
	}

	else if (response.index == 5){
		var circleElements = circles.nodes();
		var textElements = text.nodes();

		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});

		d3.select(circleElements[1])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[1])
			.transition().duration(500)
			.attr('y','41%')
	}

	else if (response.index == 7){
		var circleElements = circles.nodes();
		var textElements = text.nodes();
		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});
			
		d3.select(circleElements[0])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[0])
			.transition().duration(500)
			.attr('y','41%')

	}

	else if (response.index == 8){
		var circleElements = circles.nodes();
		var textElements = text.nodes();
		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});
			
		d3.select(circleElements[1])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[1])
			.transition().duration(500)
			.attr('y','41%')

	}

	else if (response.index == 9){
		var circleElements = circles.nodes();
		var textElements = text.nodes();
		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});
			
		d3.select(circleElements[2])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[2])
			.transition().duration(500)
			.attr('y','41%')

	}

	else if (response.index == 10){
		var circleElements = circles.nodes();
		var textElements = text.nodes();
		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});
			
		d3.select(circleElements[3])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[3])
			.transition().duration(500)
			.attr('y','41%')

	}

	else if (response.index == 11){
		var circleElements = circles.nodes();
		var textElements = text.nodes();
		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});
			
		d3.select(circleElements[4])
			.transition().duration(500)
			.attr('fill', 'yellow')
			.attr('cy', '40%');

		d3.select(textElements[4])
			.transition().duration(500)
			.attr('y','41%')

	}

	else {
		d3.select('.chart').selectAll('circle')
			.transition().duration(400)
			.attr('cx', function(d,i) {
				return curCoordinates[i];
			})
			.attr('fill','white')
			.attr('cy', '50%');

		d3.select('.chart').selectAll('text.circletext')
			.transition().duration(400)
			.attr('y', '51%')
			.attr('x', function(d,i) {
				return dict[response.index][i];
			});
	}

	// handling the dictionary animations

	if (response.index >= 6) {
		hashRects.transition()
			.attr('width', 35)
			.attr('height', 35)
			.attr('x', function(d,i) {
				return i * 37 + 88;
			})
			.attr('y', function(d,i) {
				return 75;
			})
			.attr('fill', 'white')
			.attr('stroke', 'black');
	}
	else {
		hashRects.transition()
			.attr('width', 0)
			.attr('height', 0)
			.attr('x', function(d,i) {
				return i * 37 + 88;
			})
			.attr('y', function(d,i) {
				return 75;
			})
			.attr('fill', 'white')
			.attr('stroke', 'black');
	}

	//handling dictionary fills

	if (response.index == 11){
		var rectElements = hashRects.nodes();

		d3.select(rectElements[3])
			.transition()
			.attr('fill', 'yellow');
	}



	// handling dictionary numbers

	if (response.index == 7){
		var hashTextElements = hashText.nodes();
		d3.select('.chart').selectAll('text.hashlabels')
			.transition()
			.attr('fill', 'black')
			.attr('opacity', 0);

		d3.select(hashTextElements[0])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105)
			.attr('y', 98)
			.attr('opacity', 1);
	}

	else if (response.index == 8) {
		var hashTextElements = hashText.nodes();

		d3.select('.chart').selectAll('text.hashlabels')
			.transition()
			.attr('fill', 'black')
			.attr('opacity', 0);
		
			
		d3.select(hashTextElements[0])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105)
			.attr('y', 98)
			.attr('opacity', 1);

		d3.select(hashTextElements[1])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105+37)
			.attr('y', 98)
			.attr('opacity', 1);
	}

	else if (response.index == 9) {
		var hashTextElements = hashText.nodes();

		d3.select('.chart').selectAll('text.hashlabels')
			.transition()
			.attr('fill', 'black')
			.attr('opacity', 0);

		d3.select(hashTextElements[0])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105)
			.attr('y', 98)
			.attr('opacity', 1);
			
		d3.select(hashTextElements[1])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105+37)
			.attr('y', 98)
			.attr('opacity', 1);

		d3.select(hashTextElements[2])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105+37+37)
			.attr('y', 98)
			.attr('opacity', 1);
	}

	else if (response.index == 10 || response.index == 11) {
		var hashTextElements = hashText.nodes();

		d3.select('.chart').selectAll('text.hashlabels')
			.transition()
			.attr('fill', 'black')
			.attr('opacity', 0);

		d3.select(hashTextElements[0])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105)
			.attr('y', 98)
			.attr('opacity', 1);
			
		d3.select(hashTextElements[1])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105+37)
			.attr('y', 98)
			.attr('opacity', 1);
			
		d3.select(hashTextElements[2])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105+37+37)
			.attr('y', 98)
			.attr('opacity', 1);

		d3.select(hashTextElements[3])
			.transition()
			.attr('fill', 'black')
			.attr('x', 105+37+37+37)
			.attr('y', 98)
			.attr('opacity', 1);
	}

	else {
		var hashTextElements = hashText.nodes();
		d3.select('.chart').selectAll('text.hashlabels')
			.transition()
			.attr('fill', 'black')
			.attr('opacity', 0);
	}

}

function handleContainerEnter(response) {
    // response = { direction }

    // sticky the graphic
    graphic.classed('is-fixed', true);
    graphic.classed('is-bottom', false); 
}


function handleContainerExit(response) { 
    // response = { direction }

	// un-sticky the graphic, and pin to top/bottom of container
	graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
}

// kick-off code to run once on load
function init() {
    // 1. call a resize on load to update width/height/position of elements
	handleResize();

	// 2. setup the scrollama instance
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			container: '#scroll', // our outermost scrollytelling element
			graphic: '.scroll__graphic', // the graphic
			text: '.scroll__text', // the step container
			step: '.scroll__text .step', // the step elements
			offset: 0.5, // set the trigger to be 1/2 way down screen
			debug: false, // display the trigger offset for testing
		})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);

	// setup resize event
	window.addEventListener('resize', handleResize);


}

// start it up
init();