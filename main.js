function makeScale(dMin,dMax,rMin,rMax){
	return d3.scale.linear().domain([dMin,dMax]).range([rMin,rMax]);
}

function tempBarGraph(weatherData, w, h){
    var hours = weatherData.hourly_forecast;
    var temps = [];
    //console.log(hours[0].temp.english);
    for(var i = 0; i<hours.length; i++){
    temps[i] = hours[i].temp.english;
    //console.log(temps[i]);
    }

    var barPadding = 1;

    var dMin = d3.min(temps, function(d) { return d; })-0.5;
    var dMax = d3.max(temps, function(d) { return d; });

    var yScale = makeScale(dMin,dMax,0,h);

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
            return "rgb(0,127,255)";
        });

    var curve = d3.svg.line()
        .x(function(d,i){
            //console.log(i);
            return i * (w/temps.length); })
        .y(function(d){
            return h-yScale(d); })
        .interpolate("basis");

    svg.append("svg:path")
        .attr("d",curve(temps))
        .attr("stroke-width", "3")
        .attr("stroke", "rgba(0,0,0,0.5)")
        .attr("fill", "none");
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
            return d;
        })
        .interpolate("monotone");

    svg.append("svg:path")
        .attr("d",d3.svg.symbol())
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

