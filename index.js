'use strict';

const apiKey = 'BQl4kqXRIHiCHp1f1H7kn311pvWMbh11cByBz2nZ';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getParkStatesList(query, maxResults = 10) {
    const params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })

        .then(responseJson => consoleResponse(responseJson))
        .catch(err => {
            $('#errod').append(`Something went wrong: ${err.message}`);
        });

}


function consoleResponse(responseJson) {

    console.log("huh?");
    console.log(responseJson);




    for (let i = 0; i < responseJson.data.length; i++) {

        $(".results").append(
            `<li><p>${responseJson.data[i].fullName}</p>
       <p>${responseJson.data[i].description}</p>
        <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></h3>
        </li>`
        )
    };


}


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
      $("#events").append("<p>"+json._embedded.events[i].name+"</p>");
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

function geoClouder(t) {
    console.log(t);
    let ll = `${t.lat},${t.long}`;

    $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&${ll}`,
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
        const searchTerm = $('#myForm').val();
        const maxResults = $('#numblum').val();
        getParkStatesList(searchTerm, maxResults);
    });
}

$(watchEnter);