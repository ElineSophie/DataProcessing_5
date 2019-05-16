window.onload = function() {

  // Links to the data
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
  var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

  Promise.all(requests).then(function(response) {

    var data = getData(response);

    // // Dropdown menu
    // document.getElementById("selectButton").onchange = function(){
    //   d3.selectAll("graph").remove()
    //   visualisationData(data["2012"]);
    //   d3.selectAll("graph").remove()
    //   visualisationData(data["2013"]);
    //   visualisationData(data["2014"]);
    //   visualisationData(data["2015"]);
    // }

    visualisationData(data["2014"]);

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
  return all_data;
}

function visualisationData(data){
  //Width and height
  var w = 700;
  var h = 700;

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

  // add the tooltip area to the webpage
var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-10,0])
  .html(function(d){return "Children living in violent areas" + d.y_teenVio +
                    "<br>GDP: " + "$" + d.GDP + "</br>"});

  svg.call(tip);

  // Create groups for x and y
  var xAxis = graph.append('g')
                    .attr('transform', `translate(0, ${graphHeight})`);

  var yAxis = graph.append('g');

  // Set scales x and y and padding if necessary
  var yScale = d3.scaleLinear()
                .domain([0, 35])
                .range([graphHeight, 0]);

  var xScale = d3.scaleLinear()
                .domain([0, 50])
                .range([0, graphWidth]);

  // setup fill color
  var colorScale = d3.scaleOrdinal()
                      .domain([20000, 110000])
                      .range(['black', '#ccc', '#ccc']);

  // Object.keys(data).forEach(function(key){
  //   console.log(key)
  //   data[key].forEach(function(value){
  //     console.log(value)
  //   })});

  var dot = graph.selectAll("circle")
                  .data(data);

  dot.enter()
      .append("circle")
      .attr("r", "10")
      .attr("cx", d => xScale(d.x_teenPreg))
      .attr("cy", d => yScale(d.y_teenVio))
      .attr("fill", d => colorScale(d.GDP))
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
//
// List of groups (here I have one group per column)
  var allGroup = ["2012", "2013", "2014", "2015"]
//
//   // Add the options to the button
//   d3.select("#selectButton")
//     .selectAll("Options")
//     .data(allGroup)
//     .enter()
//     .append("option")
//     .text(d => d)
//     .attr("value", d => d);

// create the drop down menu of cities
var selector = d3.select("body")
  .append("select")
  .attr("id", "selector")
  .selectAll("option")
  .data(allGroup)
  .enter().append("option")
  .text(function(d) { return d; })
  .attr("value", function (d, i) {
    return i;
  });

  // when the user selects a city, set the value of the index variable
	// and call the update(); function
	d3.select("#selector")
	.on("change", function(d) {
		index = this.value;
		update();
	})

  // Create and call the axes
  var x = d3.axisBottom(xScale);
  var y = d3.axisLeft(yScale);

  xAxis.call(x);
  yAxis.call(y);
}
}


/********
 * Transforms response of OECD request for teen pregancy rates.
 * https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017
 *
 * Also used for transform of response of OECD request for children living in area with high rates of crime and violence.
 * https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017
 **/

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

/********
 * Transforms response of OECD request for GDP.
 * https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions
 **/

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
