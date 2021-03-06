const svgWidth = 1400;
const svgHeight = 600;

const margin = {
  top: 10,
  left: 80,
  right: 60,
  bottom: 60 };


const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

const legendColors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"];

const legendWidth = 400;
const legendHeight = 30;

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url, function (error, data) {

  if (error) {
    console.log("Error loading the dataset!");
    return;
  }

  let dataset = data.monthlyVariance;
  dataset.forEach(val => {
    val.month -= 1;
  });

  let varianceData = dataset.map(val => {
    return val.variance;
  });

  let minTemp = data.baseTemperature + Math.min(...varianceData);
  let maxTemp = data.baseTemperature + Math.max(...varianceData);

  console.log("minTemp maxTemp: ", minTemp + "  " + maxTemp);

  let visHolder = d3.select('body').
  append('div').
  attr('class', 'visHolder');

  let heading = visHolder.append('div').
  attr('class', 'heading');

  heading.append('h1').
  attr('id', 'title').
  text('Monthly Global Land-Surface Temperature');

  heading.append('h3').
  attr('id', 'description').
  text(dataset[0].year + " - " + dataset[dataset.length - 1].year +
  " : Base Temperature " + data.baseTemperature + " ℃");

  let svg = visHolder.append('svg').
  attr('class', 'svg').
  attr('width', svgWidth).
  attr('height', svgHeight);

  let xScale = d3.scaleBand().
  domain(dataset.map(val => val.year)).
  rangeRound([margin.left, svgWidth]);

  //console.log("xScale domain", xScale.domain());
  let yScale = d3.scaleBand().
  domain(monthNames).
  rangeRound([margin.top, svgHeight - margin.bottom]);

  let xAxis = d3.axisBottom().
  scale(xScale).
  tickValues(xScale.domain().filter(year => year % 10 == 0));

  let yAxis = d3.axisLeft().
  scale(yScale).
  tickValues(yScale.domain());

  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0, ' + (svgHeight - margin.bottom) + ')').
  call(xAxis);

  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate(' + margin.left + ' ,0)').
  call(yAxis);

  console.log("X bandwidth", xScale.bandwidth());
  console.log("Y bandwidth", yScale.bandwidth());

  let tooltip = d3.tip().
  attr('class', 'd3-tip').
  attr('id', 'tooltip').
  html(d => d).
  direction('n').
  offset([-10, 0]);

  visHolder.append('svg').
  attr('width', 0).
  attr('height', 0).
  call(tooltip);

  let legendThreshold = d3.scaleThreshold().
  domain(function (min, max, count) {
    let arr = [];
    let step = (max - min) / count;
    for (let i = 1; i < count; i++) {
      arr.push(min + i * step);
    }

    return arr;
  }(minTemp, maxTemp, legendColors.length)).
  range(legendColors.reverse());

  let legendXScale = d3.scaleLinear().
  domain([minTemp, maxTemp]).
  range([0, legendWidth]);

  let legendXAxis = d3.axisBottom().
  scale(legendXScale).
  tickValues(legendThreshold.domain()).
  tickFormat(d3.format('.1f'));

  let legendSvg = visHolder.append('svg').
  attr('class', 'legendSvg').
  attr('id', 'legend').
  attr('width', svgWidth).
  attr('height', 100);

  legendSvg.append('g').
  attr('id', 'legend-x-axis').
  attr('transform', 'translate(' + margin.left + ', 50)').
  call(legendXAxis);

  legendSvg.selectAll('rect').
  data(legendThreshold.range().map(color => {
    let d = legendThreshold.invertExtent(color);
    if (d[0] == null) {d[0] = legendXScale.domain()[0];}
    if (d[1] == null) {d[1] = legendXScale.domain()[1];}
    return d;
  })).
  enter().
  append('rect').
  attr('width', d => legendXScale(d[1]) - legendXScale(d[0])).
  attr('height', 20).
  attr('x', (d, i) => legendXScale(d[0]) + margin.left).
  attr('y', 30).
  style('fill', d => legendThreshold(d[0]));

  svg.append('text').
  attr('class', 'axisLabel').
  attr('x', svgWidth / 2).
  attr('y', svgHeight - 20).
  text('Year');

  svg.append('text').
  attr('x', -svgHeight / 2).
  attr('y', 15).
  attr('transform', 'rotate(-90)').
  text('Month');

  svg.selectAll('rect').
  data(dataset).
  enter().
  append('rect').
  attr('data-month', d => d.month).
  attr('data-year', d => d.year).
  attr('data-temp', d => data.baseTemperature + d.variance).
  attr('class', 'cell').
  attr('x', d => xScale(d.year)).
  attr('y', d => yScale(monthNames[d.month])).
  attr('width', d => xScale.bandwidth()).
  attr('height', d => yScale.bandwidth()).
  style('fill', d => legendThreshold(data.baseTemperature + d.variance)).
  on('mouseover', d => {
    let str = "<div class='date'>" + d.year + " - " + monthNames[d.month] + "</div>" +
    "<div class='temperature'>" + d3.format(".1f")(data.baseTemperature + d.variance) + "</div>" +
    "<div class='variance'>" + d3.format("+.1f")(d.variance) + "</div>";

    tooltip.attr('data-year', d.year);
    tooltip.show(str);
  }).
  on('mouseout', tooltip.hide);

  console.log("Working");
});