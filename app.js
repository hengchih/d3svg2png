var jsdom = require('jsdom');
var htmlStub = '<html><head><link rel="stylesheet" href="styles/style.css"/></head><body><div id="svgdiv"></div><script src="node_modules/d3/d3.min.js"></script></body></html>';
var fs = require('fs');
var juice = require('juice');
var grunt = require('grunt');
var drawd3 = require('./scripts/chart1');

//html string become dom obj
jsdom.env({
    features: { QuerySelector: true },
    html: htmlStub,
    done: function (errors, window) {
        var el = window.document.querySelector('#svgdiv')
            , body = window.document.querySelector('body');

        //draw some svg graphic
        drawd3(el);

        var svghtml = window.document.innerHTML;

        //export svg to a individual html file
        fs.writeFile('images/chart.html', svghtml, function (err) {
            if (err) {
                console.log('error saving document', err);
            } else {
                console.log('The file was saved, open chart.html to see the result');
                //external css convert into inline style
                juice('images/chart.html', function (err, html) {
                    jsdom.env({
                        features: { QuerySelector: true },
                        html: html,
                        done: function (errors, window) {
                            //svg content be extracted from html file and create a svg file in img folder
                            var el = window.document.querySelector('#svgdiv');
                            var xmltext = '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                            fs.writeFile('images/chart.svg', xmltext + el.innerHTML, function (err) {
                                if (err) {
                                    console.log('error create chart svg', err);
                                } else {
                                    console.log('create chart svg');
                                    //convert svg into png
                                    grunt.tasks(['default']);
                                }
                            })
                        }
                    })
                });
            }
        })
    }
});