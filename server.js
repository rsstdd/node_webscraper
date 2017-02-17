const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 8000;

app.get('/scrape', (req, res) => {
  const url = 'http://www.imdb.com/title/tt1229340/';

  request(url, (err, res, body) => {
    if (err) {
      console.log(err);
    }
    else if (!err && res.statusCode === 200) {
      const $ = cheerio.load(body);
      let title, release, rating;

      const json = { title: '', release: '', rating: '' };

      $('.title_wrapper').filter(function() {
        const data = $(this);

        title = data.children().first().text().trim();
        release = data.children().last().children().text();

        const year = release.trim().split(' ')[47];
        const month = release.trim().split(' ')[46];

        release = `${month} ${year}`;

        json.title = title;
        json.release = release;
      });

      $('.ratingValue').filter(function() {
        const data = $(this);

        rating = data.text().split(' ')[0].split('').slice(1, 10).join('');
        json.rating = rating;
      });

      fs.writeFile('output.json', JSON.stringify(json, null, 4), (err) => {
        console.log('Scrape successful - Check your project directory for the output.json file');
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
