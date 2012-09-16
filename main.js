function tempBarGraph(weatherData, w, h){
    var hours = weatherData.hourly_forecast;
    var temps = new Array();
    //console.log(hours[0].temp.english);
    for(var i = 0; i<hours.length; i++){
	temps[i] = hours[i].temp.english;
	//console.log(temps[i]);
    }

    var barPadding = 1;
    
    var yScale = d3.scale.linear()
                     .domain([d3.min(temps, function(d) { return d; })-.5, d3.max(temps, function(d) { return d; })])
                     .range([0, h]);

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
	    return h-yScale(d);
	})
	.attr("width", w/temps.length - barPadding)
	.attr("height", function(d){
	    return yScale(d);
	})
	.attr("fill", function(d){
	    return "rgb(0,127, " + (d*10) + ")";
	});
}
