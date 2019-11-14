import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([10, 90])
  .range([40, radius])

const angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

// const colorScale = d3
//   .scaleLinear()
//   .domain([0, 100])
//   .range(['lightblue', 'pink'])

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  datapoints.push(datapoints[0])

  container
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', '#fc8d62')

  const circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  const textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .text('NYC')
    .attr('font-size', 40)
    .attr('font-weight', 600)
    .attr('alignment-baseline', 'middle')

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('x', 0)
    .attr('y', function(d) {
      return -1 * radiusScale(d)
    })
    .attr('dy', function(d) {
      return -2
    })
    .text(function(d) {
      return d + '°'
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
}
