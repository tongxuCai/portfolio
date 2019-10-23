import * as d3 from 'd3'
const margin = { top: 0, left: 40, right: 40, bottom: 0 }
const height = 250 - margin.top - margin.bottom
const width = 1000 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const pie = d3.pie().value(function(d) {
  return d.minutes
})
const task = ['Typing code', 'Rewriting code', 'Reading StackOverflow']

const radius = 75

const angleScale = d3
  .scaleBand()
  .domain(task)
  .range([0, Math.PI * 2])

const xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.2)

const labelArc = d3
  .arc()
  .innerRadius(radius)
  .outerRadius(radius)
  .startAngle(d => angleScale(d))
  .endAngle(d => angleScale(d) + angleScale.bandwidth())

const colorScale = d3.scaleOrdinal().range(['pink', 'cyan', 'magenta'])

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)

  const projects = datapoints.map(d => d.project)
  xPositionScale.domain(projects)

  svg
    .selectAll('.pie')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      const x = xPositionScale(d.key)
      return 'translate (' + x + ',' + height / 2 + ')'
    })
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      const container = d3.select(this)

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
        .attr('opacity', 0.5)

      container
        .append('text')
        .text(name)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('y', 100)
    })
}
