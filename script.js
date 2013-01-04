/**
 * Mileageapp
 * Calculate distance, handle output and show log messages
 *
 * by Rutger Laurman
 */

/* Document ready */
jQuery(document).ready(function($){

  // Link button
  $("#calc").live("click",function(){

    // Set variables and fetch field data
    var $this = $(this),
      from = $("#addr_from").val(),
      to   = $("#addr_to").val();
    $this.preventDefault;

    // Calculate distance between input fields
    calcdistance(from,to);

  })
});


/**
 * Calculate distance between two entries (cities)
 *
 * @param   String    from   Origin city from input field
 * @param   String    to     Destination city from input field
 * @return  Void
 *
 * @todo: Build more checks in AJAX call
 * @todo: Hook output to save method
 */

var calcdistance = function calcdistance(from,to){

  // Set variables
  var apiurl        = "http://maps.googleapis.com/maps/api/distancematrix/json?",
      apimode       = "apimode=car",
      apilanguage   = "language=nl-NL",
      apisensor     = "sensor=false",
      apiorigins,
      apidestinations,
      origins       = from,
      destinations  = to;

  // Check for input
  if(origins == "" || destinations == ""){

    // Show message
    logoutput("No input");

  } else {

    // Build origins and destinations url parts
    apiorigins      = "origins=" + origins;
    apidestinations = "destinations=" + destinations;

    // Get URL with AJAX
    $.ajax({
      url: apiurl
           + apiorigins + "&"
           + apidestinations + "&"
           + apimode + "&"
           + apilanguage + "&"
           + apisensor,
      cache: false
    }).done(function( jsondata ) {

      // Return output
      handleoutput(jsondata);
    });
  }
};

/**
 * Handle output from JSON string
 *
 * @param   String    data    JSON data string from Google Maps Distance API
 * @return  Void
 *
 * @todo: Do some saving etc
 *
 */
var handleoutput = function handleoutput(data){
  if(data=="") return;

  // Set variables from data objects
  var dest, origin, distance, duration, status;
  dest      = data.destination_addresses[0];
  origin    = data.origin_addresses[0];
  distance  = data.rows[0].elements[0].distance;
  duration  = data.rows[0].elements[0].duration;
  status    = data.rows[0].elements[0].status;

  // Write to log output
  logoutput("Origin: "+origin);
  logoutput("Destination: "+dest);
  logoutput("Status: "+status);
  logoutput("Distance: "+distance.text);
  logoutput("Duration: "+duration.text);
  logoutput("---");


};

/**
 * Output log to screen - used for debugging
 *
 * @param   String    data    Output to write to logger
 * @return  Void
 */
var logoutput = function logoutput(data){
  if(data=="") return;

  // Write log to results element
  $("#results").append(data+"<br>");
};

