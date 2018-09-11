let news = [];
let news_sites = ["bbc-news",
                  "bloomberg",
                  "cnn",
                  "fox-news",
                  "the-hill",
                  "the-huffington-post",
                  "the-new-york-times",
                  "the-washington-post"];

// GET DATA
window.addEventListener('load', load_data);
setInterval(display_data, 1000*60*5);

function load_data(){
  // create the xml http request
  let src = window.location.protocol + "//" + window.location.host + "/alldata";
  http_req = new XMLHttpRequest();
  // set callback function
  http_req.onreadystatechange = grab_data;
  // send request
  http_req.open("GET", src, true);
  http_req.send();

  // setup block clicks
  capture_clicks();
}
// grab data from the XML HTTP request
function grab_data(data){
  try {
    if (http_req.readyState === XMLHttpRequest.DONE) {
      if (http_req.status === 200) {
        // parse responseText
        let resp = JSON.parse(http_req.responseText)
        news = resp.slice(0, resp.length-1);
        views = resp[resp.length-1];
        // count the viewers for each site
        count_viewers(views);
      } else {
        console.log("status problem: " + http_req.status);
      }
    }
  } catch (e) {
    console.log("Ups! Something's wrong D:\n" +e);
  }
  // display data after getting it
  display_data();

}


// display data in the site
function display_data(){
  console.log(news);
  for (let i = 0; i < news.length; i++) {
    // get the source we're dealing with
    let source = news[i].source;
    // get a random article from the 10 top
    let article_id = Math.floor(random( news[i].articles.length ));
    let news_title = news[i].articles[article_id].title;
    let news_url   = news[i].articles[article_id].url;
    let news_desc  = news[i].articles[article_id].description;
    let news_img   = news[i].articles[article_id].urlToImage;
    // get each the container for each element
    let cont_title = document.getElementById(source + '-title');
    let cont_desc  = document.getElementById(source + '-desc');
    let cont_img   = document.getElementById(source + '-img');
    // add the data!
    cont_title.textContent = news_title;
    cont_title.url         = news_url;
    cont_title.href        = '#';
    cont_desc.textContent  = news_desc;
    cont_img.src           = news_img;
  }
}

function capture_clicks(){
  for (let i = 0; i < news_sites.length; i++) {
    let source = news_sites[i];
    let block_name = "#" + source + "-block";
    // console.log(block_name);
  	$( block_name ).click(function(){
  		captureFace(source);
      // console.log(source + " - CLICK!");
  	});
  }
  console.log("capturing clicks");
}
