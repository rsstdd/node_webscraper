const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const output = require('./output.json');
const { urls1 } = require('./apages');
const app = express();
const port = process.env.PORT || 8000;

const urlstr = 'https://en.wikipedia.org/wiki/'

// console.log(urls1);

app.get('/list', (req, res) => {
  for (let i = 0; i < urls1.length; i++) {
    request(`${urlstr}${urls1[i]}`, (err, res, html) => {
      if (err) {
        console.log(err);
      }
      else if (!err && res.statusCode === 200) {
        const $ = cheerio.load(html);
        const aircraft = [];
        const json = { aircraft: [] };

        $('.infobox tr td').each(function() {
          const data = $(this);

          console.log(data.text());

          json.aircraft.push(data.text());
        });

        $(' .image').each(function() {
          const data = $(this);
          const imgUrl = data.attr('href');

          aircraft.push(imgUrl);
        });

        const description = $('.body-content').find('p').text();

        // console.log(description);

        aircraft.push(description);

        // console.log(aircraft);

        // fs.writeFile('output.json', JSON.stringify(json, null, 4), (err) => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     console.log('Scrape successful - Data Located in the Output.json file');
        //   }
        // });
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;

//
// $('.mw-headline').filter(function() {
//   const data = $(this);
//
//   category = data.text();
//
//   console.log(category);
//
//   json.category = category;
// });
//
// $('.wikitable tr').filter(function() {
//   const data = $(this);
//
//   let temp = data.children().text();
//       name = data.children().first().text()
//       yearInService = data.children().first().next().text();
//       operators = data.children().first().next().next().text();
//
//   // console.log('=====', name, yearInService, operators, '=====');
//
//   json.name = name;
//   json.yearInService = yearInService;
//   json.countryOfOrigin = countryOfOrigin;
//   json.operators = operators;
//   json.link = link;
// });
//
// $('.wikitable a').each(function() {
//   const data = $(this);
//
//   link = data.attr('href');
//
//   json.link = link;
// })
