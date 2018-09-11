let viewers = [];
let viewers_counter = {};
let news_sites = ["bbc-news",
                  "bloomberg",
                  "cnn",
                  "fox-news",
                  "the-hill",
                  "the-huffington-post",
                  "the-new-york-times",
                  "the-washington-post"];

for (let i = 0; i < news_sites.length; i++) {
  // get the source we're dealing with
  let source = news_sites[i];
  // set the numbers of viewers of each source to 0
  viewers_counter[source] = 0;
}
let start_time = 0;
let total_views = 0;


// GET DATA
window.addEventListener('load', load_viewers);
setInterval(load_viewers, 1000*5);
setInterval(update_money, 1000*5);
setInterval(display_total_viewers, 1000*60*5);

function load_viewers(){
  // create the xml http request
  let src = window.location.protocol + "//" + window.location.host + "/viewers";
  http_req = new XMLHttpRequest();
  // set callback function
  http_req.onreadystatechange = grab_viewers;
  // send request
  http_req.open("GET", src, true);
  http_req.send();
}
// grab data from the XML HTTP request
function grab_viewers(data){
  try {
    if (http_req.readyState === XMLHttpRequest.DONE) {
      if (http_req.status === 200) {
        // parse responseText
        viewers = JSON.parse(http_req.responseText);
        if(viewers.length > 0) {
          // start_time = Date.parse( viewers[viewers.length  -1] );
          start_time = viewers[viewers.length  -1];
        }
      } else {
        console.log("status problem: " + http_req.status);
      }
    }
  } catch (e) {
    console.log("Ups! Something's wrong D:\n" +e);
  }
  // count the viewers for each site
  count_viewers();
  // display data after getting and counting it
  display_viewers();
}

// count the viewers for every news site
function count_viewers(){
  // reset counter
  for (let i = 0; i < news_sites.length; i++) {
    let source = news_sites[i];
    viewers_counter[source] = 0;
  }
  for (let i = 0; i < viewers.length; i++) {
    // see from which site it is
    for (let j = 0; j < news_sites.length; j++) {
      let site = news_sites[j];
      if(viewers[i].startsWith(site)){
        viewers_counter[site]++;
      }
    }
  }
}

// display viewers in the site
function display_viewers(){
  for (let i = 0; i < news_sites.length; i++) {
    // get the source we're dealing with
    let source = news_sites[i];
    // see which viewer number we have to get
    let num = viewers_counter[source] -1;
    // if it's -1, don't do anything, else load the image
    if (num <= -1){}
    else {
      // get the image
      let viewer_img = source + '_' + num + '.png';
      // get each the container for the viewer image
      let cont_img = document.getElementById(source + '-viewer');
      // add the data!
      cont_img.src = 'viewers/' + viewer_img;
    }
  }
  update_money();
}
// display ALL the viewers
function display_total_viewers(){
  // flush the total viewers list
  flush_total_viewers();
  // shuffle the viewers list to display it in a different order
  let new_views = viewers.slice(0);
  new_views = shuffle(new_views);
  // get the main container
  let cont_total_viewers = document.getElementsByClassName('viewers-total-block')[0];
  // go over the viewers list to find each
  for (let i = 0; i < new_views.length; i++) {
    // see if it's a valid filename (corresponds to a news source)
    for (let j = 0; j < news_sites.length; j++) {
      if( new_views[i].startsWith( news_sites[j] ) ){
        // add a new container div
        let cont_div = document.createElement("div");
        // add the classes
        cont_div.classList.add('viewer');
        // cont_div.classList.add('col');
        cont_div.classList.add('col-05');
        // add the image element
        let cont_img = document.createElement("img");
        // add the class
        cont_img.classList.add('view-total-img');
        // add the image file
        cont_img.src = 'viewers/' + new_views[i];
        // add image to div
        cont_div.appendChild(cont_img);
        // add image to everything
        cont_total_viewers.appendChild(cont_div);
      }
    }
  }
}
function flush_total_viewers(){
  // get list of chldren elements
  let cont_total_viewers = document.getElementsByClassName('viewers-total-block')[0];
  let cont_list = cont_total_viewers.children;
  // loop and destroy, but only from index 1 onwards
  for (let i = 1; i < cont_list.length; i++) {
    cont_list[i].remove();
  }
}

const numberWithCommas = (x) => {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function update_money(){
  // calculate the time passed between the start of the server and now
  let curr = new Date();
  let time_passed = (curr - start_time)/100;
  // calculate the total amount of interactions
  let new_views = 0;
  for (let key in viewers_counter) {
    if (viewers_counter.hasOwnProperty(key)){
      new_views += viewers_counter[key];
    }
  }
  if (new_views != total_views) {
    display_total_viewers();
    total_views = new_views;
  }
  // update total views counter
  let total_views_counter = document.getElementById('total_viewers');
  total_views_counter.textContent = total_views;
  // console.log(total_views);
  // calculate the money generated
  let money_gen = time_passed/6 + total_views*1500;
  // update the display
  let cont_money = document.getElementById('money_collected');
  cont_money.textContent = numberWithCommas(money_gen.toFixed(2));
}


//  shuffle an array
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
