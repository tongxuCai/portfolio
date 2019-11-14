import * as d3 from 'd3'

const margin = { top: 50, left: 50, right: 50, bottom: 40 }

const height = 400 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#line-chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%Y-%m-%d')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([90, 125])
  .range([height, 0])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.Close)
  })
  .curve(d3.curveMonotoneX)

d3.csv(require('../data/AAPL.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.Date)
  })
  const dates = datapoints.map(function(d) {
    return d.datetime
  })

  const dateMax = d3.max(dates)
  const dateMin = d3.min(dates)

  xPositionScale.domain([dateMin, dateMax])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', '#bebada')
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')

  svg
    .append('text')
    .text('AAPL stock price')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .attr('font-weight', 'bold')

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', d => xPositionScale(d.datetime))
    .attr('cy', d => yPositionScale(d.Close))
    .attr('fill', '#bebada')
    .on('mouseover', function(d) {
      // Select the element by class, use .text to set the content
      d3.select('.infobox .Date').text(d.Date)
      d3.select('.infobox .Close').text(d.Close)
      // make the mouseover'd element
      // bigger and red
      d3.select(this).attr('r', 5)
    })
    .on('mouseout', function() {
      d3.select(this).attr('r', 3)
    })

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %Y'))
    .ticks(5)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([100, 110, 120])
    .tickSize(-width)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path').remove()
  svg
    .selectAll('.y-axis line')
    .attr('stroke-dasharray', 2)
    .attr('stroke', 'grey')
}
