let ctracker;
let videoInput;
let face_x, face_y, face_dim;
let face_count;
let viewers = [];
let cash;

function setup() {
	background(0);

	// variable init
	face_x = 0;
	face_y = 0;
	face_dim = 200;
	face_count = {};

	for (let i = 0; i < news_sites.length; i++) {
		let site = news_sites[i];
		face_count[site] = 0;
	}

	// setup camera capture
 	videoInput = createCapture(VIDEO);
	videoInput.size(640, 480);
	// videoInput.position(0, 0);
	videoInput.hide();

	// setup canvas
	var cnv = createCanvas(200, 200);
	cnv.id = 'canvas';
	// canvas.hide();
	// cnv.position(0, 0);

	// setup tracker
	ctracker = new clm.tracker();
	ctracker.init();
	ctracker.start(videoInput.elt);

	// capture_clicks();
	cash = loadSound('media/cash.mp3');

	console.log("tracking loaded");
}

function draw() {
	background(255, 255, 255, 0);
	// background(0);
	// clear();
	// image(videoInput, 0, 0, width, height);

	// get array of face marker positions [x, y] format
	let positions = ctracker.getCurrentPosition();
	if(positions.length > 14) {
		let coords = getFaceCoords(positions);
		face_x   = coords[0];
		face_y   = coords[1];
		face_dim = coords[2];
	}

	// draw the capture square
	noFill();
	stroke(255, 0, 0);
	strokeWeight(1);
	// rect(face_x, face_y, face_dim, face_dim);
}

function getFaceCoords(positions){
	// get face limit coordinates
	let pos_l_x = parseFloat(positions[0][0].toFixed(2));
	let pos_l_y = parseFloat(positions[0][1].toFixed(2));
	let pos_r_x = parseFloat(positions[14][0].toFixed(2));
	let pos_r_y = parseFloat(positions[14][1].toFixed(2));

	// get face width and center points
	let face_width = Math.abs(pos_r_x - pos_l_x)*1.5;
	let face_mid_x = (pos_r_x + pos_l_x)/2;
	let face_mid_y = (pos_r_y + pos_l_y)/2;

	// get origin point
	let face_orig_x = face_mid_x - face_width/2;
	let face_orig_y = face_mid_y - face_width/2;
	if(face_orig_y < 0){ face_orig_y = 0; }

	// return the values
	return [face_orig_x, face_orig_y, face_width];
}

function captureFace(news_source){
	// play cash register sound
	cash.play();
	// get video feed
	let img = videoInput.get();
	// grab face from feed
  let face = img.get(face_x, face_y, face_dim, face_dim);
	// save to file and count
	let filename = news_source + '_' + face_count[news_source];
	face_count[news_source]++;
	face.save(filename, 'png');

	// and open the page
	// let cont_external = document.getElementById('ext-site-view');
	// // get the url
	// let site_url = document.getElementById(news_source + '-title').url;
	// cont_external.src = site_url;
	// // and display!
	// let cont_frame = document.getElementById('ext-site-cont');
	// // let cont_frame = document.getElementsByClassName('ext-site')[0];
	// cont_frame.display = "block";

	// alert("T.HANKS");
}

// count the viewers for every news site
function count_viewers(views){
	viewers = views;
	// console.log(viewers);
  // reset counter
  for (let i = 0; i < news_sites.length; i++) {
    let source = news_sites[i];
    face_count[source] = 0;
  }
  for (let i = 0; i < viewers.length; i++) {
    // see from which site it is
    for (let j = 0; j < news_sites.length; j++) {
      let site = news_sites[j];
      if(viewers[i].startsWith(site)){
        face_count[site]++;
      }
    }
  }
	// console.log(face_count);
}
