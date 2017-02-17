const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 8000;

app.get('/list', (req, res) => {
  const url = 'https://en.wikipedia.org/wiki/List_of_aircraft_of_World_War_II?oldformat=true';
  const catArr = [];
  const links = [];

  request(url, (err, res, html) => {
    if (err) {
      console.err(err);
    } else if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html);
      let category,
          name,
          yearInService,
          countryOfOrigin,
          operators,
          link;
      const json = { category: '', name: '', yearInService: '', countryOfOrigin: '', operators: '', link: '' };

      $('.mw-headline').filter(function() {
        const data = $(this);

        category = data.text();

        console.log(category);
        
        json.category = category;
      });

      $('.wikitable tr').filter(function() {
        const data = $(this);

        let temp = data.children().text();
            name = data.children().first().text()
            yearInService = data.children().first().next().text();
            operators = data.children().first().next().next().text();

        // console.log('=====', name, yearInService, operators, '=====');

        json.name = name;
        json.yearInService = yearInService;
        json.countryOfOrigin = countryOfOrigin;
        json.operators = operators;
        json.link = link;
      });

      $('.wikitable a').each(function() {
        const data = $(this);

        link = data.attr('href');

        json.link = link;
      })

      fs.writeFile('output.json', JSON.stringify(json, null, 4), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Scrape successful - Data Located in the Output.json file');
        }
      });
    }
  });
});

// app.get('/aircraft')

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
