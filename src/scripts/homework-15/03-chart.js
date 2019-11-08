import * as d3 from 'd3'

var margin = { top: 10, left: 10, right: 10, bottom: 10 }

var height = 480 - margin.top - margin.bottom

var width = 480 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

var angleScale = d3
  .scalePoint()
  .domain([
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
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

var colorScale = d3
  .scaleSequential(d3.interpolateSpectral)
  .domain([80, 50])
  .clamp(true)

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var container = svg.append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')

  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })

  // Filter it so I'm only looking at NYC datapoints
  let nycDatapoints = datapoints.filter(d => d.city === 'Lima')
  nycDatapoints.push(nycDatapoints[0])

  // Grab the mean to use with the color scale
  let meanTemp = d3.mean(nycDatapoints, d => d.high_temp)

  container
    .append('path')
    .attr('class', 'temp')
    .datum(nycDatapoints)
    .attr('d', line)
    .attr('fill', colorScale(meanTemp))
    .attr('opacity', 0.75)

  var circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  var textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('NYC')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)

  var nested = d3.nest()
    .key(d => d.city)
    .entries(datapoints)

  nested.forEach(d => {
    let mean = d3.mean(d.values, d => d.high_temp)

    let color = 'black'
    if(d.key === 'Lima' || d.key == 'Stockholm' || d.key == 'Tuscon') {
      color = 'white'
    }

    d3.selectAll('.label-' + d.key)
      .style('background', colorScale(mean))
      .style('color', color)
  })


  function displayCity(name) {
    var cityData = datapoints.filter(d => d.city === name)
    cityData.push(cityData[0])
    let meanTemp = d3.mean(cityData, d => d.high_temp)

    container
      .select('.temp')
      .datum(cityData)
      .transition()
      .attr('d', line)
      .attr('fill', colorScale(meanTemp))
    container.select('.city-name').text(name)
  }

  d3.select('#beijing').on('stepin', () => {
    displayCity('Beijing')
  })

  d3.select('#lima').on('stepin', () => {
    displayCity('Lima')
  })

  d3.select('#stockholm').on('stepin', () => {
    displayCity('Stockholm')
  })

  d3.select('#nyc').on('stepin', () => {
    displayCity('NYC')
  })

  d3.select('#tuscon').on('stepin', () => {
    displayCity('Tuscon')
  })

  function render() {
    // Calculate height/width
    let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    let screenHeight = window.innerHeight
    console.log(screenWidth, screenHeight)
    let size = Math.min(screenWidth, screenHeight)
    screenHeight = size
    screenWidth = size

    let newWidth = screenWidth - margin.left - margin.right
    let newHeight = screenHeight - margin.top - margin.bottom

    let newRadius = (radius / height) * newHeight
    let newInnerRadius = (40 / height) * newHeight

    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    // Update scales (depends on your scales)
    radiusScale.range([newInnerRadius, newRadius])

    console.log('redrawing')
    // Reposition/redraw your elements
    svg
      .select('.temp')
      .transition()
      .attr('d', line)

    svg
      .selectAll('.temp-notes')
      .attr('y', d => -radiusScale(d))

    svg
      .selectAll('.bands')
      .attr('r', function(d) {
        return radiusScale(d)
      })

    svg
      .selectAll('.temp-notes')
      .attr('y', d => -radiusScale(d))

    container.attr('transform', `translate(${newWidth/2},${newHeight/2})`)
  }

  window.addEventListener('resize', render)
  render()
}
