// for more pure js
"use strict";

// !=================> Global Variables  <=================  //

const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");
const landing = document.getElementById("landing");
const forecastHourlyBox = document.getElementById("forecastHourlyBox");
const forecastDailyBox = document.getElementById("forecastDailyBox");
const loading = document.getElementById("loading");
const form = document.getElementById("form");

// vars for date formate  //
let fullDate = "";
let timeString = "";
let dateString = "";
let date = "";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});

const formatterHour = new Intl.DateTimeFormat("en-US", { hour: "2-digit" });
const formatterDaily = new Intl.DateTimeFormat("en-US", { day: "2-digit" });

let allData = [];
let allForecasting = [];
// !=================> When start  <=================  //
getCurrentData("cairo");
// !=================> Events  <=================  //

// event animation of search bar & icon search
searchIcon.addEventListener("click", function () {
  if (searchIcon.classList.contains("closeIconAnimation")) {
    form.classList.remove("navFormBefore", "navFormAfter");
    searchInput.classList.replace("closeSearch", "openSearch");
    searchIcon.classList.replace("closeIconAnimation", "openIconAnimation");
  } else if (searchIcon.classList.contains("openIconAnimation")) {
    setTimeout(function () {
      form.classList.add("navFormBefore", "navFormAfter");
    }, 2500);
    searchInput.classList.replace("openSearch", "closeSearch");
    searchIcon.classList.replace("openIconAnimation", "closeIconAnimation");
  } else {
    form.classList.remove("navFormBefore", "navFormAfter");
    searchIcon.classList.add("openIconAnimation");
    searchInput.classList.add("openSearch");
  }
});

// event search input
searchInput.addEventListener("input", function () {
  const regaxSearch = /^[A-z]{3,20}$/;

  if (regaxSearch.test(searchInput.value)) {
    let searchWord = searchInput.value;
    getCurrentData(searchWord);
  }
});

// !=================> Functions  <=================  //

// function for get data from API
async function getCurrentData(searchInputWord) {
  loading.classList.remove("d-none");
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=bd147e6cc68b493695c132615241301&q=${searchInputWord}&days=7`
  );

  const finalResponse = await response.json();
  allData = finalResponse;
  allForecasting = finalResponse.forecast.forecastday;

  displayCurrentData(allData);
  displayHourlyData(allForecasting);
  displayDailyData(allForecasting);
}

//  function for display current temp
function displayCurrentData(currentData, date, time) {
  //  format Date //
  fullDate = new Date(allData.current.last_updated);
  date = fullDate.toDateString();

  // format time //
  time = formatter.format(fullDate);

  let dataOfHeader = `
  
  <div class="currentDate container text-center">
  <div id="region">
    <h4 class=".ff-mont fw-600 mb-2">
      ${currentData.location.name}<span class="fw-300">, ${currentData.location.country}</span>
    </h4>
  </div>
  <div id="localTime" class="mb-2 fw-300">
    <i class="fa-solid fa-calendar-days pe-2"></i
    ><span> ${date}</span>
  </div>
  <div id="time" class="mb-5 fw-300">
  <span>${time}</span>
</div>
  <div class="tempC fs-1 ff-mont fw-800 mb-1">
    ${currentData.current.temp_c}<sup
      ><sup><i class="fa-solid fa-o fa-xs"></i></sup
    ></sup>
    C
  </div>
  <div id="icon" class="d-flex justify-content-center">
    <img
      src="${currentData.current.condition.icon}"
      alt="expression of weather"
      class="filter"
    />
  </div>
  <div class="conditionText ff-mont fs-5 mt-1 mb-5 letter-space fw-500">
    ${currentData.current.condition.text}
  </div>

  <div id="extraInfo">
    <div class="row justify-content-center">
      <div class="col-4 col-lg-2">
        <div class="extraContent">
          <div class="wind_kph bgAll rounded-pill">
            <i class="fa-solid fa-wind pe-2"></i><span>${currentData.current.wind_kph} Km/hr</span>
          </div>
        </div>
      </div>

      <div class="col-4 col-lg-2">
        <div class="extraContent">
          <div class="daily_chance_of_rain bgAll rounded-pill">
            <i class="fa-solid fa-droplet pe-2"></i><span>${currentData.forecast.forecastday[0].day.daily_chance_of_rain} %</span>
          </div>
        </div>
      </div>

      <div class="col-4 col-lg-2">
        <div class="extraContent">
          <div class="wind_dir bgAll rounded-pill">
            <i class="fa-solid fa-compass pe-2"></i><span>${currentData.current.wind_dir}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  landing.innerHTML = dataOfHeader;
}

// function for display forecasting temp hourly for
function displayHourlyData(forecastHourly) {
  let dataOfHourly = "";
  for (let i = 0; i < forecastHourly[0].hour.length; i++) {
    fullDate = new Date(forecastHourly[0].hour[i].time);
    timeString = formatterHour.format(fullDate);
    dataOfHourly += `
    <div class="col-3 col-md-2 col-lg-1 text-center">
    <div class="hourly py-2 px-1 mb-2 h-90">
      <div id="time" class="ff-mont fw-500">${timeString}</div>
      <div id="icon" class="d-flex justify-content-center">
        <img
          src="${forecastHourly[0].hour[i].condition.icon}"
          alt="expression of weather"
          class="filter"
        />
      </div>
      <div class="tempC ff-mont fw-500">
        ${forecastHourly[0].hour[i].temp_c} <sup
          ><sup><i class="fa-solid fa-o fa-xs"></i></sup
        ></sup>
      </div>
    </div>
  </div>    
    `;
    forecastHourlyBox.innerHTML = dataOfHourly;
  }
}

// function for display forecasting temp daily for  7days
function displayDailyData(forecastDaily) {
  let dataOfDaily = "";
  for (let i = 0; i < forecastDaily.length; i++) {
    fullDate = new Date(allForecasting[i].date);
    date = fullDate.toLocaleDateString("en-US", { weekday: "short" });

    dataOfDaily += `

    <div class="col-3 col-md-2 col-lg-2 text-center">
    <div class="daily py-3 px-1 mb-2 h-90">
      <div id="time" class="ff-mont fw-800">${date}</div>
      <div id="icon" class="d-flex justify-content-center">
        <img
          src="${allForecasting[i].day.condition.icon}"
          alt="expression of weather"
          class="filter"
        />
      </div>

      <div class="tempC ff-mont fw-500">
        <span class="maxmum pe-2">
          ${allForecasting[i].day.maxtemp_c} <sup
            ><sup><i class="fa-solid fa-o fa-xs"></i></sup></sup
        ></span>
        <span class="minimum fw-300">
          ${allForecasting[i].day.mintemp_c} <sup
            ><sup><i class="fa-solid fa-o fa-xs"></i></sup></sup
        ></span>
      </div>
    </div>
  </div>

    `;
    forecastDailyBox.innerHTML = dataOfDaily;
  }
}
