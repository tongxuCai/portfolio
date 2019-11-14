import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }

const height = 400 - margin.top - margin.bottom

const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 150
const radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const line = d3
  .radialLine()
  .radius(d => radiusScale(d.score))
  .angle(d => angleScale(d.category))

d3.csv(require('/data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  const holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  const categories = datapoints.map(d => d.category)
  angleScale.domain(categories)

  // holder
  //   .append('mask')
  //   .attr('id', 'radar-shape')
  //   .append('path')
  //   .datum(customDatapoints)
  //   .attr('d', line)
  //   .attr('fill', 'white')

  holder
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  holder
    .selectAll('.angle-text')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('font-size', 15)
    .attr('font-weight', 600)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('dy', -15)
    .attr('y', -radius)
    .attr('transform', d => {
      const degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.angle-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .text(d => d)
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'lightgrey')
    .attr('transform', d => {
      const degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  // We want to go from 0 to 1, in steps of 0.2
  const bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

  // var masked = holder
  //   .append('g')
  //   .attr('class', d => player.Team)
  //   .attr('mask', 'url(#radar-shape)')
  //   .lower()

  holder
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', d => radiusScale(d))
    .lower()

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', '#fc8d62')
    .attr('opacity', 0.8)
    .attr('stroke', 'black')
}
