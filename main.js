function makeScale(dMin,dMax,rMin,rMax){
    return d3.scale.linear().domain([dMin,dMax]).range([rMin,rMax]);
}

function tempBarGraph(weatherData, w, h){
    var hours = weatherData.hourly_forecast;
    var temps = [];
    //console.log(hours[0].temp.english);
    for(var i = 0; i<hours.length; i++){
    temps[i] = parseInt(hours[i].temp.english);
    //console.log(temps[i]);
    }

    var barPadding = 1;

    var dMin = d3.min(temps, function(d) { return d; })-1;
    var dMax = d3.max(temps, function(d) { return d; })+1;

    var yScale = makeScale(dMin,dMax,0,h);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

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
        .attr("width", w/temps.length - barPadding)
        .attr("height", function(d){
            return yScale(d);
        })
        .attr("fill", function(d){
            return "rgb(0,127,255)";
        })
        .on("mouseover", function(){
            var bar = d3.select(this);
            bar.attr("fill","0");
        })
        .on("mouseout", function(){
            var bar = d3.select(this);
            bar.attr("fill","rgb(0,127,255)");
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

function tide_graph(svg, w, h, tide){
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
    //console.log(tide_heights);

    svg.data(tide_heights);
    var tide_scale_circle = makeScale(d3.min(tide_heights), d3.max(tide_heights), 5, 25);

    svg.selectAll("circle")
        .data(tide_heights)
        .enter()
        .append("circle")
        .attr("cx", function(d,i){
            return (i+1) * 20;
        })
        .attr("cy", function(d){
            return h/2;
        })
        .attr("r", function(d){
            return tide_scale_circle(d);
        })
        .attr("fill", "blue")
        .attr("opacity", "0.5");

}

function draw_axis(svg, x, y, width, height, x_label, y_label){

    //x axis
    svg.append("svg:line")
        .attr("x1",x)
        .attr("y1",y)
        .attr("x2",x + width)
        .attr("y2",y)
        .attr("stroke", "black");

    //tic marks on x
    var tic_jump = 10;
    var tic_height = 10;
    console.log(width);
    for(var i = x; i<(x+width); i = i + tic_jump){
        svg.append("svg:line")
            .attr("x1", i)
            .attr("y1",y - tic_height/2)
            .attr("x2", i)
            .attr("y2", y + tic_height/2)
            .attr("stroke", "black");
    }

/*    //y axis ends
    svg.append("svg:line")
        .attr("x1",0+xMargin)
        .attr("y1",0+yMargin)
        .attr("x2",0+xMargin)
        .attr("y2",h+yMargin)
        .attr("stroke", "black");
    
    //vertical labels
    var labels = [100,0,100];
    var yLoc = [5, h/2+5, h+5];
    for(var i = 0; i<labels.length; i++){
        svg.append("svg:text")
            .attr("x",0+xMargin-2)
            .attr("y",yLoc[i]+yMargin)
            .text (labels[i] + "%")
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px");
    }
*/}

function showTideData(w, h){
    var data;
    var city = "CA/San_Francisco";
    var url = "http://api.wunderground.com/api/9da96fc7939df769/conditions/tide/hourly10day/q/"+city+ ".json";

    $.ajax({
        url: url,
        dataType: "jsonp",
        success: function(tideData) {
            var svg = d3.select("#graph")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            tide_graph(svg, w, h, tideData.tide);
            draw_axis(svg, 1, h/2, w, h, "tide height", "tide_time");
        }
    });
}

