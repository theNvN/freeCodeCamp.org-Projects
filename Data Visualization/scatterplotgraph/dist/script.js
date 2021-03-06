const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 900;
const height = 500;

const xMargin = 80;
const yMargin = 60;

const colorAlleged = '#ff3333';
const colorNotAlleged = '#008000';

const legendAlleged = "Alleged";
const legendNotAlleged = "Not Alleged";

const svg = d3.select('.visHolder').
append('svg').
attr('class', 'svg').
attr('width', width).
attr('height', height);

const tooltip = d3.select('.visHolder').
append('div').
attr('class', 'tooltip').
attr('id', 'tooltip');

d3.json(url, function (error, data) {

  const timeData = data.map(d => {
    let splitTime = d.Time.split(":");
    return new Date(1970, 0, 1, 0, splitTime[0], splitTime[1]);
  });

  const xScale = d3.scaleLinear().
  domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1]).
  range([xMargin, width - xMargin]);

  const yScale = d3.scaleTime().
  domain(d3.extent(timeData)).
  range([yMargin, height - yMargin]);

  const xAxis = d3.axisBottom().
  scale(xScale).
  tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft().
  scale(yScale).
  tickFormat(d3.timeFormat("%M:%S"));

  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0, ' + (height - yMargin) + ')').
  call(xAxis);

  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate(' + xMargin + ', 0)').
  call(yAxis);

  svg.append('text').
  attr('class', 'axisLabel').
  attr('x', width / 2 - 40).
  attr('y', height - 10).
  text('Year');

  svg.append('text').
  attr('class', 'axisLabel').
  attr('x', -height / 2 - 40).
  attr('y', xMargin - 50).
  attr('transform', 'rotate(-90)').
  text('Time (in Minutes)');

  svg.append('text').
  attr('class', 'legendLabel').
  attr('x', width - 170).
  attr('y', 115).
  text('Not Alleged');

  svg.append('text').
  attr('class', 'legendLabel').
  attr('x', width - 140).
  attr('y', 135).
  text('Alleged');

  svg.append('text').
  attr('class', 'title').
  attr('x', width / 2 - 120).
  attr('y', 20).
  text('Doping in Professional Bicycle Racing');

  svg.selectAll('rect').
  data([colorAlleged, colorNotAlleged]).
  enter().
  append('rect').
  attr('class', 'legend').
  attr('id', 'legend').
  attr('width', 16).
  attr('height', 16).
  attr('x', width - 70).
  attr('transform', (d, i) => {
    return 'translate(0, ' + (height / 2 - 150 + 20 * i) + ')';
  }).
  style('fill', (d, i) => {
    return i == 0 ? colorNotAlleged : colorAlleged;
  });


  svg.selectAll('circle').
  data(data).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('data-xvalue', d => d.Year).
  attr('data-yvalue', (d, i) => timeData[i]).
  attr('r', 5).
  attr('cx', (d, i) => xScale(d.Year)).
  attr('cy', (d, i) => yScale(timeData[i])).
  style('fill', d => {
    return d.Doping == "" ? colorNotAlleged : colorAlleged;
  }).
  on('mouseover', (d, i) => {
    tooltip.style('opacity', 0.8).
    attr('data-year', d.Year).
    html(d.Name + ": " + d.Nationality + "<br>" +
    "Year: " + d.Year + " Time: " + d.Time + (
    d.Doping != "" ? "<br>Allegation: " + d.Doping : "")).
    style('left', xScale(d.Year) + 'px').
    style('top', yScale(timeData[i] - yMargin) + 'px');
  }).
  on('mouseout', d => {
    tooltip.style('opacity', 0.0);
  });

});