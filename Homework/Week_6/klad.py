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
  console.log(max);
  console.log(min);


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
              '</strong> <br> Happy Planet Index: ' + data["Happy Planet Index"] + '</br></div>';
            }
            else{
              return "<div class='hoverinfo'><b>Country: </b>",
                            geography.properties.name, "</br><i>No data",
                            " available from the Happy Planet Index</i>",
                            "</div>";
                }
          },
        },
        done: function(datamap){
          datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography, d){
            console.log(geography);
            console.log(d)
            if (hpi[geography.id]){
              console.log(hpi[geography.id])
              if (hpi[geography.id]["fillKey"] == "Low"){
                var color = "#f7fcb9";
              } else if (hpi[geography.id]["fillKey"] == "Medium"){
                var color = "#addd8e";
              } else {
                var color = "#31a354";
              };

              update(hpi[geography.id]);

            }
          })
        }
  });
  map.legend();

};

function update(x){
  bargraph1(x["Average Life Expectancy"], x.GlobalAverageLifeExpectancy);
  bargraph2(x["Average Wellbeing (0-10)"], x.GlobalAverageWellBeing)
};

function bargraph1(Lifeexpectancy, Global){
    //
    // // Remove any previous graphs
    // d3v5.selectAll("rect")
    //     .remove();

    var w = 500;
    var h = 500;

    // Getting DOM element
    var svg = d3v5.select("#barcontainer1")
                   .attr("width", w)
                   .attr("height", h);

    // Create margins and dimensions for the graph
    var margin = {top: 20, right: 20, bottom: 80, left: 80};
    var graphWidth = w - margin.left - margin.right;
    var graphHeight = h - margin.top - margin.bottom;

    // Append a group to svg and save as graph
    var graph = svg.append('g')
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
                    .data([Lifeexpectancy, Global]);

    // Add attributes to the rectangles
    rect.enter()
        .append("rect")
        .attr("width", xScale.bandwidth)
        .attr("height", d => graphHeight - yScale(Lifeexpectancy))
        .attr("fill", "black")
        .attr("x", (d, i) => xScale(list[i]))
        .attr("y", d => yScale(Lifeexpectancy));


      // Create and call the axes
      var x = d3v5.axisBottom(xScale);
      var y = d3v5.axisLeft(yScale)
                .ticks(3);

      xAxis.call(x);
      yAxis.call(y);

};

function bargraph2(Averagewellbeing, Global){

    // // Remove any previous graphs
    // d3v5.selectAll("#barcontainer2")
    //       .remove();

    var w = 500;
    var h = 500;

    // Getting DOM element
    var svg = d3v5.select("#barcontainer2")
                   .attr("width", w)
                   .attr("height", h);

    console.log(12)
    // Create margins and dimensions for the graph
    var margin = {top: 20, right: 20, bottom: 80, left: 80};
    var graphWidth = w - margin.left - margin.right;
    var graphHeight = h - margin.top - margin.bottom;

    // Append a group to svg and save as graph
    var graph = svg.append('g')
                  .attr("width", graphWidth)
                  .attr("height", graphHeight)
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create groups for x and y
    var xAxis = graph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`);
      console.log(12)
    var yAxis = graph.append('g');

    // Set scales for axis
    var yScale = d3v5.scaleLinear()
                    .domain([0, 100])
                    .range([graphHeight, 0]);

    var list = ["Average Wellbeing (0-10)", "Global AverageWell Being"];

    var xScale = d3v5.scaleBand()
                        .domain(list)
                        .range([0, graphWidth])
                        .paddingInner(0.3)
                        .paddingOuter(0.3);

    // Join the data to the rectangles
    var rect = graph.selectAll("rect")
                    .data([Averagewellbeing, Global]);

    // Add attributes to the rectangles
    rect.enter()
        .append("rect")
        .attr("width", xScale.bandwidth)
        .attr("height", d => graphHeight - yScale(Averagewellbeing))
        .attr("fill", "black")
        .attr("x", (d, i) => xScale(list[i]))
        .attr("y", d => yScale(Averagewellbeing));

      // Create and call the axes
      var x = d3v5.axisBottom(xScale);
      var y = d3v5.axisLeft(yScale)
                .ticks(3);

      xAxis.call(x);
      yAxis.call(y);

};

// function update(data){
//   console.log(update)};
// //
// //   if (d3v5.select("#barcontainer1").select("svg"){
// //     d3v5.select("#barcontainer1")
// //   })
// // };
