myTextPage();
loadData();


function myTextPage(){

  // Title of html page
  var head = d3.select("head");
  var t = head.append("title");
  t.text("Bar chart for depression rates");

  // Title of bar chart
  var title = d3.select("body");
  var h1 = title.append("h1");
  h1.text("Self-reported depression by education level in 2014")

  // A bit of text
  var body = d3.select("body");
  var h2 = body.append("h2");
  h2.text("This bar chart is made by Sophie Schubert with studentnummer 10699988.");

  // A short paragraph
  var b = d3.select("body");
  var p = body.append("p");
  p.text("In this bar chart, depression rates according to self-rapportage are being shown.\
          From this bar chart, the conclusion can be drawn that individuals with \
          only primary education are five times as often depressed compared to individuals \
          with minimal HBO education.");

  d3.select("body")
    .append("a")
    .attr("href", "https://www.cbs.nl/nl-nl/nieuws/2016/04/meer-dan-1-miljoen-nederlanders-had-depressie")
    .html("Data retrieved from CBS");

};

function loadData(){
  d3.json("/data/zelfrapportage.json").then(data => {
    visualisationData(data);
  });

};

function visualisationData(data){

  //Width and height
  var w = 700;
  var h = 700 ;

  // Create svg
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  // Create margins and dimensions for the graph
  var margin = {top: 40, right: 40, bottom: 120, left: 90};
  var graphWidth = w - margin.left - margin.right;
  var graphHeight = h - margin.top - margin.bottom

  // Append a group to svg and save as graph
  var graph = svg.append('g')
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Create groups for x and y
  var xAxis = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);

  var yAxis = graph.append('g');

  // Set scales x and y and padding if necessary
  var yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.Aandeel)])
                .range([graphHeight, 0]);

  var xScale = d3.scaleBand()
                .domain(data.map(name => name.Categorie))
                .range([0, graphHeight])
                .paddingInner(0.3)
                .paddingOuter(0.3);

  // Join the data to the rectangles
  var rect = graph.selectAll("rect")
                  .data(data);

  // Add attributes to the rectangles
  rect.enter()
      .append("rect")
      .attr("width", xScale.bandwidth)
      .attr("height", d => graphHeight - yScale(d.Aandeel))
      .attr("fill", "black")
      .attr("x", d => xScale(d.Categorie))
      .attr("y", d => yScale(d.Aandeel))

  // Create and call the axes
  var x = d3.axisBottom(xScale);
  var y = d3.axisLeft(yScale)
            .ticks(3);

  xAxis.call(x);
  yAxis.call(y);

  // Rotate the text on x scale
  xAxis.selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end")
    .attr("fill", "black");

  // Append text to the graph
  svg.append("text")
      .attr("x", (-h / 2))
      .attr("y", 50)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Self-rapportage in %");

  svg.append("text")
      .attr("x", w / 2)
      .attr('y', 700)
      .attr('text-anchor', 'middle')
      .text("Education level");

  // Make events
  function mouseOverRect(d, i , n) {
                        d3.select(n[i])
                        .attr('fill', "blue")
                      };
                      rect.append("text")
                          .text(d => d.Aandeel);

  function mouseOutRect(d, i , n){
    d3.select(n[i])
    .attr('fill', "black");
    };

  graph.selectAll('rect')
      .on('mouseover', mouseOverRect)
      .on('mouseout', mouseOutRect);

};
