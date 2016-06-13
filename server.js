// by alicejiang1

var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    app     = express(),
    json    = []; // Array of Objects :D

app.get('/', function(req, res){

  var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/LocalGroups-List';

  request(url, function(err, response, html){
    if(err){ console.log(err) };

    var $ = cheerio.load(html,{"normalizeWhitespace":true});

    // Any less specific and Cheerio returns data from extra elements
    $('#wiki-body .markdown-body > ul > li').find('a').each(function(){
      var campsite = {};

      var city = $(this).text().trim();
      campsite.city = city;
      // Each city's containing unordered list element
      var cityList = $( $(this).parent() ).parent();
      // Element containing the name of the city's region (if city is not within a region, element contains country name)
      var element = $(cityList).parent().contents().get(0);

      // Check if element is at the top of the UL trees.
      if(!$( $( $(element).parent() ).parent() ).parent().hasClass('markdown-body')){
        // Don't include the listed US region 'Ambiguous'
        if($( element ).text().trim() !== 'Ambiguous'){
          var region = $( element ).text().trim();
          campsite.region = region;
        }
        var country = $( $( $( $(element).parent() ).parent() ).parent().contents().get(0) ).text().trim();
      } else {
        var country = $( element ).text().trim();
      }

      campsite.country = country;
      campsite.facebook = $(this).attr('href').trim();

      json.push(campsite);
    });

  res.json(json);
  });
});


app.listen(8080);
console.log('Listening on port 8080');
exports = module.exports = app;