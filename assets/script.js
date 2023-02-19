var submitEl = document.querySelector(".myForm");
var inputEl = document.querySelector("#submitInput");

var submitHandler= function(event) {
    event.preventDefault();
    /*Gets rid of the white spaces before and after the value*/
    var cityInfo = inputEl.value.trim();

    if(cityInfo){
        cityQuery(cityInfo);
    } else {
        /*Probably Change this later*/
        alert("Not a valid input please try again!")
    }
}

function cityQuery(myQuery) {
    var geoLocApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + myQuery + "&appid=9d4fb4c74de16fa19880e1c4a2624574"
    
    fetch(geoLocApi)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log("The Data:" + data);
                if(data.url === 0) {
                    /*Change this to Display on Screen when ready*/
                    console.log("Error!");
                }
                cityOutput(data);
            });
        }
    });
}


function cityOutput(displayData) {
/*Things we might need from the geocoding api:
1. Name
2. State
3. Country
*/
    var lat = displayData.lat;
    var long = displayData.long;

}

submitEl.addEventListener("submit", submitHandler);