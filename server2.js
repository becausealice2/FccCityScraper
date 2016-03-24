// by @t3h2mas

var express = require('express'),
  request = require('request'),
  cheerio = require('cheerio'),
  app = express(); // Array of Objects :D

app.set('json spaces', 2);

app.get('/', function(req, res) {

  var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/List-of-Free-Code-Camp-city-based-Campsites';

  request(url, function(error, response, html) {
    if (error) {
      console.log(error)
    };

    var $ = cheerio.load(html, {
      normalizeWhitespace: true
    });
    var json = [];

    // Any less specific and Cheerio returns data from extra elements
    $('#wiki-body .markdown-body > ul > li').each(function() {
			var data = {
				country: null,
				pages: []
			};
      // this should be every country
      var countryName = $($(this).contents().get(0)).text().trim();
      //console.log('inside: ' + countryName);
			data.country = countryName;

      var ul = $(this).find('ul');
      ul.each(function(){
        var element = $(this).find('a');
        //console.log(countryName + ' length of .find(a) : ' + element.length);

				var resp = [];
        element.each(function(){
					var name = $(this).text().trim();
        	var facebook = $(this).attr('href').trim();
					resp.push([name, facebook]);
				});
				data.pages.push(resp);
			});

			json.push(data);
    });

    res.json(json);
  });
});

app.listen(8081);
console.log('Listening on port 8081');
exports = module.exports = app;