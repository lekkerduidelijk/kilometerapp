/**
 * Mileageapp
 * Calculate distance, handle output and show log messages
 *
 * by Rutger Laurman
 */

/* Document ready */
jQuery(document).ready(function($){
  return MileageApp.init();
});


var MileageApp = {

  // Variables
  directionsService: "",
  directionsDisplay: "",
  mapLat: "52.412472",
  mapLon: "5.487671",
  mapzoom: 7,
  initialID: 1,

  init: function(){

    console.log("init");

    // Setup Google Maps
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    var netherlands = new google.maps.LatLng(this.mapLat, this.mapLon);
    var mapOptions = {
      zoom: this.mapzoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: netherlands
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.directionsDisplay.setMap(map);

    // Set button events
    this.setEvents();


  },

  /**
   * Set click event on button
   */
  setEvents: function(){

    console.log("setEvents");

    // Link button
    $("#calc").click(function(){

      // Set variables and fetch field data
      var $this = $(this),
        from = $("#addr_from").val(),
        to   = $("#addr_to").val();
      $this.preventDefault;

      // Calculate distance between input fields
      MileageApp.calculateDistance(from,to);

    });

  },

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
  calculateDistance: function(from, to) {

    console.log("calculateDistance");

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
      this.logOutput("No input");

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
        MileageApp.handleOutput(jsondata);
      });
    }

  },

  /**
   * Draw route on map with google.maps
   *
   */
  drawRoute: function(start,end){
    var directionDisplay = this.directionsDisplay;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    this.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionDisplay.setDirections(response);
      }
    });
  },

  /**
   * Handle output from JSON string
   *
   * @param   String    data    JSON data string from Google Maps Distance API
   * @return  Void
   *
   * @todo: Do some saving etc
   *
   */
  handleOutput: function(data) {

    console.log("handleOutput");

    if(data=="") return;

    // Set variables from data objects
    var dest, origin, distance, duration, status, dataObject, ID;
    dest      = data.destination_addresses[0];
    origin    = data.origin_addresses[0];
    distance  = data.rows[0].elements[0].distance;
    duration  = data.rows[0].elements[0].duration;
    status    = data.rows[0].elements[0].status;



    // Write to log output
    this.logOutput("Origin: "+origin);
    this.logOutput("Destination: "+dest);
    this.logOutput("Status: "+status);
    this.logOutput("Distance: "+distance.text);
    this.logOutput("Duration: "+duration.text);
    this.logOutput("---");

    // If Google maps returns correct address information
    if(status == "OK") {

      // Increase ID of route
      ID = this.initialID++;

      // Draw route on map
      this.drawRoute(origin,dest);

      // Prepare data object for table output
      dataObject = {
        rowId: ID,
        origin: origin,
        dest: dest,
        distance: distance.text,
        duration: duration.text
      };

      // Add row to table
      this.addRow(dataObject);
    } else {
      this.logOutput("No route to draw");
    }





  },

  /**
   * Add data row to table
   *
   * @param   Object  rowData  Object with data for row to add
   */
  addRow: function(rowData){

    console.log("addRow");

    var htmloutput = "";

    for(var row in rowData) {
      if (rowData.hasOwnProperty(row)) {
        htmloutput+= "<td>" + rowData[row] + "</td>";
      }
    }

    $("#resultrows").append(
      "<tr>" + htmloutput + "</tr>"
    );
  },

  /**
   * Output log to screen - used for debugging
   *
   * @param   String    data    Output to write to logger
   * @return  Void
   */
  logOutput: function(data){

    console.log("logOutput");

    if(data=="") return;

    var currentTime = +new Date;

    // Write log to results element
    $("#debug").append(currentTime + " : " + data + "<br>");
  }


};



