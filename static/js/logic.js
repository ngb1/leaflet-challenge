function createMap(dayEarthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the dayEarthquakes layer
    var overlayMaps = {
      "All Earthquakes in the Past 24 hours": dayEarthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [19.8968, -155.5828],
      zoom: 4,
      layers: [lightmap, dayEarthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
    console.log('response', response);
    // Pull the "stations" property off of response.data
    let features = response.features;
    console.log('geometry', features);
  
    // Initialize an array to hold bike markers
    let earthquakeMarkers = [];
  
    // Loop through the stations array
    //for (var index = 0; index < stations.length; index++) {
    //  var station = stations[index];
    features.forEach(feature => {
  
      // For each station, create a marker and bind a popup with the station's name
    //   var earthquakeMarker = L.marker([ feature.geometry.coordinates[1] , [feature.geometry.coordinates[0] ] );
        var earthquakeMarker = L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            weight: 0.5,
            color: "white",
            fillColor: "orange",
            radius: feature.properties.mag * 30000
        }).bindPopup("<h3>Magnitude" + feature.properties.mag + "<h3><h3>Location: " + feature.properties.place + "<h3>");
      // Add the marker to the bikeMarkers array
      earthquakeMarkers.push(earthquakeMarker);
    });
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
  