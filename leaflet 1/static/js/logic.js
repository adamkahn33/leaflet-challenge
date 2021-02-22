var myMap = L.map("map", {
  center: [5, -10],
  zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";



d3.json(url).then(response => {

  var markers = L.markerClusterGroup();

  function getColor(d) {
    switch (true){
    case d >= 90:
      return 'red' ;
    case d >= 70:
      return '#ff6666' ;
    case d >= 50:
      return 'orange' ;
    case d >= 30:
      return 'yellow' ; 
    case d >= 10:
      return '#CCFF00' ; 
    case d >= -10:
      return 'green' ;
    default:
      return '#FFFFFF';
  }
}


  for (var i = 0; i < response.features.length; i++) {
    //console.log(response.features[i].geometry);  
    var location = response.features[i].geometry;
    //var placeinfo = response.features[i].properties.place
    var depth = location.coordinates[2]
    var magnitude = response.features[i].properties.mag
    if (location) {

      markers.addLayer(L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        radius: 3*magnitude,
        fillColor: getColor(depth),
        color: getColor(depth),
        fillOpacity: 1
      })
        .bindPopup("PlaceInfo: " + response.features[i].properties.place + "<br>Magnitude: " + response.features[i].properties.mag + "<br>Depth: " + location.coordinates[2]));
    }

  }
  myMap.addLayer(markers);
  });
