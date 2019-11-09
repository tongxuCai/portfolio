import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 300 - margin.top - margin.bottom
const width = 330 - margin.left - margin.right

const container = d3.select('#chart-6')

const projection = d3.geoAlbersUsa()

const path = d3.geoPath().projection(projection)

const powerplants = [
  'hydroelectric',
  'coal',
  'natural gas',
  'nuclear',
  'petroleum',
  'pumped storage',
  'geothermal',
  'biomass',
  'wind',
  'solar',
  'other'
]
const colorScale = d3
  .scaleOrdinal()
  .domain([powerplants])
  .range([
    '#88CCEE',
    '#CC6677',
    '#DDCC77',
    '#117733',
    '#332288',
    '#AA4499',
    '#44AA99',
    '#999933',
    '#882255',
    '#661100',
    '#6699CC',
    '#888888'
  ])

const rScale = d3.scaleSqrt().range([0, 4])

Promise.all([
  d3.json(require('/data/us_states.topojson')),
  d3.csv(require('/data/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  console.log(json.objects)
  const states = topojson.feature(json, json.objects.us_states)
  console.log(states)
  console.log(datapoints)

  const outputsMax = d3.max(datapoints, d => d.Total_MW)
  rScale.domain([0, outputsMax])

  const nested = d3
    .nest()
    .key(function(d) {
      return d.PrimSource
    })
    .entries(datapoints)

  projection.fitSize([width, height], states)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const types = d.key
      //   console.log(types)
      const outputs = d.values
      //   console.log(d)

      const svg = d3.select(this)
      // console.log(yScale(types))
      svg
        .selectAll('.country')
        .data(states.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('fill', 'lightgrey')
        .attr('stroke', 'lightgrey')

      svg
        .selectAll('.powerplants')
        .data(outputs)
        .enter()
        .append('circle')
        .attr('class', 'powerplants')
        .attr('r', d => {
          return rScale(d.Total_MW)
        })
        .attr('transform', d => {
          const coords = projection([d.Longitude, d.Latitude])
          // console.log(d.Longitude)
          return `translate(${coords})`
        })
        // .attr('fill', 'white')
        .attr('data-legend', function(d) {
          return d.PrimSource
        })
        .attr('fill', d => colorScale(d.PrimSource))
        .attr('opacity', 0.5)

      svg
        .append('text')
        .text(types)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .style('font-size', 16)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .style(
          'text-shadow',
          '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
        )
    })
}
