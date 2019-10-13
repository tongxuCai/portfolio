import * as d3 from 'd3'

// Set up margin/height/width
const margin = { top: 70, left: 30, right: 100, bottom: 30 }
const height = 550 - margin.top - margin.bottom
const width = 500 - margin.left - margin.right

// Add your svg
const svg = d3
  .select('#chart-05')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)
const parseTime = d3.timeParse('%B-%y')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([180, 340])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .domain([
    'U.S.',
    'Pacific',
    'Mountain',
    'West North Central',
    'West South Central',
    'East North Central',
    'East South Central',
    'New England',
    'Middle Atlantic',
    'South Atlantic'
  ])
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data
d3.csv(require('../data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.month)
  })
  // Get a list of dates and a list of prices
  const dates = datapoints.map(function(d) {
    return d.datetime
  })
  const dateMax = d3.max(dates)
  const dateMin = d3.min(dates)

  xPositionScale.domain([dateMin, dateMax])

  // Group your data together
  const nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)
  console.log(nested)

  // Add the shaded rectangle
  svg
    .append('rect')
    .attr('fill', 'lightgrey')
    .attr('height', height)
    .attr('width', 55)
    .attr('x', 260)
    .attr('y', 0)

  // Draw your lines
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      // Takes all of the datapoints in that
      // group and feeds them to the line
      // generator that we made before
      return line(d.values)
    })
    .attr('opacity', 0.75)

  // circles
  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('fill', d => colorScale(d.key))
    .attr('cx', d => xPositionScale(dateMax))
    .attr('cy', function(d) {
      const datapoints = d.values
      const latest = datapoints.find(d => d.month === 'July-17')
      console.log('last point is', latest)
      return yPositionScale(latest.price)
    })

  // Add your text on the right-hand side
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      const datapoints = d.values
      const latest = datapoints.find(d => d.month === 'July-17')
      console.log('last point is', latest)
      return yPositionScale(latest.price)
    })
    .attr('font-size', 8)
    .attr('fill', d => colorScale(d.key))
    .attr('dy', 3)
    .attr('dx', 5)

  // Add your title
  const g = svg.append('g').attr('transform', 'translate(20,20) scale(2)')
  g.append('text')
    .text('U.S. housing prices fall in winter')
    .attr('x', 100)
    .attr('y', 0)
    .attr('dx', 0)
    .attr('dy', -30)
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %Y'))
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
