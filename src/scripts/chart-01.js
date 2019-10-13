import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 30, left: 100, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 1')

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser
const parseTime = d3.timeParse('%Y-%m-%d')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([90, 125])
  .range([height, 0])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.Close))

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `${d.Date} <span style='color:red'>${d.Close}</span>`
  })

svg.call(tip)

d3.csv(require('../data/AAPL.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // After we read in our data, we need to clean our datapoints up a little bit. d.Date is a string to begin with, but treating a date like a string doesn't work well. So instead we use parseTime.
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.Date)

    const date = datapoints.map(function(d) {
      return d.datetime
    })

    const maxDate = d3.max(date)
    const minDate = d3.min(date)

    xPositionScale.domain([minDate, maxDate])
  })

  // Update your scales

  // Draw your dots
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('fill', 'black')
    .attr('stroke', 'black')
    .attr('cx', function(d) {
      return xPositionScale(d.datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.Close)
    })
    .attr('r', 3)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // Draw your single
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'black')

  // add annotations
  const annotations = [
    {
      note: {
        label: 'Longer text to show text wrapping',
        title: 'Here is an annotation'
      },
      data: { Date: '2015-12-14', Close: 106 },
      color: 'red',
      dx: -3,
      dy: 20
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(parseTime(d.Date)),
      y: d => yPositionScale(d.Close)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

  // Add your axes
  const xAxis = d3
    .axisBottom(xPositionScale)
    .ticks(6)
    .tickFormat(d3.timeFormat('%m/%d/%y'))
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
