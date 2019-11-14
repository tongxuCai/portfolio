import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 3')

const svg = d3
  .select('#chart-03')
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

const colorScale = d3.scaleOrdinal().range(['#e41a1c', '#377eb8', '#4daf4a'])

// Do you need a d3.line function for this? Maybe something similar?
const path = d3
  .area()
  .x(d => xPositionScale(d.Year))
  .y0(height)
  .y1(d => yPositionScale(d.Value))

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `${d.Year} <span style='color:red'>${d.Value}</span>`
  })

svg.call(tip)

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
      return d.COU
    })
    .entries(datapoints)
  console.log(nested)

  // Draw a line
  svg
    .append('rect')
    .attr('fill', 'black')
    .attr('height', height)
    .attr('width', 0.8)
    .attr('x', 310)
    .attr('y', 0)
    .attr('stroke-dasharray', '3, 3')

  // Draw your areas
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', 'black')
    .attr('fill', d => colorScale(d.key))
    .attr('opacity', 0.55)
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      return path(d.values)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // add annotations
  const annotations = [
    {
      note: {
        label: 'Longer text to show text wrapping',
        title: 'Here is an annotation'
      },
      data: { Year: '2007', Value: 300 },
      color: '#69b3a2',
      dx: 30,
      dy: -40
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(d.Year),
      y: d => yPositionScale(d.Value)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

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
