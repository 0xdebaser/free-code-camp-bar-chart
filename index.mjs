import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import gdpData from "./data/GDP-data.js";

const dataset = gdpData.data;
const h = 600;
const xPadding = 40;
const yPadding = 20;
const w = dataset.length * 3 + 2 * xPadding;

const xScale = d3
  .scaleTime()
  .domain([
    d3.min(dataset, (d) => new Date(d[0])),
    d3.max(dataset, (d) => new Date(d[0])),
  ])
  .range([xPadding, w - xPadding]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[1])])
  .range([h - yPadding, yPadding]);

const xAxis = d3.axisBottom(xScale);

const yAxis = d3.axisLeft(yScale);

const svg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

svg
  .append("g")
  .attr("transform", `translate(0,${h - yPadding})`)
  .attr("id", "x-axis")
  .call(xAxis);

svg
  .append("g")
  .attr("transform", `translate(${xPadding}, 0)`)
  .attr("id", "y-axis")
  .call(yAxis);

svg
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", (d) => xScale(new Date(d[0])))
  .attr("y", (d) => yScale(d[1]))
  .attr("width", Math.floor(w / dataset.length))
  .attr(
    "height",
    (d) => (h - 2 * yPadding) * (d[1] / d3.max(dataset, (d) => d[1]))
  )
  .attr("class", "bar")
  .attr("data-date", (d) => d[0])
  .attr("data-gdp", (d) => d[1]);

const tooltip = d3
  .select("body")
  .data(dataset)
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip");

svg
  .selectAll("rect")
  .on("mouseover", (_, d) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`$${d[1]} billion`);
    tooltip.attr("data-date", d[0]);
  })
  .on("mouseout", (d) => {
    tooltip.transition().duration(400).style("opacity", 0);
  });
