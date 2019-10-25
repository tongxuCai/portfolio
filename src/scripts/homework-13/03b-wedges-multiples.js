import * as d3 from 'd3'

let margin = { top: 30, left: 30, right: 30, bottom: 30 }

let height = 400 - margin.top - margin.bottom

let width = 1080 - margin.left - margin.right

let svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 90

let radiusScale = d3
  .scaleLinear()
  .domain([10, 90])
  .range([40, radius])

let arc = d3
  .arc()
  .innerRadius(function(d) {
    return 0
  })
  .outerRadius(function(d) {
    return radiusScale(d.data.high_temp)
  })

let pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let colorScale = d3
  .scaleLinear()
  .domain([32, 85])
  .range(['lightblue', 'pink'])

let xPositionScale = d3
  .scalePoint()
  .domain(['NYC', 'Tuscon', 'Lima', 'Beijing', 'Melbourne', 'Stockholm'])
  .range([0, width])
  .padding(0.35)

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  let charts = svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      let xPos = xPositionScale(d.key)
      return 'translate(' + xPos + ',' + height / 2 + ')'
    })

  charts.each(function(d) {
    d3.select(this)
      .selectAll('path')
      .data(pie(d.values))
      .enter()
      .append('path')
      .attr('class', function(d) {
        return d.data.month_name
      })
      .attr('d', arc)
      .attr('fill', function(d) {
        return colorScale(d.data.high_temp)
      })

    d3.select(this)
      .append('circle')
      .attr('fill', '#666')
      .attr('r', 2)

    d3.select(this)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', radius + 40)
      .text(d.key)
      .attr('text-anchor', 'middle')
  })
}
