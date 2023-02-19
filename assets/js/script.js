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
    var geoLocApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + myQuery + "&appid=9d4fb4c74de16fa19880e1c4a2624574";
    
    fetch(geoLocApiUrl)
    .then(response => response.json())
    .then(data => {
        //Using template literals to get the lat and long from the first api and put it into the query for the second one to shorten code.
        const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=547e9f1acf0072a10884f73875106239`;
        return fetch(weatherApiUrl);
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        /* I need CityName, date(y/m/d  format), 
        icon representation of weather condition,
        temperature, humidity, wind speed
        */

    })
    .catch(error => console.log(error));
}

submitEl.addEventListener("submit", submitHandler);