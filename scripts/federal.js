// Initialize the map
var map = L.map('map').setView([-25.2744, 133.7751], 5);

//MPs layer
var mps = L.layerGroup();
//Senators layer
var senators = L.layerGroup();

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Custom control for the map title
var titleControl = L.control({ position: 'topleft' });

titleControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = '<h1 style="color: blue; text-align: center; margin: 0;">MPs and Senators for Palestine</h1>';
    return div;
};

titleControl.addTo(map);

//Mobile
map.locate({ setView: true, maxZoom: 5 });

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are here ").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    L.marker([-33.865143, 151.209900]).addTo(map)
        .bindPopup("Default Location ").openPopup();
}

map.on('locationerror', onLocationError);

// Define a custom marker icon with a watermelon image
var watermelonIcon = L.icon({
    iconUrl: 'images/watermelon-icon.png', // URL to the watermelon image file
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Point of the icon which corresponds to marker's location
    popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
});

// Define a custom marker icon with a watermelon image
var pinIcon = L.icon({
    iconUrl: 'images/pin.png', // URL to the watermelon image file
    iconSize: [20, 20], // Size of the icon
    iconAnchor: [20, 40], // Point of the icon which corresponds to marker's location
    popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
});

// Parse CSV data and add markers to the map
//Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vR1_69lZekJC45D2YJUOfLNwf0To7PMKm6aPNqqZkkkV4_wbtSqOChVDR9ZLe0yLZRWy1qd8mZ5f9HR/pub?output=csv", {
Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vR1_69lZekJC45D2YJUOfLNwf0To7PMKm6aPNqqZkkkV4_wbtSqOChVDR9ZLe0yLZRWy1qd8mZ5f9HR/pub?gid=1833372983&single=true&output=csv", {
download: true,
    header: true,
    complete: function (results) {
        results.data.forEach(function (row) {
            // Extract latitude and longitude from the row
            var latitude = parseFloat(row.Latitude);
            var longitude = parseFloat(row.Longitude);
            if (row.Voted == 'Yes') {
                // Create a marker with a popup showing MP's information
                mps.addLayer(L.marker([latitude, longitude], { icon: watermelonIcon })
                    .bindPopup('<b>' +  row['Surname'] + ', ' + row['First Name'] + '</b><br>' +
                        'Electorate: ' + row['Electorate'] + '<br>' +
                        'Political Party: ' + row['Political Party']));
            } else {
                // Create a marker with a popup showing MP's information
                mps.addLayer(L.marker([latitude, longitude], { icon: pinIcon })
                    .bindPopup('<b>'+ row['Surname'] + ', ' + row['First Name'] + '</b><br>' +
                        'Electorate: ' + row['Electorate'] + '<br>' +
                        'Political Party: ' + row['Political Party']));
            }
        });
    }
});

// Parse CSV data and add markers to the map
Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vR1_69lZekJC45D2YJUOfLNwf0To7PMKm6aPNqqZkkkV4_wbtSqOChVDR9ZLe0yLZRWy1qd8mZ5f9HR/pub?gid=278551651&single=true&output=csv", {
    download: true,
    header: true,
    complete: function (results) {
        results.data.forEach(function (row) {
            // Extract latitude and longitude from the row
            var latitude = parseFloat(row.Latitude);
            var longitude = parseFloat(row.Longitude);
            if (row.Voted == 'Yes') {
                // Create a marker with a popup showing MP's information
                senators.addLayer(L.marker([latitude, longitude], { icon: watermelonIcon })
                    .bindPopup('<b>' + row['Surname'] + ', ' + row['First Name'] + '</b><br>' +
                        'Electorate Suburb: ' + row['Electorate Suburb'] + '<br>' +
                        'Political Party: ' + row['Political Party']));
            } else {
                // Create a marker with a popup showing MP's information
                senators.addLayer(L.marker([latitude, longitude], { icon: pinIcon })
                    .bindPopup('<b>' +  row['Surname'] + ', ' + row['First Name'] + '</b><br>' +
                        'Electorate Suburb: ' + row['Electorate Suburb'] + '<br>' +
                        'Political Party: ' + row['Political Party']));
            }
        });
    }
});

        // Add MPs layer to the map by default
        mps.addTo(map);
        senators.addTo(map);


//create MPs overlay layer
var overlayMaps = {
    "MPs": mps,
    "Senators" : senators
};

//add overlay layer
var layerControl = L.control.layers(null, overlayMaps).addTo(map);

