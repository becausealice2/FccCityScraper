// by alicejiang1

var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    app     = express(),
    json    = []; // Array of Objects :D

app.get('/', function(req, res){

  var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/List-of-Free-Code-Camp-city-based-Campsites';

  request(url, function(error, response, html){
    if(error){ console.log(error) };

    var $ = cheerio.load(html,{"normalizeWhitespace":true});

    // Any less specific and Cheerio returns data from extra elements
    $('#wiki-body .markdown-body > ul > li').find('a').each(function(){
      var campsite = {};

      campsite.city = $(this).text().trim();
      // Each city's containint unordered list
      var cityList = $( $(this).parent() ).parent();
      // Element containing the name of the city's region name (if city is not within a region, element contains country name)
      var element = $(cityList).parent().contents().get(0);

      // Check if element is at the top of the UL trees.
      if(!$( $( $(element).parent() ).parent() ).parent().hasClass('markdown-body')){
        campsite.region = $( element ).text().trim();
        campsite.country = $( $( $( $(element).parent() ).parent() ).parent().contents().get(0) ).text().trim();
      } else {
        campsite.country = $( element ).text().trim();
      }

      campsite.facebook = $(this).attr('href').trim();

      json.push(campsite);
    });

  res.json(json);
  });
});


app.listen(8080);
console.log('Listening on port 8080');
exports = module.exports = app;