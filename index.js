function render(data){
  let width = window.innerWidth,
      height= window.innerHeight,
      margin = {
        top:150,
        left:120,
        right:80,
        bottom:90
      },
      xValue = d=>d.horsepower ,
      // tickNumber = number=>d3.format(".3s")(number).replace("G","B")
      yValue = d=>d.weight ,
      barwidth = width - margin.left -margin.right,
      barHeight = height - margin.top - margin.bottom,
      radius = 9;


      const x = d3.scaleLinear()
        .domain(d3.extent(data,xValue))
        .range([0,barwidth]).nice()
      const xAxis = d3.axisBottom(x).ticks(9).tickSize(-barHeight).tickPadding(15)
      const y = d3.scaleLinear()
        .domain(d3.extent(data,yValue))
        .range([0,barHeight]).nice()
      const yAxis = d3.axisLeft(y).tickSize(-barwidth).tickPadding(11)
      const svg = d3.select("#chart").append("svg")
                    .attr("viewBox",`0 0 ${width} ${height}`)
                    .style("background-color","#F5F2F3");
      const g = svg.append("g").attr("transform",`translate(${margin.top},${margin.left})`)
      let tooltip =d3.select("#chart").append("g").attr("transform",`translate(0,${height/2  })`).attr("class","tooltips")
      let circle = g.selectAll("circle")
                  .data(data)
                  .enter()
                  .append("circle")
                  .attr("cx",x(10))
                  .attr("cy",122)
                  .attr("r",radius)
                  .on("mouseover",function(d,i){


                    tooltip.html(`<div><p>Weight ${d.weight} <br><b>horsepower:</b><i>${d.horsepower}</i></p> </div>`)
                    .style("top",  (d3.event.pageY -114) + "px")
                    .style("left",(d3.event.pageX -20)+ "px")

                  })
                  .on("mouseout",function(d,i){
                    tooltip.html("")
                  })
      circle.transition()
         .duration(2500)
         .attr("cx",d=>x(xValue(d)))
         .attr("cy",d=>y(yValue(d)))
      g.append("text").attr("x",innerWidth/2 - 100).attr("y",-12).text("Weight vs Horsepower").attr("text-anchor","middle").attr("class","title")
      g.append("text").attr("x",innerWidth/2 - 100).attr("y",barHeight+80).text("Horsepower").attr("text-anchor","middle").attr("class","bottom")
      g.append("text").attr("x",barHeight/10 +280 ).attr("y",100).text("Weight").attr("text-anchor","middle").attr("class","left").attr("transform","rotate(90)")
      let xGroup = g.append("g").call(xAxis).attr("transform",`translate(0,${barHeight})`)
      let yGroup = g.append("g").call(yAxis).attr("class","yAxis")
      xGroup.select(".domain").remove()
      yGroup.selectAll('.domain').remove()
}

d3.csv("datas.csv").then(data=>{
   data.forEach(d => {
     d.horsepower = +d.horsepower
     d.weight = +d.weight
   });
   render(data)
  })
