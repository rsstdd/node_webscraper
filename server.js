const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
// const output = require('./output.json');
const { urls1 } = require('./apages');
const app = express();
const port = process.env.PORT || 8000;

const rootStr = 'https://en.wikipedia.org/wiki/'

// console.log(urls1);

app.get('/list', (req, res) => {

  for (let i = 0; i < 1; i++) {
    request(`${rootStr}${urls1[i]}`, (err, res, html) => {
      if (err) {
        console.log(err);
      } else if (!err && res.statusCode === 200) {
        const $ = cheerio.load(html);
        const json = { name: '', type: '', numberBuilt: '', description: '', yearInService: '', countryOfOrigin: '', operators: '', maxSpeed: '', maxRange: '', ceiling: '', engines: '', imgUrls: [] };

        $('.infobox tr td').each(function() {
          let data = $(this);

          let temp = data.text();
          temp = temp.split('/n');

          json.name = temp[1];
          json.type = temp[2];
          json.countryOfOrigin = temp[8];
          json.name = temp[1];
          json.numberBuilt = temp[9]
          // console.log(json.name);
          console.log(json.name);

          json.name = data.text();

        });

        $('.image').each(function() {
          const data = $(this);
          const img = data.attr('href');

          if (img !== '/wiki/File:Commons-logo.svg' && img !== '') {
            json.imgUrls.push(img);
          }
        });

        json.description = $('.body-content').find('p').text();

        console.log(json);

        // fs.appendFile('output.json', JSON.stringify(json, null, 4), (err) => {
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
