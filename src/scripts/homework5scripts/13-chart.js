;(function() {
  var margin = { top: 50, right: 75, bottom: 75, left: 50 }
  var width = 400 - margin.left - margin.right
  var height = 500 - margin.top - margin.bottom

  var svg = d3
    .select('#chart13')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var bandScale = d3.scaleBand().range([0, 500])
  var bandScale = d3
    .scaleBand()
    .domain([
      'Stevie',
      'Nicholas',
      'Bubbletree',
      'Particle',
      'Jumpup',
      'Parlay',
      'Hio'
    ])
    .range([0, 350])
    .paddingInner(0.01)
  var widthScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, 300])
  var xPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, width])
  var colorScale = d3
    .scaleOrdinal()
    .domain(['cat', 'dog', 'cow'])
    .range(['orange', 'green', 'purple'])

  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    svg
      .selectAll('rect')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('fill', d => colorScale(d.animal))
      .attr('width', d => widthScale(d.hamburgers))
      .attr('height', bandScale.bandwidth())
      .attr('y', d => bandScale(d.name))
      .attr('opacity', 0.75)

    var yAxis = d3.axisLeft(bandScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + 350 + ')')
      .call(xAxis)
  }
})()
