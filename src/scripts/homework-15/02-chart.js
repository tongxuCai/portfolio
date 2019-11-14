import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)
const parseTime = d3.timeParse('%B-%y')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  // Draw your single line
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'region-line')
    .classed('highlight-usa', d => {
      return d.key === 'U.S.'
    })
    .classed('region-highlight-step', d => {
      let regions = [
        'Mountain',
        'Pacific',
        'West South Central',
        'South Atlantic'
      ]
      return regions.indexOf(d.key) !== -1
    })
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('visibility', 'hidden')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'region-circle')
    .classed('highlight-usa', d => {
      return d.key == 'U.S.'
    })
    .classed('region-highlight-step', d => {
      let regions = [
        'Mountain',
        'Pacific',
        'West South Central',
        'South Atlantic'
      ]
      return regions.indexOf(d.key) !== -1
    })
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .attr('visibility', 'hidden')

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'region-text')
    .classed('highlight-usa', d => {
      return d.key == 'U.S.'
    })
    .classed('region-highlight-step', d => {
      let regions = [
        'Mountain',
        'Pacific',
        'West South Central',
        'South Atlantic'
      ]
      return regions.indexOf(d.key) !== -1
    })
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')
    .attr('visibility', 'hidden')

  svg
    .append('text')
    .attr('class', 'title')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('class', 'winter-rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()
    .attr('visibility', 'hidden')

  // Add your axes
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  d3.select('#winter-draw-lines').on('stepin', () => {
    svg.selectAll('.region-line').attr('visibility', 'visible')

    svg.selectAll('.region-circle').attr('visibility', 'visible')

    svg.selectAll('.region-text').attr('visibility', 'visible')
  })

  d3.select('#winter-highlight-us').on('stepin', () => {
    svg.selectAll('.region-line').attr('stroke', 'lightgrey')
    svg.selectAll('.region-circle').attr('fill', 'lightgrey')
    svg.selectAll('.region-text').attr('fill', 'lightgrey')

    svg
      .selectAll('path.highlight-usa')
      .attr('stroke', 'red')
      .raise()
    svg
      .selectAll('circle.highlight-usa')
      .attr('fill', 'red')
      .raise()
    svg
      .selectAll('text.highlight-usa')
      .attr('fill', 'red')
      .attr('font-weight', 'bold')
      .raise()
  })

  d3.select('#winter-highlight-regions').on('stepin', () => {
    svg.select('.winter-rect').style('visibility', 'hidden')
    svg
      .selectAll('path.region-highlight-step')
      .attr('stroke', 'lightblue')
      .raise()
    svg
      .selectAll('circle.region-highlight-step')
      .attr('fill', 'lightblue')
      .raise()
    svg
      .selectAll('text.region-highlight-step')
      .attr('fill', 'lightblue')
      .raise()
  })

  d3.select('#winter-draw-winter').on('stepin', () => {
    svg.select('.winter-rect').style('visibility', 'visible')
  })

  function render() {
    // Calculate height/width
    const screenWidth = svg.node().parentNode.parentNode.offsetWidth
    const screenHeight = window.innerHeight
    const newWidth = screenWidth - margin.left - margin.right
    const newHeight = screenHeight - margin.top - margin.bottom

    // Update your SVG
    const actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    // Update scales (depends on your scales)
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Reposition/redraw your elements
    svg.selectAll('.region-line').attr('d', function(d) {
      return line(d.values)
    })

    svg
      .selectAll('.region-circle')
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.region-text')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg.select('.title').attr('x', newWidth / 2)

    const rectWidth =
      xPositionScale(parseTime('February-17')) -
      xPositionScale(parseTime('November-16'))

    svg
      .select('.winter-rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('width', rectWidth)
      .attr('height', newHeight)

    // Update axes if necessary
    svg.select('.x-axis').attr('transform', 'translate(0,' + newHeight + ')')

    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }

  window.addEventListener('resize', render)
  render()
}
