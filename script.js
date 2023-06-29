let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let req = new XMLHttpRequest();

let baseTemp;
let values = [];
let variance;

let xScale;
let yScale;

let width = 1200;
let height = 600;
let padding = 60;

let canvas = d3.select("#canvas");
canvas.attr("width",width);
canvas.attr("height",height);

let generateScales = () =>{
    xScale = d3.scaleLinear()
                .range([padding,width-padding])

    yScale = d3.scaleTime()
               .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
                .range([padding,height-padding])
}

let drawCells = () =>{
    
    canvas.selectAll("rect")
         .data(values)
         .enter()
         .append("rect")
         .attr("class","cell")
         .attr("fill",item=>{
            variance = item["variance"];
            if(variance <= -1){
                return "SteelBlue"
            }
            else if(variance <= 0){
                return "LightSteelBlue"
            }
            else if(variance <= 1){
                return "Orange"
            }
            else{
                return "Crimson"
            }
         })
         .attr("data-year",item=>item["year"])
         .attr("data-month",item=>item["month"]-1)
         .attr("data-temp",item=>baseTemp+item["variance"])
         .attr("height",(height-(2*padding))/12)
         .attr("y",item=>yScale(new Date(0,item["month"]-1,0,0,0,0,0)))

}

let drawAxes = () =>{
    let xAxis = d3.axisBottom(xScale);
    
    canvas.append("g")
          .call(xAxis)
          .attr("id","x-axis")
          .attr("transform","translate(0,"+(height-padding)+")")

    let yAxis = d3.axisLeft(yScale);

    canvas.append("g")
          .call(yAxis)
          .attr("id","y-axis")
          .attr("transform","translate("+padding+",0)")
}

req.open("GET",url,true);
req.onload = ()=>{
    let data = JSON.parse(req.responseText);
    baseTemp = data["baseTemperature"];
    values = data["monthlyVariance"];
    generateScales();
    drawCells();
    drawAxes();
}
req.send();
