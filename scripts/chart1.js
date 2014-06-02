"use strict";

var d3 = require('d3');
var data = [
    {
        "additionalBudget": 155,
        "siteName": "A1",
        "initBudget": 315,
        "additionalRateIsOver": true
    },
    {
        "additionalBudget": 511,
        "siteName": "A2",
        "initBudget": 912,
        "additionalRateIsOver": true
    }
];


module.exports = function (el) {

    var margin = { top: 20, right: 38, bottom: 30, left: 60 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var diamondSize = 8;
    var textHeight = 6;

    var bx = d3.scale.ordinal()
        .rangeRoundBands([0, width], .3);

    var ly = d3.scale.linear()
        .range([height, 0]);

    var ry = d3.scale.linear()
        .range([height, 0]);

    var bxAxis = d3.svg.axis()
        .scale(bx)
        .tickSize(5, 1, 0)
        .tickPadding(10)
        .orient("bottom");

    var lyAxis = d3.svg.axis()
        .scale(ly)
        .tickSize(-width, 1, 0)
        .tickFormat(function (d, i) {
            return d >= 0 ? d : "(" + -d + ")";
        })
        .orient("left");

    var ryAxis = d3.svg.axis()
        .scale(ry)
        .tickSize(0, 1, 0)
        .tickFormat(d3.format('%'))
        .orient("right");

    var additionalRateLine = d3.svg.line()
        .x(function (d) {
            return bx(d.siteName);
        })
        .y(function (d) {
            return ry(d.additionalRate);
        });

    var svg = d3.select(el).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr("class", "#svg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //XMLHttpRequest is for browser
    //d3.json("chart1.json", function (err, data) {
    //fs.readFile("./models/chart1.json",function(err,data){
    //var data = JSON.parse(data);

    data.forEach(function (d) {
        d.accumulativeBudget = d.initBudget + d.additionalBudget;

        if (d.initBudget >= 0 && d.additionalBudget >= 0) {
            d.finalBudget = d.initBudget + d.additionalBudget;
        } else if (d.initBudget >= 0 && d.additionalBudget < 0) {
            d.finalBudget = d.additionalBudget;
        } else if (d.initBudget < 0 && d.additionalBudget > 0) {
            d.finalBudget = d.additionalBudget;
        } else if (d.initBudget < 0 && d.additionalBudget < 0) {
            d.finalBudget = d.initBudget + d.additionalBudget;
        }

        d.additionalRate = (d.additionalBudget / d.initBudget).toFixed(2);
    })

    var minly = 0, maxly = 0, minry = 0, maxry = 0;

    data.forEach(function (d) {
        minly = d.additionalBudget < minly ? d.additionalBudget : minly;
        maxly = d.additionalBudget > maxly ? d.additionalBudget : maxly;
        minly = d.finalBudget < minly ? d.finalBudget : minly;
        maxly = d.finalBudget > maxly ? d.finalBudget : maxly;
        minly = d.initBudget < minly ? d.initBudget : minly;
        maxly = d.initBudget > maxly ? d.initBudget : maxly;
        minly = d.accumulativeBudget < minly ? d.accumulativeBudget : minly;
        maxly = d.accumulativeBudget > maxly ? d.accumulativeBudget : maxly;

        minry = +d.additionalRate < +minry ? +d.additionalRate : minry;
        maxry = +d.additionalRate > maxry ? +d.additionalRate : maxry;
    })


    minly = minly < 0 ? -((parseInt(-minly / 1000) + 1) * 1000) : 0;
    maxly = maxly >= 0 ? (parseInt(maxly / 1000) + 1) * 1000 : 0;
    minry = minry < 0 ? (parseInt(minry / 0.1) - 2) / 10 : 0;
    maxry = maxry > 0 ? (parseInt(maxry / 0.1) + 2) / 10 : 0;

    bx.domain(data.map(function (d) {
        return d.siteName;
    }));

    ly.domain([minly, maxly]);
    ry.domain([minry, maxry]);

    lyAxis.ticks((Math.abs(minly) + Math.abs(maxly)) / 1000);
    ryAxis.ticks((Math.abs(minry) + Math.abs(maxry)) / .1);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(bxAxis);

    svg.append("g")
        .attr("class", "y axis left-side")
        .call(lyAxis);

    svg.append("g")
        .attr("class", "y axis right-side")
        .attr("transform", "translate(" + width + ",0)")
        .call(ryAxis);

    var category = svg.append("g")
        .attr("class", "all")
        .attr("transform", "translate(" + (width - 365) + ",5)");

    var c1 = category.append("g").attr("class", "final-budget");
    var c2 = category.append("g").attr("class", "init-budget");
    var c3 = category.append("g").attr("class", "accumulative-budget");
    var c4 = category.append("g").attr("class", "additional-rate");

    c1.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 30)
        .attr("height", 10);
    c1.append("text")
        .attr("x", 35)
        .attr("y", 10)
        .text("累計追加");
    c2.append("rect")
        .attr("x", 100)
        .attr("y", 0)
        .attr("width", 30)
        .attr("height", 10);
    c2.append("text")
        .attr("x", 135)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .text("年初設定");
    c3.append("rect")
        .attr("x", 200)
        .attr("y", 0)
        .attr("transform", "rotate(45,205,5)")
        .attr("width", 10)
        .attr("height", 10);
    c3.append("text")
        .attr("x", 215)
        .attr("y", 10)
        .text("累計預算");
    c4.append("line")
        .attr("x1", 275)
        .attr("y1", 4)
        .attr("x2", 315)
        .attr("y2", 4);
    c4.append("circle")
        .attr("cx", 295)
        .attr("cy", 4)
        .attr("r", 6)
        .attr("class", "additional-rate-circle");
    c4.append("text")
        .attr("x", 320)
        .attr("y", 10)
        .text("追加%");


    svg.append("g")
        .attr("class", "final-budget-group")
        .selectAll(".final-budget")
        .data(data)
        .enter().append("rect")
        .attr("class", function (d) {
            return "final-budget " + d.siteName;
        })
        .attr("x", function (d) {
            return bx(d.siteName);
        })
        .attr("width", bx.rangeBand())
        .attr("y", function (d) {
            return d.finalBudget > 0 ? ly(d.finalBudget) : ly(0);
        })
        .attr("height", function (d) {
            return Math.abs(ly(d.finalBudget) - ly(0));
        })
        .on("mouseover", function (d) {
            d3.select(this).style({"cursor": "pointer"});
        });

    svg.append("g")
        .attr("class", "init-budget-group")
        .selectAll(".init-budget")
        .data(data)
        .enter().append("rect")
        .attr("class", "init-budget")
        .attr("x", function (d) {
            return bx(d.siteName);
        })
        .attr("width", bx.rangeBand())
        .attr("y", function (d) {
            return d.initBudget > 0 ? ly(d.initBudget) : ly(0);
        })
        .attr("height", function (d) {
            return Math.abs(ly(d.initBudget) - ly(0));
        });

    svg.append("path")
        .datum(data)
        .attr("class", "additional-rate")
        .attr("transform", "translate(" + bx.rangeBand() / 2 + ",0)")
        .attr("d", additionalRateLine);

    svg.append("g")
        .attr("class", "additional-rate-circles")
        .selectAll(".additional-rate-circle")
        .data(data)
        .enter().append("circle")
        .attr("transform", "translate(" + bx.rangeBand() / 2 + ",0)")
        .attr("class", function (d) {
            return d.additionalRateIsOver ? "additional-rate-circle is-over" : "additional-rate-circle";
        })
        .attr("cx", function (d) {
            return bx(d.siteName);
        })
        .attr("cy", function (d) {
            return ry(d.additionalRate);
        })
        .attr("r", 5);

    svg.append("g")
        .attr("class", "accumulative-budgets")
        .selectAll(".accumulative-budget")
        .data(data)
        .enter().append("rect")
        .attr("class", "accumulative-budget")
        .attr("transform", function (d) {
            return "rotate(45," + ((bx(d.siteName) - 4 + bx.rangeBand() / 2) + diamondSize / 2) + "," + ly(d.accumulativeBudget) + ")";
        })
        .attr("x", function (d) {
            return (bx(d.siteName) - diamondSize / 2 + bx.rangeBand() / 2);
        })
        .attr("width", diamondSize)
        .attr("y", function (d) {
            return ly(d.accumulativeBudget) - diamondSize / 2;
        })
        .attr("height", diamondSize);

    svg.append("g")
        .attr("class", "additional-rate-text")
        .selectAll(".additional-rate")
        .data(data)
        .enter().append("text")
        .attr("class", function (d) {
            return d.additionalRateIsOver ? "additional-rate-text is-over" : "additional-rate-text";
        })
        .attr("x", function (d) {
            return bx(d.siteName) + bx.rangeBand() / 2;
        })
        .attr("y", function (d) {
            return d.additionalRate > 0
                ? ry(d.additionalRate) - 11
                : ry(d.additionalRate) + 18;
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.additionalRate >= 0
                ? parseInt(d.additionalRate * 100) + "%"
                : "(" + parseInt((-d.additionalRate * 100)) + "%" + ")";
        });

    svg.append("g")
        .attr("class", "final-budget-text")
        .selectAll(".final-budget")
        .data(data)
        .enter().append("text")
        .attr("class", function (d) {
            return d.additionalBudget >= 0 ? "final-budget-text positive" : "final-budget-text negative";
        })
        .attr("x", function (d) {
            return bx(d.siteName) + bx.rangeBand() / 2;
        })
        .attr("y", function (d) {
            var dy = 0;
            var y_final = d.finalBudget > 0
                ? ly(d.finalBudget) + Math.abs(ly(d.finalBudget) - ly(d.initBudget)) / 2 + textHeight
                : ly(d.finalBudget) - Math.abs(ly(d.finalBudget) - ly(0)) / 2 + textHeight;

            var y_rate = d.additionalRate > 0
                ? ry(d.additionalRate) - 11
                : ry(d.additionalRate) + 18;

            var y_diff = Math.abs(y_final - y_rate);

            if (y_diff < 14) {
                if (y_final <= y_rate) dy = 15 - y_diff;
                if (y_final > y_rate) dy = -(15 - y_diff);
            }

            return y_final + dy;
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.additionalBudget >= 0
                ? d.additionalBudget
                : "(" + (-d.additionalBudget) + ")";
        });

    svg.append("g")
        .attr("class", "init-budget-text")
        .selectAll(".init-budget")
        .data(data)
        .enter().append("text")
        .attr("class", function (d) {
            return d.initBudget > 0 ? "positive" : "negative";
        })
        .attr("x", function (d) {
            return bx(d.siteName) + bx.rangeBand() / 2;
        })
        .attr("y", function (d) {
            return ly(d.initBudget) + Math.abs(ly(d.initBudget) - ly(0)) / 2 + textHeight;
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.initBudget > 0
                ? d.initBudget
                : "(" + (-d.initBudget) + ")";
        });

    svg.append("g")
        .attr("class", "accumulative-budget-text")
        .selectAll(".accumulative-budget")
        .data(data)
        .enter().append("text")
        .attr("class", function (d) {
            return d.accumulativeBudget > 0 ? "accumulative-budget positive" : "accumulative-budget negative";
        })
        .attr("x", function (d) {
            return bx(d.siteName) + bx.rangeBand() / 2;
        })
        .attr("y", function (d) {
            return ly(d.accumulativeBudget) - 12;
        })
        .attr("text-decoration", "underline")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.accumulativeBudget > 0
                ? d.accumulativeBudget
                : "(" + (-d.accumulativeBudget) + ")";
        });

    //})
}