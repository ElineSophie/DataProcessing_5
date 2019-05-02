// Sophie Schubert
// 10699988

// Get JSON file
var fileName = "burnout.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    var data = JSON.parse(txtFile.responseText);

    // Transformation
    var x = createTransform([2005, 2017], [100, 600]);
    var y = createTransform([800, 2400], [300, 100]);;

    // Make canvas lines
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.moveTo(100, 300);
    ctx.lineTo(100, 100);
    ctx.moveTo(100, 300);
    ctx.lineTo(600, 300);
    ctx.stroke();

    ctx.moveTo(x(Number(data[0]["Year"])), y((Number(data[0]["Total Burnout Rate"]))));

    // Create list for ticks
    yTicks = [y(800), y(2400)];
    console.log(yTicks);
    xTicks = [];

    data.forEach(function(d){
      // Get numeric of year and burnout
      d["Year"] = Number(d["Year"]);
      d["Total Burnout Rate"] = Number(d["Total Burnout Rate"]);
      console.log(d["Total Burnout Rate"]);
      xTicks.push(x(d["Year"]));
      // Draw line to each point
      ctx.lineTo(x(d["Year"]), y(d["Total Burnout Rate"]));
      });
    console.log(xTicks);

    ctx.moveTo(100, 310);

    // Calculate difference between ticks
    nextX = xTicks[1] - xTicks[0];

    // Make ticks
    xTicks.forEach(function(xTick, index){
      ctx.lineTo(xTick, 300);
      ctx.moveTo(xTick + nextX, 310);
      ctx.fillText(data[index]["Year"], xTick - 10, 325);
    })

    // Draw ticks for y axis
    for (i = 800; i <= 2400; i += 200){
      yAxis = y(i);
      ctx.moveTo(90, y(i));
      ctx.lineTo(100, y(i));
      ctx.fillText(i, 65, y(i));
    };

    // Plot the lines
    ctx.stroke();

    // Title
    ctx.font = "20px serif";
    ctx.fillText('Meldingen van burn-out als beroepziekte 2005 tot 2017',120,60);

    // Text for x and y
    ctx.font = "15px serif";
    ctx.fillText('Jaar',550,350);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-100,450);
    ctx.fillText('Aantal meldingen',-150,-400);
  }
}
txtFile.open("GET", fileName);
txtFile.send();

function createTransform(domain, range){
// domain is a two-element array of the data bounds [domain_min, domain_max]
// range is a two-element array of the screen bounds [range_min, range_max]
// this gives you two equations to solve:
// range_min = alpha * domain_min + beta
// range_max = alpha * domain_max + beta
// a solution would be:

  var domain_min = domain[0]
  var domain_max = domain[1]
  var range_min = range[0]
  var range_max = range[1]

  // formulas to calculate the alpha and the beta
  var alpha = (range_max - range_min) / (domain_max - domain_min)
  var beta = range_max - alpha * domain_max

  // returns the function for the linear transformation (y= a * x + b)
  return function(x){
    return alpha * x + beta;
  }
}
