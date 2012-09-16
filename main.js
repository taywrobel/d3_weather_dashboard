function plot(weatherData){
    var hours = weatherData.hourly_forecast;
    var temps = new Array();
    //console.log(hours[0].temp.english);
    for(var i = 0; i<hours.length; i++){
	temps[i] = hours[i].temp.english;
	//console.log(temps[i]);
    }
    
    var w = 700;
    var h = 100;
    var barPadding = 1;
    
    var svg = d3.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h);
    
    svg.selectAll("rect")
	.data(temps)
	.enter()
	.append("rect")
	.attr("x", function(d,i){
	    return i * (w/temps.length);
	})
	.attr("y", function(d){
	    return h-d;
	})
	.attr("width", w/temps.length - barPadding)
	.attr("height", function(d){
	    return d;
	})
	.attr("fill", function(d){
	    return "rgb(0,0, " + (d*10) + ")";
	});
}

function graph(x, y){
    var w = 700;
    var h = 100;
    var barPadding = 1;
    var test = [20,30,20,50,60];

    var svg = d3.select("#graph")
	.append("svg")
	.data(test)
	.attr("width", w)
	.attr("height", h);

    var curve = d3.svg.line()
	.x(function(d,i){
	    console.log(i);
	    return i*20; })
	.y(function(d){
	    return d; })
	.interpolate("monotone");

    svg.append("svg:path")
	.attr("d",curve(test))
	.attr("stroke", "black")
	.attr("fill", "none");
}

