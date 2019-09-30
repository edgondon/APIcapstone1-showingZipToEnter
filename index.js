'use strict';

const apiKey = 'BQl4kqXRIHiCHp1f1H7kn311pvWMbh11cByBz2nZ';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getParkStatesList(query, maxResults=10) {
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




function watchEnter() {
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