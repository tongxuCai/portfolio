import * as d3 from 'd3'
import * as turf from '@turf/turf'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 500 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([0, 9000])

const path = d3.geoPath()

Promise.all([
  d3.xml(require('/data/canada.svg')),
  d3.csv(require('/data/wolves.csv'))
]).then(ready)

function ready([hexFile, datapoints]) {
  // Get ready to process the hexagon svg file with D3
  const imported = d3.select(hexFile).select('svg')

  // Remove the stylesheets Illustrator saved
  imported.selectAll('style').remove()

  // Inject the imported svg's contents into our real svg
  svg.html(imported.html())

  // Loop through our csv, finding the g for each state.
  // Use d3 to attach the datapoint to the group.
  // e.g. d3.select("#" + d.abbr) => d3.select("#CA")
  datapoints.forEach(d => {
    svg
      .select('#' + d.abbreviation)
      .attr('class', 'hex-group')
      .each(function() {
        d3.select(this).datum(d)
      })
  })

  // Go through each group.
  // Find the polygons inside, then set their color
  // using our scale
  svg.selectAll('.hex-group').each(function(d) {
    const group = d3.select(this)
    group
      .selectAll('polygon')
      .attr('fill', colorScale(d.wolves))
      .attr('stroke', 'white')
      .attr('opacity', 0.8)
      .attr('stroke-width', 0.25)
  })

  //
  // Everything below is totally optional, it
  // does the outlines and labels for the groups
  //

  const allMerged = []

  svg
    .selectAll('.hex-group')
    .each(function(d) {
      // Grab the current group...

      const group = d3.select(this)

      // Get each polygon (hexagon) inside of the group
      // Get the points attribute, looks like:
      // 176.6,57.1 176.6,30.2 153.3,16.7
      // Split on spaces, then commas
      // Add first coordinate to end of coordinate
      // list so it forms a closed shape
      // And then return GeoJSON polygons using turf

      console.log(turf)
      const polygons = group
        .selectAll('polygon')
        .nodes()
        .map(function(node) {
          return node.getAttribute('points').trim()
        })
        .map(function(pointString) {
          const regex = /(([\d.]+)[ ,]([\d.]+))/g
          return pointString.match(regex).map(function(pair) {
            const coords = pair.split(/[ ,]/)
            return [+coords[0], +coords[1]]
          })
        })
        .map(function(coords) {
          coords.push(coords[0])
          return turf.polygon([coords])
        })

      // Merge all of our hexagons into one big polygon

      const merged = turf.union(...polygons)

      allMerged.push(merged)
      // Add a new path for our outline
      // And use the geoPath with our
      // totally fake GeoJSON

      group
        .append('path')
        .datum(merged)
        .attr('class', 'outline')
        .attr('d', path)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      const center = path.centroid(merged)

      group
        .append('text')
        .attr('class', 'group-label')
        .attr('transform', `translate(${center})`)
        .text(d.abbreviation)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-weight', 'bold')
        .attr('font-size', 16)
        .attr('fill', 'white')
        .style('text-shadow', 'black 1px 1px 1px')
    })
    .on('mouseover', function(d) {
      d3.select(this)
        .selectAll('polygon')
        .attr('opacity', 1)
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .selectAll('polygon')
        .attr('opacity', 0.8)
    })

  svg
    .append('path')
    .datum(turf.union(...allMerged))
    .attr('class', 'outline')
    .attr('d', path)
    .attr('stroke', 'black')
    .attr('stroke-width', 3)
    .attr('fill', 'none')

  // End of the totally optional section
}
