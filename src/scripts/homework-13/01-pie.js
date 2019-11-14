import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleOrdinal().range(['#fbb4ae', '#b3cde3', '#ccebc5'])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(150)

const labelArc = d3
  .arc()
  .innerRadius(160)
  .outerRadius(160)

const pie = d3.pie().value(function(d) {
  return d.minutes
})

d3.csv(require('/data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const pieContainer = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  pieContainer
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
      return colorScale(d.data.task)
    })

  pieContainer
    .selectAll('text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .attr('d', labelArc)
    .attr('transform', function(d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .text(function(d) {
      return d.data.task
    })
    .attr('text-anchor', function(d) {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}
