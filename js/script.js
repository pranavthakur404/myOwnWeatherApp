const yourTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const loadingScreen = document.querySelector('.loading-screen');
const searchForm = document.querySelector("[data-searchForm]");
const userWeatherInfo = document.querySelector('.user-weather-info')
const grantAccessContainer = document.querySelector(".grant-access-container");

// initial value
const api_key = '4323ec2796bd2273574e04e5df46f4d3';
let currentTab = yourTab;
currentTab.classList.add("current-tab")
getfromSessionStorage();


// now we are switching tabs

yourTab.addEventListener('click',()=>{
    switchTab(yourTab);
    console.log("your")
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
    console.log("Search")
})


function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active"))
        {
            grantAccessContainer.classList.remove("active");
            userWeatherInfo.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userWeatherInfo.classList.remove("active");
            getfromSessionStorage();
        }

    }
}


// now cheking cordinates are present or not in session storage
function getfromSessionStorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");

    if(!localcoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        let coordinates = JSON.parse(localcoordinates);
        fetchUserWeather(coordinates);
    }
}


// getting location through grant access button
const grantAccessBtn = document.querySelector(".grant-access-btn");
grantAccessBtn.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }else{
        alert("Geolocation not supported")
    }
})
function showPosition(position){
    const coordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(coordinates));
    getfromSessionStorage();
}


// now fetching and update user weather info
async function fetchUserWeather(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`);
       const data = await response.json();
       loadingScreen.classList.remove("active");
       userWeatherInfo.classList.add("active");

        rendarWeatherInfo(data);
    }
    catch{
        loadingScreen.classList.remove("active");
        console('eror in fetching data from lat or lon')
    }
}
function rendarWeatherInfo(weatherData){
    const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-cloudiness]");

//   now updating value
cityName.textContent = weatherData?.name;
countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
desc.textContent = weatherData?.weather?.[0]?.description;
weatherIcon.src = `https://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
temp.textContent = weatherData?.main?.temp;
windSpeed.textContent = weatherData?.wind?.speed;
humidity.textContent = weatherData?.main?.humidity
clouds.textContent = weatherData?.clouds?.all;
}




// now getting data from user inpu
const userInput = document.querySelector("[data-userInput]")
searchForm.addEventListener('submit',(event)=>{
    
    event.preventDefault();

    if(userInput.value===""){
        return;
    }else{
        fetchSearchWeather(userInput.value);
    }
})
async function fetchSearchWeather(city){

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
        const data =await response.json();
        userWeatherInfo.classList.add("active")
        rendarWeatherInfo(data);

    }catch(err){
        console.log(err)
    }
    

}