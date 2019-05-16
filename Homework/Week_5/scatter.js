window.onload = function() {

  // Links to the data
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
  var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

  Promise.all(requests).then(function(response) {

    var data = getData(response);

    visualisationData(data["2012"]);
    document.getElementById("year").onchange = function(){
      var year = this.value
      visualisationData(data[year])
    }

    }).catch(function(e){
      throw(e);
  });

function getData(response){

  var teenVio = transformResponse1(response[0]);
  var teenPreg = transformResponse1(response[1]);
  var gdp = transformResponse2(response[2]);

  var all_data = {
    "2012": [],
    "2013": [],
    "2014": [],
    "2015": []
  };

  Object.keys(teenVio).forEach(function(key){
    teenVio[key].forEach(function(value){
      if (all_data[value.Time]){
        all_data[value.Time].push({
          "Country": value.Country,
          "y_teenVio": value.Datapoint
        })
      }})}
    );

  Object.keys(teenPreg).forEach(function(key){
    teenPreg[key].forEach(function(value){
      if (all_data[value.Time]){
        all_data[value.Time].forEach(function(i){
          if (i.Country == value.Country){
            i["x_teenPreg"] = value.Datapoint
          }
        })
      }
    })
  });

  Object.keys(gdp).forEach(function(key){
    gdp[key].forEach(function(value){
      if (all_data[value.Year]){
        all_data[value.Year].forEach(function(i){
          if (i.Country == value.Country){
            i["GDP"] = value.Datapoint
          }
        })
      }
    })
  });

  // Remove the last country in dataset
  for (oecd in all_data){
    all_data[oecd].pop();
  }

  return all_data;

}

function visualisationData(data){

  // Remove any previous graphs
  d3.selectAll("svg")
    .remove();

  //Width and height
  var w = 650;
  var h = 650;

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
                .domain([d3.min(data, d => d.y_teenVio), d3.max(data, d => d.y_teenVio)])
                .range([graphHeight, 0])
                .nice();

  var xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.x_teenPreg), d3.max(data, d => d.x_teenPreg)])
                .range([0, graphWidth])
                .nice();

  // add the tooltip area to the webpage
  var tip = d3.tip()
               .attr("class", "d3-tip")
               .offset([-10,0])
               .html(function(d){return "Country: " + d.Country +
                    "<br>Teens living in violent areas: " + d.y_teenVio + "%" +
                    "<br>Teen pregnancies: " + d.x_teenPreg + "%" +
                    "<br>GDP: " + "$" + d.GDP + "</br>"});

  // Call the tooltip
  svg.call(tip);

  // Set variables for colours
  var gdp1 = Math.round(d3.max(data, d => d.GDP) * (1/4));
  var gdp2 = Math.round(d3.max(data, d => d.GDP) * (2/4));
  var gdp3 = Math.round(d3.max(data, d => d.GDP) * (3/4));
  var gdp4 = Math.round(d3.max(data, d => d.GDP));

  var een = Math.round(d3.min(data, d => d.GDP) * (1/4));
  console.log(gdp1.toString());
  console.log(een.toString());

  // Set color scale for circles
  var colorScale = d3.scaleThreshold()
                      .domain([gdp1, gdp2, gdp3, gdp4])
                      .range(colorbrewer.Reds[5]);

  // Create circles
  var dot = graph.selectAll("circle")
                  .data(data);

  dot.enter()
      .append("circle")
      .attr("r", "5")
      .attr("cx", d => xScale(d.x_teenPreg))
      .attr("cy", d => yScale(d.y_teenVio))
      .attr("fill", d => colorScale(d.GDP))
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  // adds graphtitle to svg
  graph.append("text")
     .style("text-anchor", "center")
     .text("Teens in violent areas vs. pregnancy rates, with GDP as legend");

  // Rotate the text on x scale
  xAxis.selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("fill", "black");

  // Append text to the graph
  svg.append("text")
      .attr("x", (-h / 2.3))
      .attr("y", 50)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Teens living in violent area - %");

  svg.append("text")
      .attr("x", w / 1.3)
      .attr('y', 590)
      .attr('text-anchor', 'middle')
      .text("Teen pregnancies - %");

  var legend = svg.append("g")
                  .attr("class", "legend")
                  .attr("height", 100)
                  .attr("width", 65)

  // Create the legend
  legend.selectAll("rect")
        .data(colorScale.domain())
        .enter()
        .append('rect')
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")"
          })
        .attr("width", 10)
        .attr("height", 10)
        .text(function(d) { return d; })
        .style("fill", d => colorScale(d));

    // Create and call the axes
    var x = d3.axisBottom(xScale);
    var y = d3.axisLeft(yScale);

    xAxis.call(x);
    yAxis.call(y);
  }
};

function transformResponse1(data){

    // Save data
    let originalData = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output object, an object with each country being a key and an array
    // as value
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });

    // return the finished product!
    return dataObject;
}

function transformResponse2(data){

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    return dataObject;
}
