function makeScale(dMin,dMax,rMin,rMax){
	return d3.scale.linear().domain([dMin,dMax]).range([rMin,rMax]);
}

function tempBarGraph(weatherData, w, h){
    var hours = weatherData.hourly_forecast;
    var temps = [];
    var feelslike = [];
    //console.log(hours[0].temp.english);
    for(var i = 0; i<hours.length; i++){
    temps[i] = parseInt(hours[i].temp.english);
    feelslike[i] = parseInt(hours[i].feelslike.english);
    console.log(feelslike[i] + " at " + hours[i].humidity + "\% humidity");
    // console.log(feelslike[i]);
    //console.log(temps[i]);
    }

    var barPadding = 0;

    var dMin = d3.min(temps, function(d) { return d; })-1;
    dMin = Math.min(dMin, d3.min(feelslike, function(d) { return d; })-1);
    var dMax = d3.max(temps, function(d) { return d; })+1;
    dMax = Math.max(dMax, d3.max(feelslike, function(d) { return d; })+1);

    var yScale = makeScale(dMin,dMax,0,h);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var curve = d3.svg.area()
        .x(function(d,i){
            //console.log(i);
            return i * (w/feelslike.length); })
        .y0(function(d){
        	if(d > 0){
            	return (h-yScale(d));
            }
            else{
            	return h;
        	}
         })
        .y1(h)
        .interpolate("basis");

    var gradient = svg.append("svg:defs")
	  	.append("svg:linearGradient")
	    .attr("id", "gradient")
	    .attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "0%")
	    .attr("y2", "100%")
	    .attr("spreadMethod", "pad");

	gradient.append("svg:stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#F00")
	    .attr("stop-opacity", .5);   


	gradient.append("svg:stop")
	    .attr("offset", "25%")
	    .attr("stop-color", "#FF0")
	    .attr("stop-opacity", .45);


	gradient.append("svg:stop")
	    .attr("offset", "50%")
	    .attr("stop-color", "#0F0")
	    .attr("stop-opacity", .4);


	gradient.append("svg:stop")
	    .attr("offset", "75%")
	    .attr("stop-color", "#0FF")
	    .attr("stop-opacity", .45);


	gradient.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#00F")
	    .attr("stop-opacity", .5);

    svg.append("svg:path")
        .attr("d",curve(feelslike))
        .attr("stroke-width", "3")
        .attr("stroke", "rgba(0,0,0,0.5)")
        .attr("fill", "url(#gradient)");

    var graph = svg.selectAll("rect")
        .data(temps)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return i * (w/temps.length);
        })
        .attr("y", function(d){
            return h-yScale(d);
        })
        .attr("width", ((i+1) * (w/temps.length)) - (i * (w/temps.length)) - barPadding)
        .attr("height", function(d){
            return yScale(d);
        })
        .attr("fill", "rgb(63,63,63)")
        .attr("opacity", "0.5")
		.on("mouseover", function(){
			var bar = d3.select(this);
			bar.attr("fill","0");
			bar.attr("opacity", "1.0");
		})
		.on("mouseout", function(){
			var bar = d3.select(this);
			bar.attr("fill","rgb(63,63,63)");
			bar.attr("opacity", "0.5");
		});
}

function tide_graph(w, h, tide){
    var barPadding = 1;
    var tide_heights = [];

    var next_tide = 0;
    for(i = 0; i < tide.tideSummary.length; i++){
        var tide_height = tide.tideSummary[i].data.height;
        if(tide_height === ""){
            //do nothing
        }else{
            // should have to use: parseFloat(tideH.slice(0,tideH.indexOf(' '))) but magic
            tide_heights[next_tide] = parseFloat(tide_height);
            next_tide = next_tide + 1;
            //console.log(tide_height);
        }
    }
    console.log(tide_heights);

    var tide_scale = makeScale(d3.min(tide_heights), d3.max(tide_heights), 0, h);

    var svg = d3.select("#graph")
        .append("svg")
        .data(tide_heights)
        .attr("width", w)
        .attr("height", h);

    var curve = d3.svg.line()
        .x(function(d,i){
            //console.log(d);
            return i*20; })
        .y(function(d, i){
            return tide_scale(d);
        })
        .interpolate("monotone");

    svg.append("svg:path")
        .attr("d",curve(tide_heights))
        .attr("stroke", "black")
        .attr("fill", "none");
}

function showTideData(w, h){
    var data;
    var city = "CA/San_Francisco";
    var url = "http://api.wunderground.com/api/9da96fc7939df769/conditions/tide/hourly10day/q/"+city+ ".json";

    $.ajax({
        url: url,
        dataType: "jsonp",
        success: function(tideData) {
            tide_graph(w, h, tideData.tide);
        }
    });
}

