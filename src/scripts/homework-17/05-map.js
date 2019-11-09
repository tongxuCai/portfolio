import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 150, right: 0, bottom: 0 }

const height = 600 - margin.top - margin.bottom

const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleOrdinal().range(['orange', 'blue', 'green', 'pink'])

const radiusScale = d3
  .scaleSqrt()
  .domain([0, 7100])
  .range([1, 10])
const projection = d3.geoAlbersUsa().scale(760)
const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/us_states.topojson')),
  d3.csv(require('/data/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  console.log('What is our data?')
  console.log(json)
  const states = topojson.feature(json, json.objects.us_states)

  svg
    .selectAll('path')
    // countries we got you but you are not a list. so we use countries.features, which is a list.
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'grey')
    .attr('opacity', 0.5)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', function(d) {
      return radiusScale(d.Total_MW)
    })
    .attr('fill', function(d) {
      return colorScale(d.sector_nam)
    })
    .attr('opacity', 0.35)
    .attr('transform', function(d) {
      const coords = [d.Longitude, d.Latitude]
      return `translate(${projection(coords)})`
    })

  svg
    .selectAll('text')
    .data(states.features)
    .enter()
    .append('text')
    .text(function(d) {
      return d.properties.abbrev
    })
    .attr('fill', 'black')
    .attr('stroke', 'none')
    .attr('transform', function(d) {
      return `translate(${path.centroid(d)})`
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 11)

  const legend = svg.append('g').attr('transform', 'translate(-140, 100)')

  const legendScale = d3
    .scaleBand()
    .domain(colorScale.domain())
    .range([0, 400])

  legend
    .selectAll('g')
    .data(colorScale.domain())
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${legendScale(d)})`)
    .each(function(d) {
      const group = d3.select(this)

      group
        .append('circle')
        .attr('r', 10)
        .attr('fill', colorScale(d))
      group
        .append('text')
        .text(d.charAt(0).toUpperCase() + d.slice(1))
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 12)
        .attr('dx', 14)
    })
}
