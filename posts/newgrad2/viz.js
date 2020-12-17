
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var formatNumber = d3.format(",.0f"),
    format = function (d) { return formatNumber(d) }

const color = d3.scaleOrdinal(d3.schemeCategory20);

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 6]]);

var link = svg.append("g")
    .attr("class", "links")
    .attr('fill', 'none')
    .attr("stroke-opacity", 0.2)
    .selectAll("path");

var node = svg.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

var graph;

var jobs = {
    "nodes": [
        {
            "name": "All Applications",
        },
        {
            "name": "Online",
        },
        {
            "name": "Career Fair",
        },
        {
            "name": "Ghosted",
        },
        {
            "name": "Phone Screen",
        },
        {
            "name": "Hackerrank",
        },
        {
            "name": "Onsite/Final Round",
        },
        {
            "name": "Offer",
        },
        {
            "name": "Withdrew",
        },
        {
            "name": "Rejected",
        },
        {
            "name": "Return Offer/Nepotism",
        }
    ],
    "links": [
        {
            "source": 0,
            "target": 1,
            "value": 145,
        },
        {
            "source": 0,
            "target": 2,
            "value": 10,
        },
        {
            "source": 2,
            "target": 4,
            "value": 0,
        },
        {
            "source": 2,
            "target": 5,
            "value": 0,
        },
        {
            "source": 2,
            "target": 3,
            "value": 10,
        },
        {
            "source": 1,
            "target": 4,
            "value": 3,
        },
        {
            "source": 1,
            "target": 5,
            "value": 24,
        },
        {
            "source": 1,
            "target": 3,
            "value": 80,
        },
        {
            "source": 1,
            "target": 9,
            "value": 43,
        },
        {
            "source": 4,
            "target": 6,
            "value": 6,
        },
        {
            "source": 4,
            "target": 9,
            "value": 3,
        },
        {
            "source": 4,
            "target": 8,
            "value": 0,
        },
        {
            "source": 5,
            "target": 9,
            "value": 2,
        },
        {
            "source": 5,
            "target": 3,
            "value": 16,
        },
        {
            "source": 5,
            "target": 4,
            "value": 6,
        },
        {
            "source": 5,
            "target": 6,
            "value": 0,
        },
        {
            "source": 6,
            "target": 7,
            "value": 2,
        },
        {
            "source": 6,
            "target": 9,
            "value": 1,
        },
        {
            "source": 6,
            "target": 8,
            "value": 3,
        },
        {
            "source": 10,
            "target": 7,
            "value": 1
        }
    ]
}



graph = sankey(jobs);

link = link
    .data(jobs.links)
    .enter().append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", function (d) { return Math.max(1, d.width); });

link.append("title")
    .text(function (d) { return d.source.name + " -> " + d.target.name + "\n" + format(d.value); });

node = node
    .data(jobs.nodes)
    .enter().append("g")
    .call(d3.drag()
        .subject(function (d) { return d })
        .on('start', function () { this.parentNode.appendChild(this); })
        .on('drag', dragmove));

node.append("rect")
    .attr("x", function (d) { return d.x0; })
    .attr("y", function (d) { return d.y0; })
    .attr("height", function (d) { return d.y1 - d.y0; })
    .attr("width", function (d) { return d.x1 - d.x0; })
    .attr("fill", function (d) { console.log(d.index); return color(d.index); })
    .attr("stroke", "#000");

link
    .style('stroke', function (d) {
        return color(d.source.index);
    })

node.append("text")
    .attr("x", function (d) { return d.x0 - 6; })
    .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(function (d) { return d.name; })
    .filter(function (d) { return d.x0 < width / 2; })
    .attr("x", function (d) { return d.x1 + 6; })
    .attr("text-anchor", "start");

node.append("title")
    .text(function (d) { return d.name + "\n" + format(d.value); });



// the function for moving the nodes
function dragmove(d) {

    var rectY = d3.select(this).select("rect").attr("y");

    d.y0 = d.y0 + d3.event.dy;

    var yTranslate = d.y0 - rectY;

    d3.select(this).attr("transform",
        "translate(0" + "," + (yTranslate) + ")");

    sankey.update(graph);
    link.attr("d", d3.sankeyLinkHorizontal());
}

