import * as d3 from 'd3'

const margin = { top: 10, left: 20, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 1080 - margin.left - margin.right

const svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 90

const radiusScale = d3
  .scaleLinear()
  .domain([10, 90])
  .range([50, radius])

const arc = d3
  .arc()
  .innerRadius(function(d) {
    return 0
  })
  .outerRadius(function(d) {
    return radiusScale(d.data.high_temp)
  })

const pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

const colorScale = d3
  .scaleLinear()
  .domain([32, 85])
  .range(['#ffffb3', '#bebada'])

const xPositionScale = d3
  .scalePoint()
  .domain(['NYC', 'Tuscon', 'Lima', 'Beijing', 'Melbourne', 'Stockholm'])
  .range([0, width])
  .padding(0.35)

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

  const charts = svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      const xPos = xPositionScale(d.key)
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
      .attr('font-size', 15)
      .attr('dy', radius + 40)
      .text(d.key)
      .attr('font-weight', 600)
      .attr('text-anchor', 'middle')
  })
}
