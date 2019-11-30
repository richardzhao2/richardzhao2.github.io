  /* const canvas = */ d3.select('canvas')
  .style('position', 'absolute');

var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

var formatNumber = d3.format('.0%');
var format = d => `${formatNumber(d)}`;

var color = d3.scaleOrdinal(d3.schemeCategory10);;

var sankey_svg = d3.select('#sankeysvg')
  .style('position', 'relative')
  .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
  .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
  .append('g')
  .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .size([sankey_width, sankey_height]);

var path = sankey.link();

var picker = d3.select("#year");

d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/black_sankey.json').then(function (graph) {
  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);
  const link = sankey_svg.append('g').selectAll('.link')
    .data(graph.links)
    .enter().append('path')
    .attr('class', 'link')
    .attr('d', path)
    .style('stroke-width', function (d) { return Math.max(1, d.dy); })
    .style('fill', 'none')
    .style('stroke', '#000')
    .style('stroke-opacity', 0.15)
    .sort(function (a, b) { return b.dy - a.dy; });

  link
    .on('mouseover', function () {
      d3.select(this)
        .style('stroke-opacity', 0.25);
    })
    .on('mouseout', function () {
      d3.select(this)
        .style('stroke-opacity', 0.15);
    });

  link.append('title')
    .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

  const node = sankey_svg.append('g').selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
  /*
  .call(d3.drag()
  .origin(function(d) { return d; })
  .on('dragstart', function () { this.parentNode.appendChild(this); })
  .on('drag', dragmove));*/

  node.append('rect')
    .attr('height', function (d) { return d.dy })
    .attr('width', sankey.nodeWidth())
    .style('fill', (d, i) => {
      // d.color = color(d.name.replace(/ .*/, ''));
      d.color = color(i);
      return d.color;
    })
    .style('stroke', 'none')
    //.style('cursor', 'move') // CHANGES THE MOVING PART
    .style('fill-opacity', 0.9)
    .style('shape-rendering', 'crispEdges')
    .append('title')
    .text(function (d) { return `${format(d.value)} ${d.name}`; });

  node.append('text')
    .attr('x', -6)
    .attr('y', d => d.dy / 2)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .style('pointer-events', 'none')
    .style('text-shadow', '0 1px 0 #fff')
    .style('font-size', '12px')
    .text(d => d.name)
    .filter(d => d.x < sankey_width / 2)
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start')
    .style('font-size', '12px');

  function dragmove(d) {
    d3.select(this)
      .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
    sankey.relayout();
    link.attr('d', path);
  }

  const linkExtent = d3.extent(graph.links, d => d.value);

  const frequencyScale = d3.scaleLinear()
    .domain(linkExtent)
    .range([0.05, 1]);

    /* const particleSize = */ d3.scaleLinear()
    .domain(linkExtent)
    .range([1, 5]);

  graph.links.forEach(currentLink => {
    currentLink.freq = frequencyScale(currentLink.value);
    currentLink.particleSize = 2;
    currentLink.particleColor = d3.scaleLinear().domain([0, 1])
      .range([currentLink.source.color, currentLink.target.color]);
  });

    /* const t = */ d3.timer(tick, 1000);
  let particles = [];

  function tick(elapsed /* , time */) {
    particles = particles.filter(d => d.current < d.path.getTotalLength());

    d3.selectAll('path.link')
      .each(
        function (d) {
          for (let x = 0; x < 2; x++) {
            const offset = (Math.random() - 0.5) * (d.dy - 4);
            if (Math.random() < d.freq) {
              const length = this.getTotalLength();
              particles.push({
                link: d,
                time: elapsed,
                offset,
                path: this,
                length,
                animateTime: length,
                speed: 0.5 + (Math.random())
              });
            }
          }
        });

    particleEdgeCanvasPath(elapsed);
  }

  function particleEdgeCanvasPath(elapsed) {
    const context = d3.select('canvas').node().getContext('2d');

    context.clearRect(0, 0, 1000, 1000);

    context.fillStyle = 'gray';
    context.lineWidth = '1px';
    for (const x in particles) {
      if ({}.hasOwnProperty.call(particles, x)) {
        const currentTime = elapsed - particles[x].time;
        particles[x].current = currentTime * 0.15 * particles[x].speed;
        const currentPos = particles[x].path.getPointAtLength(particles[x].current);
        context.beginPath();
        context.fillStyle = particles[x].link.particleColor(0);
        context.arc(
          currentPos.x,
          currentPos.y + particles[x].offset,
          particles[x].link.particleSize,
          0,
          2 * Math.PI
        );
        context.fill();
      }
    }
  }
  // handle on click event
  d3.select('#opts')
    .on('change', function () {
      var newOption = d3.select(this).property('value');
      d3.select("#sankeysvg").selectAll("*").remove();
      //remove_svg.selectAll("*").remove();
      update(newOption);
    });

});


function update(option) {
  if (option == 'asian') {
    var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
    var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
    var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format('.0%');
    var format = d => `${formatNumber(d)}`;

    var color = d3.scaleOrdinal(d3.schemeCategory10);;

    var sankey_svg = d3.select('#sankeysvg')
      .style('position', 'relative')
      .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
      .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
      .append('g')
      .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([sankey_width, sankey_height]);

    var path = sankey.link();

    var picker = d3.select("#year");
    d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/asian_sankey.json').then(function (graph) {
      console.log('here')
      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);
      const link = sankey_svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('stroke-opacity', 0.15)
        .sort(function (a, b) { return b.dy - a.dy; });

      link
        .on('mouseover', function () {
          d3.select(this)
            .style('stroke-opacity', 0.25);
        })
        .on('mouseout', function () {
          d3.select(this)
            .style('stroke-opacity', 0.15);
        });

      link.append('title')
        .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

      const node = sankey_svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
      /*
      .call(d3.drag()
      .origin(function(d) { return d; })
      .on('dragstart', function () { this.parentNode.appendChild(this); })
      .on('drag', dragmove));*/

      node.append('rect')
        .attr('height', function (d) { return d.dy })
        .attr('width', sankey.nodeWidth())
        .style('fill', (d, i) => {
          // d.color = color(d.name.replace(/ .*/, ''));
          d.color = color(i);
          return d.color;
        })
        .style('stroke', 'none')
        //.style('cursor', 'move') // CHANGES THE MOVING PART
        .style('fill-opacity', 0.9)
        .style('shape-rendering', 'crispEdges')
        .append('title')
        .text(function (d) { return `${format(d.value)} ${d.name}`; });

      node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 0 #fff')
        .style('font-size', '12px')
        .text(d => d.name)
        .filter(d => d.x < sankey_width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')
        .style('font-size', '12px');

      function dragmove(d) {
        d3.select(this)
          .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
        sankey.relayout();
        link.attr('d', path);
      }

      const linkExtent = d3.extent(graph.links, d => d.value);

      const frequencyScale = d3.scaleLinear()
        .domain(linkExtent)
        .range([0.05, 1]);

  /* const particleSize = */ d3.scaleLinear()
        .domain(linkExtent)
        .range([1, 5]);

      graph.links.forEach(currentLink => {
        currentLink.freq = frequencyScale(currentLink.value);
        currentLink.particleSize = 2;
        currentLink.particleColor = d3.scaleLinear().domain([0, 1])
          .range([currentLink.source.color, currentLink.target.color]);
      });

  /* const t = */ d3.timer(tick, 1000);
      let particles = [];

      function tick(elapsed /* , time */) {
        particles = particles.filter(d => d.current < d.path.getTotalLength());

        d3.selectAll('path.link')
          .each(
            function (d) {
              for (let x = 0; x < 2; x++) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({
                    link: d,
                    time: elapsed,
                    offset,
                    path: this,
                    length,
                    animateTime: length,
                    speed: 0.5 + (Math.random())
                  });
                }
              }
            });

        particleEdgeCanvasPath(elapsed);
      }

      function particleEdgeCanvasPath(elapsed) {
        const context = d3.select('canvas').node().getContext('2d');

        context.clearRect(0, 0, 1000, 1000);

        context.fillStyle = 'gray';
        context.lineWidth = '1px';
        for (const x in particles) {
          if ({}.hasOwnProperty.call(particles, x)) {
            const currentTime = elapsed - particles[x].time;
            particles[x].current = currentTime * 0.15 * particles[x].speed;
            const currentPos = particles[x].path.getPointAtLength(particles[x].current);
            context.beginPath();
            context.fillStyle = particles[x].link.particleColor(0);
            context.arc(
              currentPos.x,
              currentPos.y + particles[x].offset,
              particles[x].link.particleSize,
              0,
              2 * Math.PI
            );
            context.fill();
          }
        }
      }
    });
  } else if (option == "hmong") {
    var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
    var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
    var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format('.0%');
    var format = d => `${formatNumber(d)}`;

    var color = d3.scaleOrdinal(d3.schemeCategory10);;

    var sankey_svg = d3.select('#sankeysvg')
      .style('position', 'relative')
      .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
      .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
      .append('g')
      .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([sankey_width, sankey_height]);

    var path = sankey.link();

    var picker = d3.select("#year");
    d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/hmong_sankey.json').then(function (graph) {
      console.log('here')
      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);
      const link = sankey_svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('stroke-opacity', 0.15)
        .sort(function (a, b) { return b.dy - a.dy; });

      link
        .on('mouseover', function () {
          d3.select(this)
            .style('stroke-opacity', 0.25);
        })
        .on('mouseout', function () {
          d3.select(this)
            .style('stroke-opacity', 0.15);
        });

      link.append('title')
        .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

      const node = sankey_svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
      /*
      .call(d3.drag()
      .origin(function(d) { return d; })
      .on('dragstart', function () { this.parentNode.appendChild(this); })
      .on('drag', dragmove));*/

      node.append('rect')
        .attr('height', function (d) { return d.dy })
        .attr('width', sankey.nodeWidth())
        .style('fill', (d, i) => {
          // d.color = color(d.name.replace(/ .*/, ''));
          d.color = color(i);
          return d.color;
        })
        .style('stroke', 'none')
        //.style('cursor', 'move') // CHANGES THE MOVING PART
        .style('fill-opacity', 0.9)
        .style('shape-rendering', 'crispEdges')
        .append('title')
        .text(function (d) { return `${format(d.value)} ${d.name}`; });

      node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 0 #fff')
        .style('font-size', '12px')
        .text(d => d.name)
        .filter(d => d.x < sankey_width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')
        .style('font-size', '12px');

      function dragmove(d) {
        d3.select(this)
          .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
        sankey.relayout();
        link.attr('d', path);
      }

      const linkExtent = d3.extent(graph.links, d => d.value);

      const frequencyScale = d3.scaleLinear()
        .domain(linkExtent)
        .range([0.05, 1]);

  /* const particleSize = */ d3.scaleLinear()
        .domain(linkExtent)
        .range([1, 5]);

      graph.links.forEach(currentLink => {
        currentLink.freq = frequencyScale(currentLink.value);
        currentLink.particleSize = 2;
        currentLink.particleColor = d3.scaleLinear().domain([0, 1])
          .range([currentLink.source.color, currentLink.target.color]);
      });

  /* const t = */ d3.timer(tick, 1000);
      let particles = [];

      function tick(elapsed /* , time */) {
        particles = particles.filter(d => d.current < d.path.getTotalLength());

        d3.selectAll('path.link')
          .each(
            function (d) {
              for (let x = 0; x < 2; x++) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({
                    link: d,
                    time: elapsed,
                    offset,
                    path: this,
                    length,
                    animateTime: length,
                    speed: 0.5 + (Math.random())
                  });
                }
              }
            });

        particleEdgeCanvasPath(elapsed);
      }

      function particleEdgeCanvasPath(elapsed) {
        const context = d3.select('canvas').node().getContext('2d');

        context.clearRect(0, 0, 1000, 1000);

        context.fillStyle = 'gray';
        context.lineWidth = '1px';
        for (const x in particles) {
          if ({}.hasOwnProperty.call(particles, x)) {
            const currentTime = elapsed - particles[x].time;
            particles[x].current = currentTime * 0.15 * particles[x].speed;
            const currentPos = particles[x].path.getPointAtLength(particles[x].current);
            context.beginPath();
            context.fillStyle = particles[x].link.particleColor(0);
            context.arc(
              currentPos.x,
              currentPos.y + particles[x].offset,
              particles[x].link.particleSize,
              0,
              2 * Math.PI
            );
            context.fill();
          }
        }
      }
    });
  } else if (option == "black") {
    var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
    var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
    var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format('.0%');
    var format = d => `${formatNumber(d)}`;

    var color = d3.scaleOrdinal(d3.schemeCategory10);;

    var sankey_svg = d3.select('#sankeysvg')
      .style('position', 'relative')
      .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
      .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
      .append('g')
      .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([sankey_width, sankey_height]);

    var path = sankey.link();

    var picker = d3.select("#year");
    d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/black_sankey.json').then(function (graph) {
      console.log('here')
      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);
      const link = sankey_svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('stroke-opacity', 0.15)
        .sort(function (a, b) { return b.dy - a.dy; });

      link
        .on('mouseover', function () {
          d3.select(this)
            .style('stroke-opacity', 0.25);
        })
        .on('mouseout', function () {
          d3.select(this)
            .style('stroke-opacity', 0.15);
        });

      link.append('title')
        .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

      const node = sankey_svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
      /*
      .call(d3.drag()
      .origin(function(d) { return d; })
      .on('dragstart', function () { this.parentNode.appendChild(this); })
      .on('drag', dragmove));*/

      node.append('rect')
        .attr('height', function (d) { return d.dy })
        .attr('width', sankey.nodeWidth())
        .style('fill', (d, i) => {
          // d.color = color(d.name.replace(/ .*/, ''));
          d.color = color(i);
          return d.color;
        })
        .style('stroke', 'none')
        //.style('cursor', 'move') // CHANGES THE MOVING PART
        .style('fill-opacity', 0.9)
        .style('shape-rendering', 'crispEdges')
        .append('title')
        .text(function (d) { return `${format(d.value)} ${d.name}`; });

      node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 0 #fff')
        .style('font-size', '12px')
        .text(d => d.name)
        .filter(d => d.x < sankey_width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')
        .style('font-size', '12px');

      function dragmove(d) {
        d3.select(this)
          .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
        sankey.relayout();
        link.attr('d', path);
      }

      const linkExtent = d3.extent(graph.links, d => d.value);

      const frequencyScale = d3.scaleLinear()
        .domain(linkExtent)
        .range([0.05, 1]);

  /* const particleSize = */ d3.scaleLinear()
        .domain(linkExtent)
        .range([1, 5]);

      graph.links.forEach(currentLink => {
        currentLink.freq = frequencyScale(currentLink.value);
        currentLink.particleSize = 2;
        currentLink.particleColor = d3.scaleLinear().domain([0, 1])
          .range([currentLink.source.color, currentLink.target.color]);
      });

  /* const t = */ d3.timer(tick, 1000);
      let particles = [];

      function tick(elapsed /* , time */) {
        particles = particles.filter(d => d.current < d.path.getTotalLength());

        d3.selectAll('path.link')
          .each(
            function (d) {
              for (let x = 0; x < 2; x++) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({
                    link: d,
                    time: elapsed,
                    offset,
                    path: this,
                    length,
                    animateTime: length,
                    speed: 0.5 + (Math.random())
                  });
                }
              }
            });

        particleEdgeCanvasPath(elapsed);
      }

      function particleEdgeCanvasPath(elapsed) {
        const context = d3.select('canvas').node().getContext('2d');

        context.clearRect(0, 0, 1000, 1000);

        context.fillStyle = 'gray';
        context.lineWidth = '1px';
        for (const x in particles) {
          if ({}.hasOwnProperty.call(particles, x)) {
            const currentTime = elapsed - particles[x].time;
            particles[x].current = currentTime * 0.15 * particles[x].speed;
            const currentPos = particles[x].path.getPointAtLength(particles[x].current);
            context.beginPath();
            context.fillStyle = particles[x].link.particleColor(0);
            context.arc(
              currentPos.x,
              currentPos.y + particles[x].offset,
              particles[x].link.particleSize,
              0,
              2 * Math.PI
            );
            context.fill();
          }
        }
      }
    });
  } else if (option == "native") {
    var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
    var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
    var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format('.0%');
    var format = d => `${formatNumber(d)}`;

    var color = d3.scaleOrdinal(d3.schemeCategory10);;

    var sankey_svg = d3.select('#sankeysvg')
      .style('position', 'relative')
      .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
      .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
      .append('g')
      .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([sankey_width, sankey_height]);

    var path = sankey.link();

    var picker = d3.select("#year");
    d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/native_american_sankey.json').then(function (graph) {
      console.log('here')
      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);
      const link = sankey_svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('stroke-opacity', 0.15)
        .sort(function (a, b) { return b.dy - a.dy; });

      link
        .on('mouseover', function () {
          d3.select(this)
            .style('stroke-opacity', 0.25);
        })
        .on('mouseout', function () {
          d3.select(this)
            .style('stroke-opacity', 0.15);
        });

      link.append('title')
        .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

      const node = sankey_svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
      /*
      .call(d3.drag()
      .origin(function(d) { return d; })
      .on('dragstart', function () { this.parentNode.appendChild(this); })
      .on('drag', dragmove));*/

      node.append('rect')
        .attr('height', function (d) { return d.dy })
        .attr('width', sankey.nodeWidth())
        .style('fill', (d, i) => {
          // d.color = color(d.name.replace(/ .*/, ''));
          d.color = color(i);
          return d.color;
        })
        .style('stroke', 'none')
        //.style('cursor', 'move') // CHANGES THE MOVING PART
        .style('fill-opacity', 0.9)
        .style('shape-rendering', 'crispEdges')
        .append('title')
        .text(function (d) { return `${format(d.value)} ${d.name}`; });

      node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 0 #fff')
        .style('font-size', '12px')
        .text(d => d.name)
        .filter(d => d.x < sankey_width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')
        .style('font-size', '12px');

      function dragmove(d) {
        d3.select(this)
          .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
        sankey.relayout();
        link.attr('d', path);
      }

      const linkExtent = d3.extent(graph.links, d => d.value);

      const frequencyScale = d3.scaleLinear()
        .domain(linkExtent)
        .range([0.05, 1]);

  /* const particleSize = */ d3.scaleLinear()
        .domain(linkExtent)
        .range([1, 5]);

      graph.links.forEach(currentLink => {
        currentLink.freq = frequencyScale(currentLink.value);
        currentLink.particleSize = 2;
        currentLink.particleColor = d3.scaleLinear().domain([0, 1])
          .range([currentLink.source.color, currentLink.target.color]);
      });

  /* const t = */ d3.timer(tick, 1000);
      let particles = [];

      function tick(elapsed /* , time */) {
        particles = particles.filter(d => d.current < d.path.getTotalLength());

        d3.selectAll('path.link')
          .each(
            function (d) {
              for (let x = 0; x < 2; x++) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({
                    link: d,
                    time: elapsed,
                    offset,
                    path: this,
                    length,
                    animateTime: length,
                    speed: 0.5 + (Math.random())
                  });
                }
              }
            });

        particleEdgeCanvasPath(elapsed);
      }

      function particleEdgeCanvasPath(elapsed) {
        const context = d3.select('canvas').node().getContext('2d');

        context.clearRect(0, 0, 1000, 1000);

        context.fillStyle = 'gray';
        context.lineWidth = '1px';
        for (const x in particles) {
          if ({}.hasOwnProperty.call(particles, x)) {
            const currentTime = elapsed - particles[x].time;
            particles[x].current = currentTime * 0.15 * particles[x].speed;
            const currentPos = particles[x].path.getPointAtLength(particles[x].current);
            context.beginPath();
            context.fillStyle = particles[x].link.particleColor(0);
            context.arc(
              currentPos.x,
              currentPos.y + particles[x].offset,
              particles[x].link.particleSize,
              0,
              2 * Math.PI
            );
            context.fill();
          }
        }
      }
    });

  } else if (option == "white") {
    var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
    var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
    var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format('.0%');
    var format = d => `${formatNumber(d)}`;

    var color = d3.scaleOrdinal(d3.schemeCategory10);;

    var sankey_svg = d3.select('#sankeysvg')
      .style('position', 'relative')
      .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
      .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
      .append('g')
      .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([sankey_width, sankey_height]);

    var path = sankey.link();

    var picker = d3.select("#year");
    d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/caucasian_sankey.json').then(function (graph) {
      console.log('here')
      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);
      const link = sankey_svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('stroke-opacity', 0.15)
        .sort(function (a, b) { return b.dy - a.dy; });

      link
        .on('mouseover', function () {
          d3.select(this)
            .style('stroke-opacity', 0.25);
        })
        .on('mouseout', function () {
          d3.select(this)
            .style('stroke-opacity', 0.15);
        });

      link.append('title')
        .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

      const node = sankey_svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

      node.append('rect')
        .attr('height', function (d) { return d.dy })
        .attr('width', sankey.nodeWidth())
        .style('fill', (d, i) => {
          d.color = color(i);
          return d.color;
        })
        .style('stroke', 'none')
        //.style('cursor', 'move') // CHANGES THE MOVING PART
        .style('fill-opacity', 0.9)
        .style('shape-rendering', 'crispEdges')
        .append('title')
        .text(function (d) { return `${format(d.value)} ${d.name}`; });

      node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 0 #fff')
        .style('font-size', '12px')
        .text(d => d.name)
        .filter(d => d.x < sankey_width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')
        .style('font-size', '12px');

      function dragmove(d) {
        d3.select(this)
          .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
        sankey.relayout();
        link.attr('d', path);
      }

      const linkExtent = d3.extent(graph.links, d => d.value);

      const frequencyScale = d3.scaleLinear()
        .domain(linkExtent)
        .range([0.05, 1]);

  /* const particleSize = */ d3.scaleLinear()
        .domain(linkExtent)
        .range([1, 5]);

      graph.links.forEach(currentLink => {
        currentLink.freq = frequencyScale(currentLink.value);
        currentLink.particleSize = 2;
        currentLink.particleColor = d3.scaleLinear().domain([0, 1])
          .range([currentLink.source.color, currentLink.target.color]);
      });

  /* const t = */ d3.timer(tick, 1000);
      let particles = [];

      function tick(elapsed /* , time */) {
        particles = particles.filter(d => d.current < d.path.getTotalLength());

        d3.selectAll('path.link')
          .each(
            function (d) {
              for (let x = 0; x < 2; x++) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({
                    link: d,
                    time: elapsed,
                    offset,
                    path: this,
                    length,
                    animateTime: length,
                    speed: 0.5 + (Math.random())
                  });
                }
              }
            });

        particleEdgeCanvasPath(elapsed);
      }

      function particleEdgeCanvasPath(elapsed) {
        const context = d3.select('canvas').node().getContext('2d');

        context.clearRect(0, 0, 1000, 1000);

        context.fillStyle = 'gray';
        context.lineWidth = '1px';
        for (const x in particles) {
          if ({}.hasOwnProperty.call(particles, x)) {
            const currentTime = elapsed - particles[x].time;
            particles[x].current = currentTime * 0.15 * particles[x].speed;
            const currentPos = particles[x].path.getPointAtLength(particles[x].current);
            context.beginPath();
            context.fillStyle = particles[x].link.particleColor(0);
            context.arc(
              currentPos.x,
              currentPos.y + particles[x].offset,
              particles[x].link.particleSize,
              0,
              2 * Math.PI
            );
            context.fill();
          }
        }
      }
    });

  } else {
    var sankey_margin = { top: 1, right: 1, bottom: 6, left: 1 };
    var sankey_width = 750 - sankey_margin.left - sankey_margin.right;
    var sankey_height = 450 - sankey_margin.top - sankey_margin.bottom;

    var formatNumber = d3.format('.0%');
    var format = d => `${formatNumber(d)}`;

    var color = d3.scaleOrdinal(d3.schemeCategory10);;

    var sankey_svg = d3.select('#sankeysvg')
      .style('position', 'relative')
      .attr('width', sankey_width + sankey_margin.left + sankey_margin.right)
      .attr('height', sankey_height + sankey_margin.top + sankey_margin.bottom)
      .append('g')
      .attr('transform', `translate(${sankey_margin.left}, ${sankey_margin.top})`);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([sankey_width, sankey_height]);

    var path = sankey.link();

    var picker = d3.select("#year");
    d3.json('https://raw.githubusercontent.com/richardzhao2/hmong_datasets/master/latino_sankey.json').then(function (graph) {
      console.log('here')
      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);
      const link = sankey_svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('stroke-opacity', 0.15)
        .sort(function (a, b) { return b.dy - a.dy; });

      link
        .on('mouseover', function () {
          d3.select(this)
            .style('stroke-opacity', 0.25);
        })
        .on('mouseout', function () {
          d3.select(this)
            .style('stroke-opacity', 0.15);
        });

      link.append('title')
        .text(d => `${format(d.label)} of ${d.source.name} → ${d.target.name}\n${format(d.value)} of ${graph.nodes[0].name}`)

      const node = sankey_svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
      /*
      .call(d3.drag()
      .origin(function(d) { return d; })
      .on('dragstart', function () { this.parentNode.appendChild(this); })
      .on('drag', dragmove));*/

      node.append('rect')
        .attr('height', function (d) { return d.dy })
        .attr('width', sankey.nodeWidth())
        .style('fill', (d, i) => {
          // d.color = color(d.name.replace(/ .*/, ''));
          d.color = color(i);
          return d.color;
        })
        .style('stroke', 'none')
        //.style('cursor', 'move') // CHANGES THE MOVING PART
        .style('fill-opacity', 0.9)
        .style('shape-rendering', 'crispEdges')
        .append('title')
        .text(function (d) { return `${format(d.value)} ${d.name}`; });

      node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 0 #fff')
        .style('font-size', '12px')
        .text(d => d.name)
        .filter(d => d.x < sankey_width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')
        .style('font-size', '12px');

      function dragmove(d) {
        d3.select(this)
          .attr('transform', `translate(${d.x}, ${(d.y = Math.max(0, Math.min(sankey_height - d.dy, d3.event.y)))})`);
        sankey.relayout();
        link.attr('d', path);
      }

      const linkExtent = d3.extent(graph.links, d => d.value);

      const frequencyScale = d3.scaleLinear()
        .domain(linkExtent)
        .range([0.05, 1]);

  /* const particleSize = */ d3.scaleLinear()
        .domain(linkExtent)
        .range([1, 5]);

      graph.links.forEach(currentLink => {
        currentLink.freq = frequencyScale(currentLink.value);
        currentLink.particleSize = 2;
        currentLink.particleColor = d3.scaleLinear().domain([0, 1])
          .range([currentLink.source.color, currentLink.target.color]);
      });

  /* const t = */ d3.timer(tick, 1000);
      let particles = [];

      function tick(elapsed /* , time */) {
        particles = particles.filter(d => d.current < d.path.getTotalLength());

        d3.selectAll('path.link')
          .each(
            function (d) {
              for (let x = 0; x < 2; x++) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({
                    link: d,
                    time: elapsed,
                    offset,
                    path: this,
                    length,
                    animateTime: length,
                    speed: 0.5 + (Math.random())
                  });
                }
              }
            });

        particleEdgeCanvasPath(elapsed);
      }

      function particleEdgeCanvasPath(elapsed) {
        const context = d3.select('canvas').node().getContext('2d');

        context.clearRect(0, 0, 1000, 1000);

        context.fillStyle = 'gray';
        context.lineWidth = '1px';
        for (const x in particles) {
          if ({}.hasOwnProperty.call(particles, x)) {
            const currentTime = elapsed - particles[x].time;
            particles[x].current = currentTime * 0.15 * particles[x].speed;
            const currentPos = particles[x].path.getPointAtLength(particles[x].current);
            context.beginPath();
            context.fillStyle = particles[x].link.particleColor(0);
            context.arc(
              currentPos.x,
              currentPos.y + particles[x].offset,
              particles[x].link.particleSize,
              0,
              2 * Math.PI
            );
            context.fill();
          }
        }
      }
    });
  }


}
