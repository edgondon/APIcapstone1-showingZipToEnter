'use strict';

function checkValue(inputValue) {
  let outputValue = inputValue;
  if (inputValue == "") {
      outputValue = 0;
  }
  if (inputValue == undefined) {
      outputValue = 0;
  }
  if (inputValue == null) {
      outputValue = 0;
  }
  return outputValue;
}

function checkText(inputText) {
  let outputText = inputText;
  if (inputText == undefined) {
      outputText = "";
  }
  if (inputText == null) {
      outputText = "";
  }
  return outputText;
}

function checkURL(inputURL) {
  let outputURL = inputURL;
  if (inputURL == undefined) {
      outputURL = "/";
  }
  if (inputURL == null) {
      outputURL = "/";
  }
  return outputURL;
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
        handleLocationError();
    }
}


let longlat = [];
let addressGo = [];

function showEvents(json) {
  let nums = Math.min(json.page.size, json.page.totalElements);
  for(var i=0; i<nums; i++) {
    let output = [];
    if(json._embedded.events[i]._embedded.venues[0].country.countryCode === "US") {
      output = json._embedded.events[i]._embedded.venues[0].state.stateCode;
      $("#events").append(`<li><b>${checkText(json._embedded.events[i].name)}</b>
          <p><i>Venue:</i> ${checkText(json._embedded.events[i]._embedded.venues[0].name)}</p>
          <p><i>Date of Event:</i> ${checkText(json._embedded.events[i].dates.start.localDate)}</p>
          <p><i>Distance in Miles:</i> ${checkValue(json._embedded.events[i].distance)}</p>
          <p><i>Address:</i> ${checkText(json._embedded.events[i]._embedded.venues[0].address.line1)}, ${checkText(json._embedded.events[i]._embedded.venues[0].city.name)}, ${checkText(output)}, ${checkValue(json._embedded.events[i]._embedded.venues[0].postalCode)}</p>
          <form id="form2">
          <input type="radio" id="start" class="helper" aria-controls="right-panel map" name="startaddress" value="${checkText(json._embedded.events[i]._embedded.venues[0].address.line1)}, ${checkText(json._embedded.events[i]._embedded.venues[0].city.name)}, ${checkText(json._embedded.events[i]._embedded.venues[0].state.stateCode)}, ${checkValue(json._embedded.events[i]._embedded.venues[0].postalCode)}">Get Directions</input>
          <button type="button" for="startaddress" onclick="displayRadioValue()"> 
              Submit 
          </button> 
          </form>
          <div class="blunk">
          <a class="blink" href="${checkURL(json._embedded.events[i].url)}" target="_blank">Get Tickets</a>
          </div>
          </li>
          `);
    }
    else {
      output.push(`${json._embedded.events[i]._embedded.venues[0].location.latitude},${json._embedded.events[i]._embedded.venues[0].location.longitude}`);
      $("#events").append(`<li><b>${checkText(json._embedded.events[i].name)}</b>
      <p><u>Venue:</u> ${checkText(json._embedded.events[i]._embedded.venues[0].name)}</p>
          <p><i>Date of Event:</i> ${checkText(json._embedded.events[i].dates.start.localDate)}</p>
          <p><i>Distance in Miles:</i> ${checkValue(json._embedded.events[i].distance)}</p>
          <p><i>Address:</i> ${checkText(json._embedded.events[i]._embedded.venues[0].address.line1)}, ${checkText(json._embedded.events[i]._embedded.venues[0].city.name)}, ${checkValue(json._embedded.events[i]._embedded.venues[0].postalCode)}</p>
          <form id="form2">
          <input type="radio" id="start" class="helper" aria-controls="right-panel map" name="startaddress" value="${checkText(json._embedded.events[i]._embedded.venues[0].address.line1)}, ${checkText(json._embedded.events[i]._embedded.venues[0].city.name)}, ${checkValue(json._embedded.events[i]._embedded.venues[0].postalCode)}">Get Directions</input>
          <button type="button" for="startaddress" onclick="displayRadioValue()"> 
              Submit 
          </button> 
          </form>
          <div class="blunk">
          <a id="blink" href="${checkURL(json._embedded.events[i].url)}" target="_blank">Get Tickets</a>
          </div>
          </li>
          `);
        }
    
    
  }
}




function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


// establish date range for search criteria - upon initial load of page (default values)
  function datesinConsole() {
    let now = new Date();
    let month = (now.getMonth() + 1);               
    let day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    let today = now.getFullYear() + '-' + month + '-' + day;

    let month2 = (now.getMonth() + 2);
    let today2 = now.getFullYear() + '-' + month2 + '-' + day;


$('#form1').append(`
<fieldset id="fline1">
<div>
<label class="lab1" for="radiuss">Radius of Search in Miles</label>
<input type="number" id="radiuss" name="Radius" min="1" max="100" value="25" required>
</div>
<div>
<label class="lab1" for="alpha">Begin Event Date</label>
<input type="date" id="alpha" name="State" value="${today}" required>
</div>
<div>
<label class="lab1" for="omega">End Event Date</label>
<input type="date" id="omega" name="numSearch" value="${today2}">
</div>
</fieldset>
<div id="fline2">
<input type="submit" aria-controls="events" class="button1" value="Submit Request">
</div>`);

  
};


function infosubmit (alpha, omega, radiuss) {
    
    
     $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&latlong=${longlat[0].lat},${longlat[0].lng}&unit=miles&radius=${radiuss}&startDateTime=${alpha}T08:00:00Z&endDateTime=${omega}T07:59:00Z&size=190`,
        async:true,
        dataType: "json",
        success: function(json) {
                    let e = document.getElementById("events");
                    e.innerHTML = json.page.totalElements + " events found.";
                    showEvents(json);
                    
                 },
        error: function(xhr, status, err) {
                 }
      }); 



}

function initMap2() {
    
    let directionsRenderer = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('right-panel'));


    if (document.getElementById('floating-panel')==null) {

    let control = document.getElementById('floating-panel');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
    else {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    }  

  }

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    let start = `${longlat[0].lat},${longlat[0].lng}`;
    let end = `${addressGo}`;
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

// the function is ran each time the get directions button is pressed.

function displayRadioValue() { 
  $('#right-panel').removeClass('hidden');  
  addressGo.length = 0;
    $('#right-panel').empty();
    let ele = $('.helper:checked').val(); 
    addressGo.push(ele);    
    initMap2();
    $('.helper:checked').prop('checked', false);
    } 






function Locaz() {
  Geolocation.getCurrentPosition();


  $('#form1').AddClass('hidden');
  $('#formZip').append(`
  <fieldset id="fline1">
  <div>
  <label class="lab1" for="addrez">Enter Current Address</label>
  <input type="text" id="addrez" name="Address" value="41680 Nordal, Hemet, CA" required>
  </div>
  `);



}







function watchEnter() {
    datesinConsole();
    $('#form1').submit(event => {
        event.preventDefault();
        $('#right-panel').addClass('hidden');
        $('#right-panel').empty();
        $('.results').empty();
        $('#events').empty();
// each time user submits form on top of page the three values below are reset accordingly:
        let alpha = $('#alpha').val();
        let omega = $('#omega').val();
        let radiuss = $('#radiuss').val();
        addressGo.length = 0;
        
        
        $('#map').removeClass('hidden');
        $('#events').removeClass('hidden');
        
        infosubmit(alpha, omega, radiuss);
        
        
    });

}

$(watchEnter);