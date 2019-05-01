// Sophie Schubert
// 10699988

// Get JSON file
var fileName = "burnout.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    console.log(JSON.parse(txtFile.responseText));

    var x = createTransform([2005, 2017], [50,500]);
    var y = createTransform([800, 2500], [300, 100]);;

    // Store JSON data
    data = JSON.parse(txtFile.responseText);

    // Make canvas lines
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    data.forEach(function(d){
      // Get numeric of year and burnout
      d["Year"] = Number(d["Year"])
      d["Total Burnout Rate"] = Number(d["Total Burnout Rate"])
      // Draw line to each point
      ctx.lineTo(x(d["Year"]), y(d["Total Burnout Rate"]));
      });

      // Plot the lines
      ctx.stroke();

    ctx.moveTo(50, 500);
    ctx.lineTo(50, 50);
    ctx.moveTo(50, 500);
    ctx.lineTo(500, 500);
    ctx.stroke();

    // Text for the graph itself
    ctx.font = "20px serif";
    ctx.fillText('Meldingen van burn-out als beroepziekte 2005 tot 2017',100,50);
    ctx.fillText('Jaar',425,550);
    ctx.rotate(-90 * Math.PI / 180)
    ctx.translate(-100,450)
    ctx.fillText('Aantal meldingen',-200,-420);
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
