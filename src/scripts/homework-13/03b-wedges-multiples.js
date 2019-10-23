import * as d3 from 'd3'
const margin = { top: 10, left: 30, right: 10, bottom: 10 }
const height = 300 - margin.top - margin.bottom
const width = 1000 - margin.left - margin.right

const svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const pie = d3.pie().value(1 / 12)

const radius = 85

const radiusScale = d3
  .scaleLinear()
  .domain([0, 95])
  .range([0, radius])

const colorScale = d3
  .scaleLinear()
  .range(['cyan', 'pink'])
  .domain([0, 85])

const xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.2)

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)
  console.log(nested)

  const names = datapoints.map(d => d.city)
  xPositionScale.domain(names)

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
      console.log(datapoints)
      const container = d3.select(this)

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(d => radiusScale(d.data.high_temp))

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('fill', d => colorScale(d.data.high_temp))
        .attr('d', d => arc(d))

      container
        .append('circle')
        .attr('r', 1)
        .attr('fill', 'grey')

      container
        .append('text')
        .text(name)
        .attr('text-anchor', 'middle')
        .attr('y', 100)
    })
}
