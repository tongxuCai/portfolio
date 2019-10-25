import * as d3 from 'd3'

let margin = { top: 30, left: 30, right: 30, bottom: 30 }

let height = 400 - margin.top - margin.bottom

let width = 780 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let colorScale = d3.scaleOrdinal().range(['#7fc97f', '#beaed4', '#fdc086'])

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(150)

let labelArc = d3
  .arc()
  .innerRadius(160)
  .outerRadius(160)

let pie = d3.pie().value(function(d) {
  return d.minutes
})

d3.csv(require('/data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let pieContainer = svg
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
