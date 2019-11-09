import * as d3 from 'd3'
import { parse } from 'handlebars'

const margin = { top: 30, left: 50, right: 50, bottom: 30 }
const height = 600 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%y/%m')
// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 7540])
  .range([height, 0])

// Do you need a d3.line function for this? Maybe something similar?

d3.csv(require('../../data/less10000.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // datapoints.forEach(function(d) {
  //   d.datetime = parseTime(d.Date)
  // })

  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.Date)

    const date = datapoints.map(function(d) {
      return d.datetime
    })

    const maxDate = d3.max(date)
    const minDate = d3.min(date)

    xPositionScale.domain([minDate, maxDate])
  })

  const line = d3
    .line()
    .x(d => xPositionScale(d.datetime))
    .y(d => yPositionScale(d.Closing))

  // const dates = datapoints.map(function(d) {
  //   return d.datetime
  // })
  const nested = d3
    .nest()
    .key(function(d) {
      return d.Symbol
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
      if (d.key === 'OPK') {
        return 'blue'
      } else {
        return 'white'
      }
    })
    .attr('cx', width)
    .attr('cy', function(d) {
      const datapoints = d.values
      const latest = datapoints.find(d => d.Date === '18/02')
      console.log('last point is', latest)
      return yPositionScale(latest.Closing)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('fill', function(d) {
      if (d.key === 'OPK') {
        return 'blue'
      } else {
        return 'white'
      }
    })
    .attr('dx', 5)
    .attr('dy', 3)
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      const datapoints = d.values
      const latest = datapoints.find(d => d.Date === '18/02')
      console.log('last point is', latest)
      return yPositionScale(latest.Closing)
    })
    .attr('font-size', 12)

  // Draw your areas
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      if (d.key === 'OPK') {
        return 'blue'
      } else {
        return 'lightgrey'
      }
    })
    .attr('fill', 'none')
    .attr('opacity', 0.85)

  // Add your axes
  const xAxis = d3
    .axisBottom(xPositionScale)
    .ticks(5)
    .tickFormat(d3.timeFormat('%y/%m'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).ticks(20)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
