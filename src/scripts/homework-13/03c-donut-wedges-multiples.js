import * as d3 from 'd3'

const margin = { top: 30, left: 0, right: 0, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 1000 - margin.left - margin.right
const container = d3.select('#chart-3c')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0)

const months = [
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
  'Dec'
]

const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 100

const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

const colorScale = d3
  .scaleLinear()
  .domain([15, 100])
  .range(['cyan', 'pink'])

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)
  console.log('Nested is', nested)

  const cities = datapoints.map(d => d.city)
  xPositionScale.domain(cities)

  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // .attr('transform', `translate(${width / 2},${height / 2})`)
    .each(function(d) {
      console.log(d)
      const datapoints = d.values
      //   console.log(pie(datapoints))
      datapoints.push(datapoints[0])
      console.log('datapoints are', datapoints)

      const svg = d3.select(this)

      svg
        .selectAll('.polar-bar')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.high_temp))
        .attr('transform', function(d) {
          const x = xPositionScale(d.city) + 80
          return 'translate(' + x + ', 100)'
        })

      svg
        .selectAll('.center')
        .data(datapoints)
        .enter()
        .append('circle')
        .attr('r', 1.5)
        .attr('cx', d => xPositionScale(d.city) + 80)
        .attr('cy', 100)
        .attr('fill', 'grey')
      // .attr('transform', function(d) {
      //   const x = xPositionScale(d.city) + 80
      //   return 'translate(' + x + ', 100)'
      // })

      svg
        .selectAll('.tag')
        .data(datapoints)
        .enter()
        .append('text')
        .text(d => d.city)
        .style('font-size', 14)
        .attr('fill', 'black')
        .attr('transform', function(d) {
          const x = xPositionScale(d.city) + 60
          return 'translate(' + x + ', 220)'
        })
    })
}
