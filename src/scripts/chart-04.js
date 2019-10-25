import * as d3 from 'd3'

const margin = { top: 30, left: 50, right: 100, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 4')

const svg = d3
  .select('#chart-04')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([2000, 2014])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 500])
  .range([height, 0])

// Do you need a d3.line function for this? Maybe something similar?
const line = d3
  .line()
  .x(d => xPositionScale(d.Year))
  .y(d => yPositionScale(d.Value))

// Import your data file using d3.csv
d3.csv(require('../data/air-emissions.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.Country
    })
    .entries(datapoints)
  console.log(nested)

  // Draw your dots
  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('fill', function(d) {
      if (d.key === 'France') {
        return 'blue'
      } else {
        return 'grey'
      }
    })
    .attr('cx', d => xPositionScale(2014))
    .attr('cy', function(d) {
      const datapoints = d.values
      const latest = datapoints.find(d => +d.Year === 2014)
      console.log('last point is', latest)
      return yPositionScale(latest.Value)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      const datapoints = d.values
      const latest = datapoints.find(d => +d.Year === 2014)
      console.log('last point is', latest)
      return yPositionScale(latest.Value)
    })
    .attr('font-size', 12)
    .attr('fill', function(d) {
      if (d.key === 'France') {
        return 'blue'
      } else {
        return 'grey'
      }
    })
    .attr('dx', 5)
    .attr('dy', 4)

  // Draw your areas
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', function(d) {
      if (d.key === 'France') {
        return 'blue'
      } else {
        return 'grey'
      }
    })
    .attr('fill', 'none')
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      return line(d.values)
    })

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
