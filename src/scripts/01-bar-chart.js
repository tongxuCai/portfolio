import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .domain(['Asia', 'Europe', 'Africa', 'N.America', 'S.America'])
  .range(['#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69'])

d3.csv(require('../data/countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  d3.select('#highlight-asia').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'grey')
    svg
      .selectAll('.asia')
      .attr('fill', '#4cc1fc')
      .raise()
  })

  d3.select('#highlight-africa').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'grey')
    svg
      .selectAll('.africa')
      .attr('fill', '#4cc1fc')
      .attr('opacity', 0.95)
      .raise()
  })

  d3.select('#highlight-northamerica').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'grey')
    svg
      .selectAll('.namerica')
      .attr('fill', '#4cc1fc')
      .raise()
  })

  d3.select('#highlight-lowgdp').on('click', function() {
    console.log('clicked')
    svg
      .selectAll('rect')
      .attr('fill', function(d) {
        if (d.gdp_per_capita < '5000') {
          return '#4cc1fc'
        } else {
          return 'grey'
        }
      })
      .raise()
  })

  d3.select('#highlight-continent').on('click', function() {
    console.log('clicked')
    svg
      .selectAll('rect')
      .attr('fill', d => colorScale(d.continent))
      .raise()
  })

  d3.select('#highlight-reset').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'grey')
  })
  //   svg
  //     .selectAll('.reset')
  //     .attr('fill', 'pink')
  //     .raise()
  // })

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => xPositionScale(d.country))
    .attr('y', d => yPositionScale(d.life_expectancy))
    .attr('width', d => xPositionScale.bandwidth())
    .attr('class', d => d.continent.toLowerCase().replace(/[^a-z]*/g, ''))
    .attr('height', d => height - yPositionScale(d.life_expectancy))
    .attr('fill', 'grey')

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
