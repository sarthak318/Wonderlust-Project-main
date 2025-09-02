/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
// async function temp(){
// var properties = placeCoordinates.split(', ');
// var obj = {};
// properties.forEach(function(property) {
//     var tup = property.split(':');
//     obj[tup[0]] = tup[1];
// });
// placeCoordinates=obj;

// }
// temp();
function addMarkerToGroup(group, coordinate, html) {
    var marker = new H.map.Marker(coordinate);
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
  }
  
  
  function addInfoBubble(map) {
    var group = new H.map.Group();
  
    map.addObject(group);
  
    // add 'tap' event listener, that opens info bubble, to the group
    group.addEventListener('tap', function (evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        // read custom data
        content: evt.target.getData()
      });
      // show info bubble
      ui.addBubble(bubble);
    }, false);
  
    addMarkerToGroup(group, {lat:placeCoordinates.coordinates[0], lng:placeCoordinates.coordinates[1]},
      '<div><p>Exact location will be provided after Pre-Booking</p></div>');
  
  }
   
   
  function moveMapToCity(map){
    map.setCenter({lat:placeCoordinates.coordinates[0], lng:placeCoordinates.coordinates[1]});
    map.setZoom(9);
      /* var parisMarker = new H.map.Marker({lat:28.7041, lng:77.1025});
      map.addObject(parisMarker); */
  }
  
  /**
   * Boilerplate map initialization code starts below:
   */
  
  //Step 1: initialize communication with the platform
  // In your own code, replace variable window.apikey with your own apikey
  var platform = new H.service.Platform({
    apikey: mapToken
  });
  var defaultLayers = platform.createDefaultLayers();
  
  //Step 2: initialize a map - this map is centered over Europe
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map,{
    center: {lat:placeCoordinates.coordinates[0], lng:placeCoordinates.coordinates[1]},
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1
  });
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Now use the map as required...
  window.onload = function () {
    moveMapToCity(map);
    addInfoBubble(map);
  }