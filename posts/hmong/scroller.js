var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

/// PIE CHART DATA
var aa_poverty_percent_18 = { poor: 10, medium: 90 }
var aa_poverty_percent_64 = { poor: 12, medium: 88 }
var aa_poverty_percent_65 = { poor: 9, medium: 91 }

var hmong_poverty_percent_18 = { poor: 47, medium: 53 }
var hmong_poverty_percent_64 = { poor: 35, medium: 65 }
var hmong_poverty_percent_65 = { poor: 25, medium: 75 }


// set the color scale for pei chart
var pie_color = d3.scaleOrdinal()
    .domain(["poor", "medium", "rich"])
    .range(d3.schemeDark2);


margin = 40
var radius = Math.min(width, height) / 2 - margin

var population_tip = false


///BAR GRAPH STUFF









// initialize the scrollama
var scroller = scrollama();

var scroller_svg = d3.select('.chart')
    .append("svg")
    .attr('width', '100%')
    .attr('height', '100%')


chart_width = parseFloat(scroller_svg.style('width'));
chart_height = parseFloat(window.innerHeight / 2);


function gridData() {
    var data = new Array();
    var xpos = 1 + chart_width / 12; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1 + 50;
    var width = chart_width / 12;
    var height = width;

    // iterate for rows 
    for (var row = 0; row < 10; row++) {
        data.push(new Array());

        // iterate for cells/columns inside rows
        for (var column = 0; column < 10; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
        }
        // reset the x position after a row is complete
        xpos = 1 + width;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height + 2;
    }
    return data;
}
var gridData = gridData();

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
    if (response.index == 1) {
        var row = scroller_svg.selectAll(".row")
            .data(gridData)
            .enter().append("g")
            .attr("class", "row");
        var column = row.selectAll(".square")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("opacity", 0)
            .attr("class", "square")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("width", function (d) { return d.width - 5; })
            .attr("height", function (d) { return d.height - 5; })
            .style("fill", "#fff")
            .style("stroke", "#222")
            .transition()
            .delay(function (d, i) { return 10 * i })
            .attr("opacity", 1);

        if (population_tip == false) {
            var pop_text = scroller_svg.append('text')
                .style("opacity", 0)
                .text("1 box = 1% of population")
                .attr("x", (chart_width / 12))
                .attr("y", (chart_width + chart_width / 13))
                .transition()
                .style("opacity", 1)
            population_tip = true;
        }




    } else if (response.index == 2) {
        var squareElements = d3.selectAll('.square').nodes();
        for (i = 0; i < 10; i++) {
            d3.select(squareElements[i])
                .transition()
                .delay(function (d) { return 20 * i + 1 })
                .duration(1000)
                .style('fill', 'yellow')
        }

    }

    else if (response.index == 3) {
        var squareElements = d3.selectAll('.square').nodes();

        for (i = 9; i >= 0; i--) {
            var relative_index = 9 - i;
            d3.select(squareElements[relative_index])
                .transition()
                .delay(function (d) { return 20 * i + 1 })
                .duration(1000)
                .style('fill', '#fff')
        }


        for (i = 0; i < 40; i++) {
            index = i; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) + 1000 })
                .duration(1000)
                .style('fill', 'steelblue')
        }

    } else if (response.index == 4) {
        var squareElements = d3.selectAll('.square').nodes();
        for (i = 40; i >= 0; i--) {
            var relative_index = 40 - i;
            d3.select(squareElements[relative_index])
                .transition()
                .delay(function (d) { return 20 * i + 1 })
                .duration(500)
                .style('fill', '#fff')
        }

        for (i = 0; i < 55; i++) {
            index = i; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) + 1050 })
                .duration(1000)
                .style('fill', 'yellow')
        }

    }

    else if (response.index == 5) {
        var squareElements = d3.selectAll('.square').nodes();
        for (i = 0; i < 21; i++) {
            index = i; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) })
                .duration(1000)
                .style('fill', '#800080')
        }
    }

    else if (response.index == 6) {
        var squareElements = d3.selectAll('.square').nodes();
        for (i = 0; i <= 55; i++) {
            var relative_index = 55 - i;
            d3.select(squareElements[relative_index])
                .transition()
                .delay(function (d) { return (20 * i + 1) })
                .duration(500)
                .style('fill', '#fff')
        }

        for (i = 0; i < 18; i++) {
            index = i; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) + 1200 })
                .duration(1000)
                .style('fill', 'steelblue')
        }
    }

    else if (response.index == 7) {
        var squareElements = d3.selectAll('.square').nodes();
        for (i = 0; i < 3; i++) {
            index = i; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) })
                .duration(1000)
                .style('fill', '#cc8400');
        }
    }


    else if (response.index == 8) {
        var squareElements = d3.selectAll('.square').nodes();
        for (i = 0; i < 21; i++) {
            index = i + 30; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) })
                .duration(1000)
                .style('fill', '#800080');
        }
        for (i = 0; i < 55 - 21; i++) {
            index = i + 51; // temporary testing to see alternative ways of visualization
            d3.select(squareElements[index])
                .transition()
                .delay(function (d) { return (20 * i + 1) + 800 })
                .duration(1000)
                .style('fill', 'yellow');
        }
    }

    else if (response.index == 9) {
        var squareElements = d3.selectAll('.square').nodes();

        d3.selectAll('.square')
            .transition()
            .style('opacity', 0);
        d3.selectAll('text')
            .transition()
            .style('opacity', 0)
        /*
    for (i = 0; i < 100; i++) {
        d3.select(squareElements[i])
            .transition()
            .duration(1000)
            .style('opacity', 0);
    }
    */
        //scroller_svg.selectAll("*").remove();
        first_pie_update(hmong_poverty_percent_18)
        scroller_svg.append("circle").attr("cx", 20).attr("cy", chart_height / 2.3 + radius).attr("r", 6).style("fill", "#1b9e77")
        scroller_svg.append("circle").attr("cx", 20).attr("cy", chart_height / 2.3 + radius + 30).attr("r", 6).style("fill", "#d95f02")
        scroller_svg.append("text").attr("x", 40).attr("y", chart_height / 2.3 + radius).text("Poverty").style("font-size", "15px").attr("alignment-baseline", "middle")
        scroller_svg.append("text").attr("x", 40).attr("y", chart_height / 2.3 + radius + 30).text("Not in Poverty").style("font-size", "15px").attr("alignment-baseline", "middle")

    }

    else if (response.index == 10) {
        pie_update(aa_poverty_percent_18)
    }

    else if (response.index == 11) {
        pie_update(hmong_poverty_percent_64)
    }
    else if (response.index == 12) {
        pie_update(aa_poverty_percent_64)
    }
    else if (response.index == 13) {
        pie_update(hmong_poverty_percent_65)
    }
    else if (response.index == 14) {
        pie_update(aa_poverty_percent_65)
    }
    else if (response.index == 15) {
        scroller_svg.selectAll("*").remove();
        d3.csv("https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/hmong_aa_economic.csv").then(function (data) {

            // List of subgroups = header of the csv files = soil condition here
            var subgroups = data.columns.slice(1)

            // List of groups = species here = value of the first column called group -> I show them on the X axis
            var groups = d3.map(data, function (d) { return (d.group) }).keys()

            // Add X axis
            var x = d3.scaleBand()
                .domain(groups)
                .range([0, chart_width])
                .padding([0.4])
            scroller_svg.append("g")
                .attr("transform", "translate(0," + (height + 50) + ")")
                .call(d3.axisBottom(x).tickSize(0))

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 80])
                .range([height, 0]);
            scroller_svg.append("g")
                .call(d3.axisLeft(y))
                .attr("transform", function (d) { return "translate(25,50)"; });

            // Another scale for subgroup position
            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            // color palette = one color per subgroup
            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#377eb8', '#e41a1c'])
            scroller_svg.append("text")
                .attr("x", (chart_width / 2))
                .attr("y", (80))
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("text-decoration", "underline")
                .text("Percentage Living in Poverty");
            // Show the bars
            scroller_svg.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + x(d.group) + ",0)"; })
                .selectAll("rect")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter().append("rect")
                .attr("x", function (d) { return xSubgroup(d.key); })
                .attr("y", function (d) { return y(d.value) + 50; })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function (d) { return height - y(0); }) // always equal to 0
                .attr("fill", function (d) { return color(d.key); });

            scroller_svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", function (d) { return y(d.value) + 50; })
                .attr("height", function (d) { return height - y(d.value); })
                .delay(function (d, i) { console.log(i); return (i * 100) })

        });
        scroller_svg.append("circle").attr("cx", 20).attr("cy", chart_height / 2.0 + radius).attr("r", 6).style("fill", "#e41a1c")
        scroller_svg.append("circle").attr("cx", 20).attr("cy", chart_height / 2.0 + radius + 30).attr("r", 6).style("fill", '#377eb8')
        scroller_svg.append("text").attr("x", 40).attr("y", chart_height / 2.0 + radius).text("Hmong-American").style("font-size", "15px").attr("alignment-baseline", "middle")
        scroller_svg.append("text").attr("x", 40).attr("y", chart_height / 2.0 + radius + 30).text("Asian-American").style("font-size", "15px").attr("alignment-baseline", "middle")
    }
    else if (response.index == 16) {


    }

    else {

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
function first_pie_update(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(d3.entries(data))
    // map to data
    var u = scroller_svg
        .selectAll("path")
        .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
        .enter()
        .append('path')
        .merge(u)
        .attr("transform", "translate(" + chart_width / 2 + "," + chart_height / 2.5 + ")")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { console.log(pie_color(d.data.key)); return (pie_color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)



    // remove the group that is not present anymore
    u
        .exit()
        .remove()

}
function pie_update(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(d3.entries(data))
    // map to data
    var u = scroller_svg
        .selectAll("path")
        .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
        .enter()
        .append('path')
        .merge(u)
        .attr("transform", "translate(" + chart_width / 2 + "," + chart_height / 2.5 + ")")
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (pie_color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")



    // remove the group that is not present anymore
    u
        .exit()
        .remove()

}

// start it up
init();