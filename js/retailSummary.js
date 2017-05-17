(function() {

var contentWidth = document.getElementById('content').clientWidth;

var plotRow;
  if (contentWidth >= 600) {plotRow = 1} 
  else { plotRow = 1; }

var xWidth = contentWidth / plotRow;
var yHeight = contentWidth / plotRow/2.5;

graphRetailTotal('#retailSummary', xWidth, yHeight);
graphRetailGrowth('#retailShare', xWidth, yHeight);

  // function lineFuelMix(pageid, country, plots, w, h) {
function graphRetailTotal (pageid, w, h) {

  // Set margin parameters 
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
              width = w - margin.left - margin.right,
              height = h - margin.top - margin.bottom;

  var parseTime = d3.timeParse('%Y-%m-%d');

  // x function map the circles along the x axis
  var x = d3.scaleTime().range([0, width]);

  // y function map the variables along the y axis
  var y = d3.scaleLinear().range([height, 0]);
  
  // Read in data 
  d3.csv('data/retailSummary.csv', function(error, data) {  
    data.forEach(function(d) {
      d.Date = parseTime(d.Date);
      d.Retail = +d.Retail;
      d.RetailPCT = +d.RetailPCT;
      d.RetailGrowth = +d.RetailGrowth;
    });

    // Create function for rendering lines 
    var lineTotal = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.Retail); });

    // Create SVG item 
    var svgLineChart = d3.select(pageid)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the functions defined above with range from variables 
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain([0, d3.max(data, function(d) { return d.Retail; })]);

    // Append x axis 
    svgLineChart.append("g")
        .attr('class', 'xaxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        // .tickFormat(d3.format(".0f"))
        // .tickValues([1930, 1950, 1970, 1990, 2010]));

    // Append y axis
    svgLineChart.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(y)
        .ticks(5));

    // Append text for y axis label
    svgLineChart.append('text')
       .attr('class', 'yaxis')
       .attr('transform', 'rotate(-90)')
       .attr('y', -40)
       .attr('x', -height/2)
       .style('text-anchor', 'middle')
       .attr('dy', '.71em')
       .text('million (seasonally adjusted)');
    
    // Draw line 
    svgLineChart.append("path")
        .datum(data.filter(function(d) { return d; }))
        .attr("fill", "None")
        .attr("stroke", '#8c510a')
        .attr("stroke-width", 2)
        .attr("d", lineTotal);

    // text label for the x axis
    // svgLineChart.append("text")
    //     .attr('x', width/2)
    //     .attr("y", -6)
    //     .style('text-anchor', 'middle')
    //     .text('Total Retail Employment');
    });
    return this;
}

function graphRetailGrowth (pageid, w, h) {
  // Set margin parameters 
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
              width = w - margin.left - margin.right,
              height = h - margin.top - margin.bottom;

  var parseTime = d3.timeParse('%Y-%m-%d');

  // x function map the circles along the x axis
  var x = d3.scaleTime().range([0, width]);

  // y function map the variables along the y axis
  var y = d3.scaleLinear().domain([8,13]).range([height, 0]);

  // Read in data 
  d3.csv('data/retailSummary.csv', function(error, data) {  
    data.forEach(function(d) {
      d.Date = parseTime(d.Date);
      d.Retail = +d.Retail;
      d.RetailPCT = +d.RetailPCT;
      d.RetailGrowth = +d.RetailGrowth;
    });

    // Create function for rendering lines 
    var linePCT = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.RetailPCT); });

    // Create SVG item 
    var svgLineChart = d3.select(pageid)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the functions defined above with range from variables 
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    // y.domain(d3.extent(data, function(d) { return d.RetailPCT; }));

    // Append x axis 
    svgLineChart.append("g")
        .attr('class', 'xaxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        // .tickFormat(d3.format(".0f"))
        // .tickValues([1930, 1950, 1970, 1990, 2010]));

    // Append y axis
    svgLineChart.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(y)
        .ticks(5));

    // Append text for y axis label
    svgLineChart.append('text')
       .attr('class', 'yaxis')
       .attr('transform', 'rotate(-90)')
       .attr('y', -40)
       .attr('x', -height/2)
       .style('text-anchor', 'middle')
       .attr('dy', '.71em')
       .text('percent of total non-farm employment');
    
    // Draw line 
    svgLineChart.append("path")
        .datum(data.filter(function(d) { return d; }))
        .attr("fill", "None")
        .attr("stroke", '#8c510a')
        .attr("stroke-width", 2)
        .attr("d", linePCT);

    // text label for the x axis
    // svgLineChart.append("text")
    //     .attr('x', width/2)
    //     .attr("y", -6)
    //     .style('text-anchor', 'middle')
    //     .text('Retail Employment (% of total)');
    });
    return this;
}

})();