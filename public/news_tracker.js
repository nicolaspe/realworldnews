let video_input, clm_tracker;
clm_tracker.init();
clm_tracker.start(video_input);

window.addEventListener('load', init);

function init(){
  // webcam init
  video_input = document.getElementById('inputVideo');
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if(navigator.getUserMedia){
    navigator.gerUserMedia({
      video: true
    },
    video_get, video_error);
  }


  clm_tracker = new clm.tracker();
  clm_tracker.init();
  clm_tracker.start(video_input);
}

function video_get( stream ){
  video_input = window.URL.createObjectURL( stream );
}
