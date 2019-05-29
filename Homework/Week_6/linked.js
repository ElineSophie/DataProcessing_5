window.onload = function loadData(){
  d3v5.json("data/HPI_data.json").then(data => {
    hpi = hpi_index(data);
    dataset = map(hpi);
  });
};

function hpi_index(data){
  // Get max and min Happy Planet Index
  var max = -Infinity;
  var min = Infinity;
  Object.keys(data).forEach(function(key){
      if (data[key]["Happy Planet Index"] > max) {
        max = data[key]["Happy Planet Index"]}
      if (data[key]["Happy Planet Index"] < min) {
        min = data[key]["Happy Planet Index"]
    }
  });

  // Use max and min for color ranging
  var colorScale = d3v5.scaleThreshold()
                      .domain([(1/3 * max),
                               (2/3 * max),
                               (max)])
                      .range(["Low", "Medium", "High"]);

  // Add fillkey
  Object.keys(data).forEach(function(key){
    data[key]["fillKey"] = colorScale(data[key]["Happy Planet Index"])
  });
  return data;
  };

function map(hpi){
  console.log(hpi);
  var map = new Datamap({
    element: document.getElementById('datamap'),
    fills: {
            Low: '#FF0000',
            Medium: '#FF8000',
            High: '#009900',
          defaultFill: '#808080'},
    data: hpi,
    geographyConfig: {
          highlightBorderColor: '#bada55',
          highlightBorderWidth: 3,
          popupTemplate: function(geography, data) {
            if(data){
              return '<div class="hoverinfo"><strong>' + data["Country"] +
              '</strong> <br>HPI Rank: ' + data["HPI Rank"] +
              '<br> Happy Planet Index: ' + data["Happy Planet Index"] + '</br></div>';
            }
            else{
              return "<div class='hoverinfo'><b>Country: </b>" +
                            geography.properties.name +
                            "</br><i>No data available</i></div>";
                }
          },
        },
        done: function(datamap){
          datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography, d){
            console.log(geography);
            console.log(d)
            if (hpi[geography.id]){
              update(hpi[geography.id]);
            };
          })
        }
  });
  map.legend({
    legendTitle : "Low to high HPI",
    defaultFillName: "No data available"
  });

};

function update(x){
  bargraph1(x["Average Life Expectancy"], x.GlobalAverageLifeExpectancy);
  bargraph2(x["Average Wellbeing (0-10)"], x.GlobalAverageWellBeing)
};

function bargraph1(lifeexpectancy, globallifeexpectancy){

  // Remove any previous graphs
    d3v5.selectAll("rect")
        .remove();

    var w = 400;
    var h = 350;

    // Getting DOM element
    var svg1 = d3v5.select("#barcontainer1")
                   .attr("width", w)
                   .attr("height", h);


    // Create margins and dimensions for the graph
    var margin = {top: 20, right: 20, bottom: 80, left: 80};
    var graphWidth = w - margin.left - margin.right;
    var graphHeight = h - margin.top - margin.bottom;

    // Append a group to svg and save as graph
    var graph = svg1.append('g')
                  .attr("width", graphWidth)
                  .attr("height", graphHeight)
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create groups for x and y
    var xAxis = graph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`);

    var yAxis = graph.append('g');

    // Set scales for axis
    var yScale = d3v5.scaleLinear()
                    .domain([0, 100])
                    .range([graphHeight, 0]);

    var list = ["Average Life Expectancy", "Global Average Life Expectancy"];

    var xScale = d3v5.scaleBand()
                        .domain(list)
                        .range([0, graphWidth])
                        .paddingInner(0.3)
                        .paddingOuter(0.3);

    // Join the data to the rectangles
    var rect = graph.selectAll("rect")
                    .data([lifeexpectancy, globallifeexpectancy]);

    // Add attributes to the rectangles
    rect.enter()
        .append("rect")
        .attr("width", xScale.bandwidth)
        .attr("height", d => graphHeight - yScale(d))
        .attr("fill", "blue")
        .attr("x", (d, i) => xScale(list[i]))
        .attr("y", d => yScale(d));


    // Create and call the axes
    var x = d3v5.axisBottom(xScale);
    var y = d3v5.axisLeft(yScale)
              .ticks(5);

    xAxis.call(x);
    yAxis.call(y);

    // Append text to the graph
    svg1.append("text")
        .attr("x", (-h / 2.2))
        .attr("y", 50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text("Average Life Expectancy");

    svg1.append("text")
        .attr("x", w / 1.8)
        .attr('y', 320)
        .attr('text-anchor', 'middle')
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text("Country vs. Global rate");

};

function bargraph2(wellbeing, globalwellbeing){

    // Remove any previous graphs
    d3v5.selectAll("rect2")
        .remove();

    var w = 400;
    var h = 350;

    // Getting DOM element
    var svg2 = d3v5.select("#barcontainer2")
                   .attr("width", w)
                   .attr("height", h);

    // Create margins and dimensions for the graph
    var margin = {top: 20, right: 20, bottom: 80, left: 80};
    var graphWidth = w - margin.left - margin.right;
    var graphHeight = h - margin.top - margin.bottom;

    // Append a group to svg and save as graph
    var graph = svg2.append('g')
                  .attr("width", graphWidth)
                  .attr("height", graphHeight)
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create groups for x and y
    var xAxis = graph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`);

    var yAxis = graph.append('g');

    // Set scales for axis
    var yScale = d3v5.scaleLinear()
                    .domain([0, 10])
                    .range([graphHeight, 0]);

    var list = ["Average Wellbeing (0-10)", "Global AverageWell Being"];

    var xScale = d3v5.scaleBand()
                        .domain(list)
                        .range([0, graphWidth])
                        .paddingInner(0.3)
                        .paddingOuter(0.3);

    // Join the data to the rectangles
    var rect2 = graph.selectAll("rect")
                    .data([wellbeing, globalwellbeing]);

    // Add attributes to the rectangles
    rect2.enter()
        .append("rect")
        .attr("width", xScale.bandwidth)
        .attr("height", d => graphHeight - yScale(d))
        .attr("fill", "black")
        .attr("x", (d, i) => xScale(list[i]))
        .attr("y", d => yScale(d));

    // Create and call the axes
    var x = d3v5.axisBottom(xScale);
    var y = d3v5.axisLeft(yScale)
              .ticks(5);

    xAxis.call(x);
    yAxis.call(y);

    // Append text to the graph
    svg2.append("text")
        .attr("x", (-h / 2.2))
        .attr("y", 50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text("Average Well Being (0-10)");

    svg2.append("text")
        .attr("x", w / 1.8)
        .attr('y', 320)
        .attr('text-anchor', 'middle')
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text("Country vs. Global rate");
};
