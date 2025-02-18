require('dotenv').config();

const express = require('express');
const {root} =require('../constants');
const fetch = require('node-fetch');
const hbs = require('hbs');
const nytKey = process.env.NYT_CLIENT_KEY;
const app = express();

hbs.registerPartials(`${__dirname}/views/components`);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${root}/public`));

app.get('/', (req, res, next) => {
  fetch(
      `https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        const firstNews = body.results[0];
        const trailingNews = body.results.splice(1, 20);
        console.log(trailingNews[0]);
        res.render('index', {firstNews, trailingNews});
      });
});

app.get('/search-results', (req, res, next) => {
  const searchWord = req.query.q;
  fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchWord}&api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        res.render('searchResult', {coe: body.response.docs, q: req.query.q});
      });
});

app.get('/trending', (req, res, next) => {
  fetch(
      `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        const firstNews = body.results[0];
        const trailingNews = body.results.splice(1, 20);
        res.render('trending', {firstNews, trailingNews});
        console.log(firstNews.media[0]['media-metadata'][1].url);
      });
});

app.get('/most-shared', (req, res, next) => {
  fetch(
      `https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json?api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        const firstNews = body.results[0];
        const trailingNews = body.results.splice(1, 20);
        res.render('mostShared', {firstNews, trailingNews});
        console.log(body.results);
      });
});

app.listen(`${process.env.PORT}`, () => {
  console.log(`My NYT project is running on PORT ${process.env.PORT} 🗞  📰`);
});
