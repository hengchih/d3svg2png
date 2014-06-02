var d3 = require('d3');

module.exports = function (el) {
    d3.select(el)
        .append('svg:svg')
        .attr('width', 600).attr('height', 300)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .append('circle')
        .attr('class', "circle")
        .attr('cx', 300).attr('cy', 150).attr('r', 30);

    console.log("finish draw-task");
};
