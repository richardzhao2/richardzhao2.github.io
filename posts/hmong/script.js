// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 90, left: 40 },
  width = 750 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;



// append the salary_svg object to the body of the page
var salary_svg = d3.select("#bargraphssalaries")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// Parse the Data
d3.csv("https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/household_salaries_2017.csv").then(function (data) {
  var myScale = d3.scaleLinear()
    .domain([height, 0])
    .range([0, 75000]);
  // X axis
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(data.map(function (d) { return d.Group; }))
    .padding(0.2);
  salary_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 75000])
    .range([height, 0]);
  salary_svg.append("g")
    .call(d3.axisLeft(y));

  // title
  salary_svg.append("text")
    .attr("x", (width / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("text-decoration", "underline")
    .text("Salaries of Different Ethnic Groups (2017)");

  // Bars
  var bars = salary_svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.Group); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    // no bar at the beginning thus:
    .attr("height", function (d) { return height - y(0); }) // always equal to 0
    .attr("y", function (d) { return y(0); })

  // Average Line
  salary_svg.append("line")
    .style("stroke", "steelblue")
    .style("stroke-dasharray", ("13, 10"))
    .attr("x1", 0)
    .attr("y1", y(57617))
    .attr("x2", width)
    .attr("y2", y(57617));

  // Animation
  salary_svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) { return y(d.Salary); })
    .attr("height", function (d) { return height - y(d.Salary); })

  // tooltip helper
  var helper = salary_svg.append("text")
    .attr("x", width / 1.5)
    .attr("y", y(57617))
    .attr("text-anchor", "middle")
    .style("opacity", 1)
    .style("font-size", "18px")
    .text("Click on the graph to show your guess");

  // Allowing User Input
  d3.select("#bargraphssalaries").on("click", function () {
    var coords = d3.mouse(this);
    d3.select(bars._groups[0][6]) // yeet
      .transition()
      .duration(300)
      .attr("y", function (d) { return y(myScale(coords[1])) })
      .attr("height", function (d) { return height - y(myScale(coords[1])); })
      .attr('fill', function (d) { return '#d2b48c' })
    d3.select("#reveal1")
      .transition()
      .duration(1000)
      .style("opacity", .1);

    helper.style("opacity", 0)
  });

  // Show me button
  d3.select("#wrapper").append("button")
    .attr('class', 'button')
    .text("Show me how I did")
    .on("click", function () {
      d3.select(bars._groups[0][6]) // yeet
        .transition()
        .duration(1000)
        .attr("y", function (d) { return y(48000) })
        .attr("height", function (d) { return height - y(48000); })
        .attr('fill', function (d) { return '#960019' });

      d3.select("#reveal1")
        .transition()
        .duration(1000)
        .style("opacity", 1);

      helper.style("opacity", 0)
    });

  // Default colors
  d3.select(bars._groups[0][0])
    .attr('fill', function (d) { return 'steelblue' });

  d3.select(bars._groups[0][6])
    .attr('fill', function (d) { return '#d2b48c' });


})

// append the svg object to the body of the page
var poverty_svg = d3.select("#bargraphpoverty")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// Parse the Data
d3.csv("https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/poverty_2017.csv").then(function (data) {
  var myScale = d3.scaleLinear()
    .domain([height, 0])
    .range([0, 50]);
  // X axis
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(data.map(function (d) { return d.Group; }))
    .padding(0.2);
  poverty_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 50])
    .range([height, 0]);
  poverty_svg.append("g")
    .call(d3.axisLeft(y));

  // Title
  poverty_svg.append("text")
    .attr("x", (width / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("text-decoration", "underline")
    .text("Percent of Poverty by Ethnic Group (2017)");

  // Bars
  var bars = poverty_svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.Group); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    // no bar at the beginning thus:
    .attr("height", function (d) { return height - y(0); }) // always equal to 0
    .attr("y", function (d) { return y(0); })

  // Average Line
  poverty_svg.append("line")
    .style("stroke", "steelblue")
    .style("stroke-dasharray", ("13, 10"))
    .attr("x1", 0)
    .attr("y1", y(11.8))
    .attr("x2", width)
    .attr("y2", y(11.8));

  // Animation
  poverty_svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) { return y(d.Percent); })
    .attr("height", function (d) { return height - y(d.Percent); })

  // tooltip helper
  var helper = poverty_svg.append("text")
    .attr("x", width / 1.5)
    .attr("y", y(11.8))
    .attr("text-anchor", "middle")
    .style("opacity", 1)
    .style("font-size", "18px")
    .text("Click on the graph to show your guess");

  // User Input
  d3.select("#bargraphpoverty").on("click", function () {
    var coords = d3.mouse(this);
    d3.select(bars._groups[0][6])
      .transition()
      .duration(300)
      .attr("y", function (d) { return y(myScale(coords[1])) })
      .attr("height", function (d) { return height - y(myScale(coords[1])); })
      .attr('fill', function (d) { return '#d2b48c' })
    d3.select("#reveal2")
      .transition()
      .duration(1000)
      .style("opacity", .1);
    helper.style("opacity", 0);
  });

  // Show me button
  d3.select("#wrapper_2").append("button")
    .attr('class', 'button')
    .text("Show me how I did")
    .on("click", function () {
      d3.select(bars._groups[0][6])
        .transition()
        .duration(1000)
        .attr("y", function (d) { return y(37.8) })
        .attr("height", function (d) { return height - y(37.8); })
        .attr('fill', function (d) { return '#960019' });

      d3.select("#reveal2")
        .transition()
        .duration(1000)
        .style("opacity", 1);

      helper.style("opacity", 0);
    });

  // Default colors
  d3.select(bars._groups[0][0])
    .attr('fill', function (d) { return 'steelblue' });

  d3.select(bars._groups[0][6])
    .attr('fill', function (d) { return '#d2b48c' });
})

// append the svg object to the body of the page
var education_svg = d3.select("#bargrapheducation")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// Parse the Data
d3.csv("https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/education_2017.csv").then(function (data) {
  var myScale = d3.scaleLinear()
    .domain([height, 0])
    .range([0, 75]);
  // X axis
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(data.map(function (d) { return d.Group; }))
    .padding(0.2);
  education_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 75])
    .range([height, 0]);
  education_svg.append("g")
    .call(d3.axisLeft(y));

  // Title
  education_svg.append("text")
    .attr("x", (width / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("text-decoration", "underline")
    .text("Percent of Higher Education Attainment by Ethnic Group (2017)");

  // Bars
  var bars = education_svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.Group); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    // no bar at the beginning thus:
    .attr("height", function (d) { return height - y(0); }) // always equal to 0
    .attr("y", function (d) { return y(0); })

  // Average Line
  education_svg.append("line")
    .style("stroke", "steelblue")
    .style("stroke-dasharray", ("13, 10"))
    .attr("x1", 0)
    .attr("y1", y(31))
    .attr("x2", width)
    .attr("y2", y(31));

  // Animation
  education_svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) { return y(d.Percent); })
    .attr("height", function (d) { return height - y(d.Percent); })

  // tooltip helper
  var helper = education_svg.append("text")
    .attr("x", width / 1.5)
    .attr("y", y(31))
    .attr("text-anchor", "middle")
    .style("opacity", 1)
    .style("font-size", "18px")
    .text("Click on the graph to show your guess");

  // User Input
  d3.select("#bargrapheducation").on("click", function () {
    var coords = d3.mouse(this);
    d3.select(bars._groups[0][6])
      .transition()
      .duration(300)
      .attr("y", function (d) { return y(myScale(coords[1])) })
      .attr("height", function (d) { return height - y(myScale(coords[1])); })
      .attr('fill', function (d) { return '#d2b48c' })
    d3.select("#reveal3")
      .transition()
      .duration(1000)
      .style("opacity", .1);

    helper.style("opacity", 0);
  });

  // Show me button
  d3.select("#wrapper_3").append("button")
    .attr('class', 'button')
    .text("Show me how I did")
    .on("click", function () {
      d3.select(bars._groups[0][6])
        .transition()
        .duration(1000)
        .attr("y", function (d) { return y(18) })
        .attr("height", function (d) { return height - y(18); })
        .attr('fill', function (d) { return '#960019' });

      d3.select("#reveal3")
        .transition()
        .duration(1000)
        .style("opacity", 1);

      helper.style("opacity", 0)
    });

  // Default colors
  d3.select(bars._groups[0][0])
    .attr('fill', function (d) { return 'steelblue' });

  d3.select(bars._groups[0][6])
    .attr('fill', function (d) { return '#d2b48c' });
})


// append the svg object to the body of the page
var unemployment_svg = d3.select("#bargraphunemployment")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// Parse the Data
d3.csv("https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/unemploymentrate_2017.csv").then(function (data) {
  var myScale = d3.scaleLinear()
    .domain([height, 0])
    .range([0, 15]);
  // X axis
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(data.map(function (d) { return d.Group; }))
    .padding(0.2);
  unemployment_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 15])
    .range([height, 0]);
  unemployment_svg.append("g")
    .call(d3.axisLeft(y));

  // Title
  unemployment_svg.append("text")
    .attr("x", (width / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("text-decoration", "underline")
    .text("Percent Unemploymed by Ethnic Group (2017)");

  // Bars
  var bars = unemployment_svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.Group); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    // no bar at the beginning thus:
    .attr("height", function (d) { return height - y(0); }) // always equal to 0
    .attr("y", function (d) { return y(0); })

  // Average Line
  unemployment_svg.append("line")
    .style("stroke", "steelblue")
    .style("stroke-dasharray", ("13, 10"))
    .attr("x1", 0)
    .attr("y1", y(4.9))
    .attr("x2", width)
    .attr("y2", y(4.9));

  // Animation
  unemployment_svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) { return y(d.Percent); })
    .attr("height", function (d) { return height - y(d.Percent); })

  // tooltip helper
  var helper = unemployment_svg.append("text")
    .attr("x", width / 1.5)
    .attr("y", y(4.9))
    .attr("text-anchor", "middle")
    .style("opacity", 1)
    .style("font-size", "18px")
    .text("Click on the graph to show your guess");

  // User Input
  d3.select("#bargraphunemployment").on("click", function () {
    var coords = d3.mouse(this);
    d3.select(bars._groups[0][6])
      .transition()
      .duration(300)
      .attr("y", function (d) { return y(myScale(coords[1])) })
      .attr("height", function (d) { return height - y(myScale(coords[1])); })
      .attr('fill', function (d) { return '#d2b48c' })
    d3.select("#reveal4")
      .transition()
      .duration(1000)
      .style("opacity", .1);

    helper.style("opacity", 0);
  });

  // Show me button
  d3.select("#wrapper_4").append("button")
    .attr('class', 'button')
    .text("Show me how I did")
    .on("click", function () {
      d3.select(bars._groups[0][6])
        .transition()
        .duration(1000)
        .attr("y", function (d) { return y(10) })
        .attr("height", function (d) { return height - y(10); })
        .attr('fill', function (d) { return '#960019' });

      d3.select("#reveal4")
        .transition()
        .duration(1000)
        .style("opacity", 1);

      helper.style("opacity", 0);
    });

  // Default colors
  d3.select(bars._groups[0][0])
    .attr('fill', function (d) { return 'steelblue' });

  d3.select(bars._groups[0][6])
    .attr('fill', function (d) { return '#d2b48c' });
})
