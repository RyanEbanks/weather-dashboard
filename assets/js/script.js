var submitEl = document.querySelector(".myForm");
var inputEl = document.querySelector("#submitInput");
var cityEl = document.querySelector(".city-info");
var tempEl = document.querySelector(".temp-info");
var windEl = document.querySelector(".wind-info");
var humidEl = document.querySelector(".humid-info");
var futureEl = document.querySelector(".dashboard-future-container");

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
        const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=547e9f1acf0072a10884f73875106239&units=imperial`;
        return fetch(weatherApiUrl);
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        /* I need CityName, date(y/m/d  format), 
        icon representation of weather condition,
        temperature, humidity, wind speed
        */
        console.log("City Name: " + data.city.name);
        console.log("Weather Condition: " + data.list[0].weather[0].main);
        //Displayed in Imperial
        console.log("Temperature: " + data.list[0].main.temp);
        //Displayed in mph
        console.log("Wind Speed: " + data.list[0].wind.speed);
        //Humidity is a percentage
        console.log("Humidity: " + data.list[0].main.humidity);
    
    //Taking the first 11 values from the dt_txt string
    var currentDate = data.list[0].dt_txt.substr(0,11);
    //Changing the format to match imperial date system
    var newCurrentDate = dayjs(JSON.stringify(currentDate)).format("MM/DD/YYYY");
    console.log("Current date: " + newCurrentDate);
       cityEl.textContent = data.city.name + " " + newCurrentDate;
       tempEl.textContent = data.list[0].main.temp + "F";
       windEl.textContent = data.list[0].wind.speed + "mp/h";
       humidEl.textContent = data.list[0].main.humidity + "%";


       var futureWeather = "";
       for(var i = 0; i <= data.list.length; i++) {
           /*Grabbing the time from the dt_txt response*/
           var grabDate = data.list[i].dt_txt.substr(11,8);
        //    console.log("New Date: " + grabDate);
           if(grabDate === "00:00:00") {
            //Testing to see if it would all lists with 12am
            console.log(`Temp for different days ${i}: ` + data.list[i].main.temp);
               futureWeather += `
               <div class="dashboard-future">
                <h1 class="future-city-info">${newCurrentDate}</h1>
                <p class="future-temp-info">${data.list[i].main.temp}</p>
                <p class="future-wind-info">${data.list[i].wind.speed}</p>
                <p class="future-humid-info">${data.list[i].main.humidity}</p>
                </div>
            `
            futureEl.innerHTML = futureWeather;
           }

       }
    })
    .catch(error => console.log(error));
}

submitEl.addEventListener("submit", submitHandler);