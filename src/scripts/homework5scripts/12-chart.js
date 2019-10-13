;(function() {
  // Build your SVG here
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var padding = { top: '25%', bottom: '25%' }
  var width = 400 - margin.left - margin.right
  var height = 200 - margin.top - margin.bottom

  var svg = d3
    .select('#chart12')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var xPointScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, 280])
  var colorScale = d3
    .scaleOrdinal()
    .domain(['cat', 'dog', 'cow'])
    .range(['orange', 'green', 'purple'])
  var radiusScale = d3
    .scaleSqrt()
    .domain([0, 10])
    .range([0, 50])

  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cx', d => xPointScale(d.hamburgers))
      .attr('r', 15)
      .attr('cy', 25)
      .attr('fill', d => colorScale(d.animal))
      .attr('r', d => radiusScale(d.hotdogs))
      .attr('opacity', 0.25)

    var xAxis = d3.axisBottom(xPointScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
