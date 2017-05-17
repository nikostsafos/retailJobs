(function () {

var contentWidth = document.getElementById('content').clientWidth;

var plotWidth;
  if (contentWidth >= 800) {plotWidth = contentWidth/2.01;} 
  else if (contentWidth >= 500) {plotWidth = contentWidth/2.01;}
  else { plotWidth = contentWidth/1; }

var plotHeight;
  if (contentWidth >= 800) {plotHeight = plotWidth/1.5;} 
  else if (contentWidth >= 500) {plotHeight = plotWidth/1.5;} 
  else { plotHeight = plotWidth/1.5; }

  var margin = {top: 20, right: 20, bottom: 20, left: 30},
      width = plotWidth - margin.left - margin.right,
      height = plotHeight - margin.top - margin.bottom;

  var parseTime = d3.timeParse('%Y-%m-%d');

  // x function map the circles along the x axis
  var x = d3.scaleTime().range([0, width]);

  // y function map the variables along the y axis
  var y = d3.scaleLinear().domain([0,1]).range([height, 0]);

  var drawLine = d3.line()
               .x(function (d) {return x(d.Date);})
               .y(function (d) {return y(d.Value)});     

    d3.csv("data/transport.csv", type, function(error, data) {
      if (error) throw error;

      var sectors = d3.nest()
          .key(function(d) { return d.Industry; })
          .entries(data);

      var svg = d3.select("#transport").selectAll("svg")
          .data(sectors)
          .enter().append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(d3.extent(data, function(d) { return d.Date; }));
    
      svg.append('path')
         .attr('class', 'line')
         .attr("fill", "None")
         .attr("stroke", '#01665e')
         .attr('stroke-width', 3)
         .attr('d', function (sector) { return drawLine(sector.values);});
            
      svg.append("text")
          .attr("x", width/2)
          .attr("y", -6)
          .attr('text-anchor', 'middle')
          .text(function(d) { return d.key; });

      // Append x axis 
      svg.append("g")
         .attr('class', 'xaxis')
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x).ticks(6));

      // Append y axis
      svg.append("g")
         .attr('class', 'yaxis')
         .call(d3.axisLeft(y)
         .ticks(6));
    
    });
      
    function type(d) {
      d.Date = parseTime(d.Date);
      d.Industry = d.Industry;
      d.Value = +d.Value;
      return d;
    }


})();
