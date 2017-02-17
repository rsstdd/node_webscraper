const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 8000;

app.get('/list', (req, res) => {
  // const url ='https://www.wikiwand.com/en/List_of_aircraft_of_World_War_II'
  const url = 'https://en.wikipedia.org/wiki/List_of_aircraft_of_World_War_II?oldformat=true';
  const catArr = [];

  request(url, (err, res, body) => {
    if (err) {
      console.err(err);
    } else if (!err && res.statusCode === 200) {
      const $ = cheerio.load(body);
      let category, name, year_in_service, country_of_origin, operators, link;

      const json = { category: '', name: '', yearInService: '', countryOfOrigin: '', operators: '', link: '' };

      $('.mw-headline').filter(function() {
        const data = $(this);

        category = data.text();

        catArr.push(category);

        json.category = catArr;
      });

      $('.wikitable').filter(function() {
        const data = $(this);

        let temp = data.text();
        temp.split(' ')
        console.log(temp);
        json.name = rating;
        json.yearInService = yearInService;
        json.countryOfOrigin = countryOfOrigin;
        json.operators = operators;
        jsonlink = link;
      });

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
