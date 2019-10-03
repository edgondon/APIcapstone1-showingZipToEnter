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
            longlat.push(pos);    
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


let longlat = [];

function showEvents(json) {
    for(var i=0; i<json.page.size; i++) {
      $("#events").append(`<p>${json._embedded.events[i].name}</p>
            <p>Date of Event: ${json._embedded.events[i].dates.start.localDate}</p>
            <p>Distance in Miles: ${json._embedded.events[i].distance}</p>
            <a href="${json._embedded.events[i].url}" target="_blank">Link for Tickets and More</a>
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


  function datesinConsole() {
    let now = new Date();
    let month = (now.getMonth() + 1);               
    let day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    let today = now.getFullYear() + '-' + month + '-' + day;
    console.log(today);

    let month2 = (now.getMonth() + 2);
    let today2 = now.getFullYear() + '-' + month2 + '-' + day;
    console.log(today2);


$("form").append(`
<label for="Radius">Enter Radius of Search in Miles</label>
<input type="number" id="radiuss" name="Radius" min="1" max="100" value="25" required>
<label for="State">FIRST DATE IN RANGE YYYY-MM-DD</label>
<input type="date" id="alpha" name="State" value="${today}" required>
<label for="numSearch">SECOND DATE IN RANGE YYYY-MM-DD</label>
<input type="date" id="omega" name="numSearch" value="${today2}">
<input type="submit"  value="Submit Request">`);

  
};


function infosubmit (alpha, omega, radiuss) {
    
    console.log(longlat);
    console.log(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&latlong=${longlat[0].lat},${longlat[0].lng}&unit=miles&radius=${radiuss}&startDateTime=${alpha}T08:00:00Z&endDateTime=${omega}T07:59:00Z&size=190`);
     $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&latlong=${longlat[0].lat},${longlat[0].lng}&unit=miles&radius=${radiuss}&startDateTime=${alpha}T08:00:00Z&endDateTime=${omega}T07:59:00Z&size=190`,
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
    datesinConsole();
    $('form').submit(event => {
        event.preventDefault();
        $('#errod').empty();
        $('.results').empty();
        let alpha = $('#alpha').val();
        let omega = $('#omega').val();
        let radiuss = $('#radiuss').val();

        
        
        $('#map').removeClass('hidden');
        $('#events').removeClass('hidden');
        infosubmit(alpha, omega, radiuss);
        console.log('hello');
        
    });
}

$(watchEnter);