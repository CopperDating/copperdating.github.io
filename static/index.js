var start_button_div = document.getElementById("start_button_div");
start_button_div.style.display = "none";
// Set the date we're counting down to
var countDownDate = new Date("Nov 29, 2020 20:00:00 GMT+01:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="event_start_countdown"
  document.getElementById("event_start_countdown").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    before_event.style.display = "none";
    start_button_div.style.display = "block";
  }
  if(minutes < 30){
    reg_event.style.display = "none";
  }
}, 1000);
