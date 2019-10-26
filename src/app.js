require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const hbs = require('hbs');
const port = 3000;
const nytKey = process.env.NYT_CLIENT_KEY;
const app = express();

hbs.registerPartials(`${__dirname}/views/components`);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res, next) => {
  fetch(
      `https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        const firstTen = body.results.slice(0, 10);
        console.log(firstTen[0]);
        res.render('index', firstTen);
      });
});

app.get('/search-results', (req, res, next) => {
  const searchWord = req.query.q;
  fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchWord}&api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        res.render('searchResult', body.response.docs);
        console.log(body.response.docs[0].multimedia[0].url);
      });
});

app.get('/trending', (req, res, next) => {
  fetch(
      `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        const firstNews = body.results[0];
        const trailing = body.results.splice(1, 10);
        res.render('trending', {firstNews, trailing});
        console.log(body.results);
      });
});

app.get('/most-shared', (req, res, next) => {
  fetch(
      `https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json?api-key=${nytKey}`,
  )
      .then((res) => res.json())
      .then((body) => {
        const firstNews = body.results[0];
        const trailing = body.results.splice(1, 10);
        res.render('mostShared', {firstNews, trailing});
        console.log(body.results);
      });
});

app.listen(`${port}`, () => {
  console.log(`My NYT project is running on port ${port} 🗞  📰`);
});
