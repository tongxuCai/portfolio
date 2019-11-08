;(function() {
  const margin = { top: 50, left: 50, right: 50, bottom: 50 }

  const height = 400 - margin.top - margin.bottom
  const width = 400 - margin.left - margin.right

  const svg = d3
    .select('#chart10')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const xPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, 300])

  const yPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([300, 0])

  d3.csv(require('../../data/eating-data.csv'))
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
      .attr('r', 5)
      .attr('fill', 'pink')
      .attr('cx', d => xPositionScale(d.hamburgers))
      .attr('cy', d => yPositionScale(d.hotdogs))
  }

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
})()
