import * as d3 from 'd3'

const margin = { top: 10, left: 50, right: 150, bottom: 30 }
const height = 500 - margin.top - margin.bottom
const width = 450 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scalePoint()
  .domain(['13-Feb', '18-Feb'])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 4200])
  .range([height, 0])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Date)
  })
  .y(function(d) {
    return yPositionScale(d.Closing)
  })

d3.csv(require('../../data/comparison.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.Symbol
    })
    .entries(datapoints)

  datapoints.forEach(d => {
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('r', 2.5)
      .attr('cx', function(d) {
        return xPositionScale(d.Date)
      })
      .attr('cy', function(d) {
        return yPositionScale(d.Closing)
      })
      .attr('fill', function(d) {
        if (d.Symbol === 'OPKO Health') {
          return 'green'
        }
        if (d.Symbol === 'ICL') {
          return 'green'
        }
        if (d.Symbol === 'Gazit Globe') {
          return 'green'
        }
        return 'red'
      })
    // .on('mouseover', d => {
    //     const symbol = d.key
    //   svg
    //     .selectAll('path.' + symbol)
    //     .attr('stroke', 'red')
    //     .raise()
    //   svg
    //     .selectAll('circle.' + symbol)
    //     .attr('fill', 'red')
    //     .raise()
    //   svg
    //     .selectAll('text.' + symbol)
    //     .attr('fill', 'red')
    //     .raise()
    // })
    // .on('mouseout', d => {
    //     const symbol = d.key
    //   svg.selectAll('path.' + symbol).attr('stroke', colorScale(d.key))
    //   svg.selectAll('circle.' + symbol).attr('fill', colorScale(d.key))
    //   svg.selectAll('text.' + symbol).attr('fill', 'black')
    // })
  })

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', function(d) {
      if (d.key === 'OPKO Health') {
        return 'green'
      }
      if (d.key === 'ICL') {
        return 'green'
      }
      if (d.key === 'Gazit Globe') {
        return 'green'
      }
      return 'red'
    })
    .attr('stroke-width', 2)
    .attr('opacity', 0.5)
    .attr('fill', 'none')
    .attr('d', function(d) {
      return line(d.values)
    })
  // .on('mouseover', d => {
  //   svg
  //     .selectAll('path.' + d.key)
  //     .attr('stroke', 'red')
  //     .raise()
  //   svg
  //     .selectAll('circle.' + d.key)
  //     .attr('fill', 'red')
  //     .raise()
  //   svg
  //     .selectAll('text.' + d.key)
  //     .attr('fill', 'red')
  //     .raise()
  // })
  // .on('mouseout', d => {
  //   svg.selectAll('path.' + d.key).attr('stroke', colorScale(d.key))
  //   svg.selectAll('circle.' + d.key).attr('fill', colorScale(d.key))
  //   svg.selectAll('text.' + d.key).attr('fill', 'black')
  // })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('font-size', 10)
    .attr('fill', '#333333')
    .attr('x', xPositionScale('18-Feb'))
    .attr('dy', 3)
    .attr('dx', 5)
    // .attr('font-weight', 20)
    .attr('y', function(d) {
      return yPositionScale(d.values[1].Closing)
    })
    .text(function(d) {
      return d.key
    })
  // .on('mouseover', d => {
  //   svg
  //     .selectAll('path.' + d.key)
  //     .attr('stroke', 'red')
  //     .raise()
  //   svg
  //     .selectAll('circle.' + d.key)
  //     .attr('fill', 'red')
  //     .raise()
  //   svg
  //     .selectAll('text.' + d.key)
  //     .attr('fill', 'red')
  //     .raise()
  // })
  // .on('mouseout', d => {
  //   svg.selectAll('path.' + d.key).attr('stroke', colorScale(d.key))
  //   svg.selectAll('circle.' + d.key).attr('fill', colorScale(d.key))
  //   svg.selectAll('text.' + d.key).attr('fill', 'black')
  // })

  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  const yAxis = d3
    .axisLeft(yPositionScale)
    .ticks(14)
    .tickValues([500, 1000, 1500, 2000, 2500, 3000, 3500, 4000])
    .tickSize(-width)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  svg.selectAll('.y-axis path').remove()
  //   svg.selectAll('.y-axis text').remove()
  svg
    .selectAll('.y-axis line')
    .attr('stroke-dasharray', 2)
    .attr('stroke', 'grey')
}
