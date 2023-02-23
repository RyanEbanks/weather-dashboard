var submitEl = document.querySelector(".myForm");
var inputEl = document.querySelector("#submitInput");
var cityEl = document.querySelector(".city-info");
var tempEl = document.querySelector(".temp-info");
var windEl = document.querySelector(".wind-info");
var windTitleEl = document.querySelector(".wind-info-title");
var humidEl = document.querySelector(".humid-info");
var humidTitleEl = document.querySelector(".humid-info-title");
var futureEl = document.querySelector(".dashboard-future-container");
var historyEl = document.querySelector(".history-container");
var dateEl = document.querySelector(".date-info");
var descripEl = document.querySelector(".description-info");
var iconEl = document.querySelector(".icon-info");


var submitHandler= function(event) {
    event.preventDefault();
    /*Gets rid of the white spaces before and after the value*/
    var cityInfo = inputEl.value.trim();

    if(cityInfo){
        cityQuery(cityInfo);
        addHistory(cityInfo);
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
    var newCurrentDate = dayjs(JSON.stringify(currentDate)).format("MMMM D, YYYY");
    console.log("Current date: " + newCurrentDate);
    /*The icon gets provided in weather, you can take that and apply it*/
       cityEl.textContent = data.city.name;
       dateEl.textContent = newCurrentDate;
       iconEl.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
       iconEl.alt = "Weather Icon";
       descripEl.textContent = data.list[0].weather[0].description;
       tempEl.textContent = data.list[0].main.temp + "°F";
       windEl.textContent = data.list[0].wind.speed + "mp/h";
       windTitleEl.textContent = "Wind";
       humidEl.textContent = data.list[0].main.humidity + "%";
       humidTitleEl.textContent = "Humidity";


       var futureWeather = "";
       for(var i = 0; i <= data.list.length; i++) {
           /*Grabbing the time from the dt_txt response*/
           var grabDate = data.list[i].dt_txt.substr(11,8);
        //    console.log("New Date: " + grabDate);
        var futureDate = data.list[i].dt_txt.substr(0,11);
        var newFutureDate = dayjs(JSON.stringify(futureDate)).format("MMMM D, YYYY");
           if(grabDate === "00:00:00") {
            //Testing to see if it would all lists with 12am
            console.log(`Temp for different days ${i}: ` + data.list[i].main.temp);
            //    futureWeather += `
            //    <div class="dashboard-future">
            //     <h1 class="future-city-info">${newFutureDate}</h1>
            //     <p class="future-temp-info">${data.list[i].main.temp}</p>
            //     <p class="future-wind-info">${data.list[i].wind.speed}</p>
            //     <p class="future-humid-info">${data.list[i].main.humidity}</p>
            //     </div>
            // `

            futureWeather += `
            <div class="flex flex-col bg-white rounded p-4 w-full max-w-xs dashboard-future">
                                    <div class="font-bold text-xl">${newFutureDate}</div>
                                    <img class="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg h-24 w-24"
                                       src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="Weather Icon"
                                    >
                                    <div class="flex flex-row items-center justify-center mt-6">
                                        <div class="font-medium text-6xl">${data.list[i].main.temp}°F</div>
                                        <div class="flex flex-col items-center ml-6">
                                            <div>${data.list[i].weather[0].description}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-row justify-between mt-6">
                                        <div class="flex flex-col items-center">
                                            <div class="font-medium text-sm">Wind</div>
                                            <div class="text-sm text-gray-500">${data.list[i].wind.speed}mp/h</div>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <div class="font-medium text-sm">Humidity</div>
                                            <div class="text-sm text-gray-500">${data.list[i].main.humidity}%</div>
                                        </div>
                                    </div>
                                </div>
            `
            futureEl.innerHTML = futureWeather;
           }

       }
    })
    .catch(error => console.log(error));
}

/*These are being declared as global variables so that they don't get overwritten when the 
function is ran*/
var myCityHistory = "";

function addHistory(myStorage) {
    //Adds 10 values to history differentiated by the number at the end of the name
    var cityHistoryNum = localStorage.getItem("CurrentIndexLoc");
    if(cityHistoryNum == null) {
        cityHistoryNum = 1;
    } else {
        cityHistoryNum = parseInt(cityHistoryNum) + 1;
    }
    console.log(cityHistoryNum);
    if(cityHistoryNum <= 11) {
        localStorage.setItem(`city-history-${cityHistoryNum}`, myStorage);
        localStorage.setItem("CurrentIndexLoc", cityHistoryNum);
        myCityHistory += `
        <div class="history-info">
        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded city-history history-btn-size">
        ${myStorage}
        </button>
        </div>
        `;
        //Appends to html
        historyEl.innerHTML= myCityHistory;
        //This iterates the value, so it will always be 1 ahead of what is needed
        cityHistoryNum += 1;
        console.log("history number: " + cityHistoryNum);
    } if(cityHistoryNum == 12) {
        //If we hit 12 it will rewrite number 1
        localStorage.clear();
        cityHistoryNum = 1;
        localStorage.setItem("CurrentIndexLoc", cityHistoryNum);
        localStorage.setItem(`city-history-${cityHistoryNum}`, myStorage);
    }
    
    showHistory();
    return;
}

var cityButton = [];

function showHistory() {
    var displayHistory = "";
    for(var i = 1; i <= 10; i++) {
        var newMyCityHistory = localStorage.getItem(`city-history-${i}`);
        if(newMyCityHistory !== null) {
            localStorage.setItem("CurrentIndexLoc", i);
            displayHistory += `
            <div class="history-info">
            <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded city-history-${i} history-btn-size">
            ${newMyCityHistory}
            </button>
            </div>
            `;
        }
    }
    console.log(displayHistory);
    historyEl.innerHTML = displayHistory;
    //Using let instead of var to create a new instance of j so that the correct button is referenced
    for(let j = 1; j <= 10; j++) {
        cityButton[j] = document.querySelector(`.city-history-${j}`);
        
        if(cityButton[j]) {
            cityButton[j].addEventListener("click", function(val) {
                // console.log("Button Clicked!");
                var grabButtonText = cityButton[j].innerHTML;
                console.log(grabButtonText);
                inputEl.value = grabButtonText;
                submitHandler(val);

            });
        }
    }
}

function checkHistory() {

}

window.addEventListener("load", showHistory);
submitEl.addEventListener("submit", submitHandler);