;(function() {
  let margin = { top: 50, right: 75, bottom: 75, left: 50 }
  let width = 400 - margin.left - margin.right
  let height = 500 - margin.top - margin.bottom

  let svg = d3
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
  let widthScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, 300])
  let xPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, width])
  let colorScale = d3
    .scaleOrdinal()
    .domain(['cat', 'dog', 'cow'])
    .range(['orange', 'green', 'purple'])

  d3.csv(require('../../data/eating-data.csv'))
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

    let yAxis = d3.axisLeft(bandScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    let xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + 350 + ')')
      .call(xAxis)
  }
})()
