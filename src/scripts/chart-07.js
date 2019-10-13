import * as d3 from 'd3'

// Create your margins and height/width
const margin = { top: 30, left: 30, right: 20, bottom: 30 }
const height = 150 - margin.top - margin.bottom
const width = 150 - margin.left - margin.right

// I'll give you this part!
const container = d3.select('#chart-07')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.income)
  })

// Read in your data
Promise.all([
  d3.csv(require('../data/middle-class-income-usa.csv')),
  d3.csv(require('../data/middle-class-income.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([datapointsUSA, datapoints]) {
  datapoints.forEach(function(d) {
    d.income = parseFloat(d.income)
  })

  const nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const countries = d.key
      const datapoints = d.values
      console.log(countries)

      const svg = d3.select(this)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 1.5)

      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.75)

      svg
        .append('text')
        .text(countries)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('fill', 'orange')
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .attr('dy', -15)

      svg
        .append('text')
        .text('USA')
        .attr('x', width / 4)
        .attr('y', height / 12)
        .attr('dx', -20)
        .attr('dy', 5)
        .attr('font-size', 10)
        .attr('fill', 'blue')
        .attr('opacity', 0.75)

      const xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format('d'))
        .tickSize(-150)

      const yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickFormat(d3.format('$,d'))
        .tickSize(-150)
        .tickValues([5000, 10000, 15000, 20000])

      svg
        .append('g')
        .style('font-size', 9)
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')
        .attr('stroke', 'lightgrey')

      svg
        .append('g')
        .style('font-size', 9)
        .attr('class', 'axis y-axis')
        .call(yAxis)
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')
        .attr('stroke', 'lightgrey')

      svg.selectAll('.domain').remove()
    })
}
