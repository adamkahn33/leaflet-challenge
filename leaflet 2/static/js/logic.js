
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
})

var baseMaps = {
  'Dark base map': dark,
  'Light base map': light,
  'Street base map': streets
};


var earthquakesLayer = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();

var overlayMaps = {
  'Earthquakes': earthquakesLayer,
  'Tectonic Plates': tectonicplates
};

var myMap = L.map("map", {
  center: [5, -10],
  zoom: 2,
  layers: [light]
});

L.control.layers(baseMaps, overlayMaps).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(url).then(response => {


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

d3.json(tectonicUrl).then(tecplatedata => {
    
  L.geoJson(tecplatedata, {
    color: "orange",
    weight: 1
  })
  .addTo(tectonicplates);

  tectonicplates.addTo(myMap);
  
});

function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: 2*feature.properties.mag,
    stroke: true,
    weight: 0.5
  };
}

L.geoJson(response, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },
  style: styleInfo,
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      "Location: "
        + feature.properties.place
        +"<br>Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
    );
  }
}).addTo(earthquakesLayer);

earthquakesLayer.addTo(myMap);

});

