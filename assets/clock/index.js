// Set the date we're counting down to
var countDownDate = new Date("May 20, 2022 15:37:25").getTime();

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
    
  // Output the result in an element with id="demo"
  document.getElementById("clock-c").innerHTML = ''
  + '<span class="h1 font-weight-bold">' + days + '</span> Days '
  + '<span class="h1 font-weight-bold">' + hours + '</span> Hours '
  + '<span class="h1 font-weight-bold">' + minutes + '</span> Minutes '
  + '<span class="h1 font-weight-bold">' + seconds + '</span> Seconds '
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);