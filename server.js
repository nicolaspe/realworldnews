var express = require('express');
var app = express();
var fs = require('fs');
var server = require('http').createServer(app);
const NewsAPI = require('newsapi');
// var start_time = new Date();
var start_time = Date.parse("Thu Jun 07 2018 00:00:00 GMT-0400 (EDT)");

// config file
require('./config.js');

// variables
const newsapi = new NewsAPI(CONFIG.NEWS_API);
var news = [];
init();

var viewers = [];
read_viewers();
get_news();
time_functions();

// feed html frontend
app.use(express.static('public'));

// feed data to client
app.get('/data', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send( JSON.stringify(news) );
});
app.get('/viewers', function(req, res){
  // console.log("viewers request");
  res.setHeader('Content-Type', 'application/json');
  let aux2 = viewers.slice(0);
  aux2.push(start_time.toString());
  res.send( JSON.stringify(aux2) );
});
app.get('/alldata', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  let aux = news.slice(0);
  aux.push(viewers);
  res.send( JSON.stringify(aux) );
});

server.listen(2540, function(){
  get_news();
  console.log('Server listening on port 2540');
})


// initialization function
function init(){
  let news_sites = ["cnn",
                    "bbc-news",
                    "bloomberg",
                    "the-hill",
                    "fox-news",
                    "the-huffington-post",
                    "the-new-york-times",
                    "the-washington-post"];
  for(let i = 0; i < news_sites.length; i++){
    news[i] = {};
    news[i].source = news_sites[i];
    news[i].articles = [];
  }
}

// NEWS
function get_news(){
  console.log("fetching news");
  // go through sources to make requests
  for(let i = 0; i < news.length; i++){
    // make request
    source = news[i].source;
    // console.log(source);
    newsapi.v2.topHeadlines({
      sources: source,
      language: 'en'
    }).then(response => {
      news[i].articles = response.articles;
      // console.log(response.articles);
    });
  }
}

// get the viewers for each site
function read_viewers(){
  fs.readdir('public/viewers/', function(err, files){
    viewers = files;
    // console.log(files);
  });
  // console.log("reading viewers");
}


// set refresh functions
function time_functions(){
  // get data from NewsAPI every 30 minutes
  setInterval(get_news, 1000*60*30);
  // check the viewers every 5 seconds
  setInterval(read_viewers, 1000*5);
}
