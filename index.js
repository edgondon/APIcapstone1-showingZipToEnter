'use strict';



function initMap(json) {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10
    });
    let infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            geoClouder(pos);    
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function showEvents(json) {
    for(var i=0; i<json.page.size; i++) {
      $("#events").append(`<p>${json._embedded.events[i].name}</p>
            <p>Date of Event: ${json._embedded.events[i].dates.start.localDate}</p>
            <p>Distance in Miles: ${json._embedded.events[i].distance}</p>
            <a href="${json._embedded.events[i].url}">Link for Tickets and More</a>
            `);
      
    }
  }


  function addMarker(map, event) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
      map: map
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    console.log(marker);
  }




function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
// geoClouder(t) pulls geocodes from google initmaps(json) function
function geoClouder(t) {
    console.log(t);
    let ll = `${t.lat},${t.lng}`;

    $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&latlong=${ll}&unit=miles&radius=25`,
        async:true,
        dataType: "json",
        success: function(json) {
                    console.log(json);
                    let e = document.getElementById("events");
                    e.innerHTML = json.page.totalElements + " events found.";
                    showEvents(json);
                    initMap(position, json);
                 },
        error: function(xhr, status, err) {
                    console.log(err);
                 }
      });
  
  }





function watchEnter() {
    initMap();
    $('form').submit(event => {
        event.preventDefault();
        $('#errod').empty();
        $('.results').empty();

    });
}

$(watchEnter);