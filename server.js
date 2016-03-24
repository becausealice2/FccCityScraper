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
    $('#wiki-body .markdown-body > ul > li').each(function(){
      var data = {};

      var city     = $(this).find('a').text(),
          facebook = $(this).find('a').attr("href"),
          region   = $(this).find('ul > li > ul').text().trim(),
          country  = $( $(this).contents().get(0) ).text().trim();

      data = {"country":country,"region":region,"city":city};

      json.push(data);
    });

  res.send(json);
  });
});

app.listen(8080);
console.log('Listening on port 8080');
exports = module.exports = app;





// country
//   region
//   region
//     city
//     city