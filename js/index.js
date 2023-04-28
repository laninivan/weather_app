

const keyApi = '15d1f906acec49dc8b882037232504';

let form = document.querySelector('.header__form');
let input = document.querySelector('.input');
let header = document.querySelector('.header');
let modeList = document.querySelector('.mode-list');

const currentModeButton = document.getElementById('current-mode');
const todayModeButton = document.getElementById('today-mode');
const severalModeButton = document.getElementById('several-days-mode');
let weatherMode = 'current'
let data = null;

document.addEventListener("DOMContentLoaded",  (event)=>generateWeatherInfo(event));


form.onsubmit = async function (e) {
   await generateWeatherInfo(e);
}

currentModeButton.onclick = async function (e)  {
    currentModeButton.classList.add('mode-list-item--active');
    todayModeButton.classList.remove('mode-list-item--active');
    severalModeButton.classList.remove('mode-list-item--active');
    weatherMode = 'current';
    removeCard();
    generateCard(data);
}

todayModeButton.onclick = async function (e)  {
    todayModeButton.classList.add('mode-list-item--active');
    currentModeButton.classList.remove('mode-list-item--active');
    severalModeButton.classList.remove('mode-list-item--active');
    weatherMode = 'today';
    removeCard();
    generateCard(data);
}

severalModeButton.onclick = async function (e)  {
    severalModeButton.classList.add('mode-list-item--active');
    todayModeButton.classList.remove('mode-list-item--active');
    currentModeButton.classList.remove('mode-list-item--active');
    weatherMode = 'severalDays';
    removeCard();
    generateCard(data);
}

async function generateWeatherInfo(e) {
    e.preventDefault();
    removeCard();
    data = await getWeather(input.value.trim() || 'auto:ip');
    generateCard(data);
    modeList.classList.remove('none');

    console.log(data);
}

async function getWeather(city) {
    let url  = `http://api.weatherapi.com/v1/forecast.json?key=${keyApi}&q=${city}&lang=ru&days=3`;
    const response = await fetch(url);
    return response.json();
}

function removeCard() {
    while(document.querySelector('.card')) {
        document.querySelector('.card').remove();
    }
}

function generateCard(data) {
    try {

        switch(weatherMode) {
            case ('current'):
                generateCurrentWeather(data);
                break;
            case ('today'):
                generateWeatherByIntervals(data,0);
                break;
            case ('severalDays'):
                generateWeatherByIntervals(data,2);
                generateWeatherByIntervals(data,1);
                generateWeatherByIntervals(data,0);
            break;
            
        }
        
    } catch {
        generateError('Данные введены некоректно!');
    }
   
}

function generateCurrentWeather(data) {
    
        const windDirection = converWindDirectionToRu(data.current.wind_dir);
        const dayOfTheWeek = getDayOfTheWeekByDate(data.location.localtime);
        const cardHTML = ` 
            <div class="card">
            <div class="card__city">
            
                <div class="card__header">
                    <div class="location">
                            ${data.location.name}
                    </div>
            
                    <div class="date">
                    <div class="date__relatively-today">
                         ${dayOfTheWeek}
                    </div>
                    <div class="date__number">
                        ${data.location.localtime.split(' ')[0]}
                    </div>
                    </div>
                </div>
                <div class="card-info">
                     <div class="main-info">
                         <div class="main-info__values">
                            <div class="main-info__temp-c">
                                 ${data.current.temp_c}°
                            </div>
            
                            <div class="main-info__feelslike-c">
                            Ощущается как ${data.current.feelslike_c}°
                            </div>
                         </div>
                         <img src="${data.current.condition.icon}" class="main-info__img" alt="Weather">
            
                    </div>
                    <div class="additional-info">
                    <div class="additional-info__item">
                    <img src="../img/icons/visibility.svg" class="additional-info__img" alt="Weather">
                         <div class="additional-info__values">
                         ${data.current.vis_km}км
                            <div class="additional-info__description">
                                Средняя видимость
                            </div>
                         </div>
                    </div>
                    <div class="additional-info__item">
                    <img src="../img/icons/wind-speed.svg" class="additional-info__img" alt="Weather">
                        <div class="additional-info__values">
                        ${data.current.wind_kph}км/ч
                        <div class="additional-info__description">
                                Скорость ветра
                            </div>
                        </div>
            
                    </div>
                    <div class="additional-info__item">
                    <img src="../img/icons/wind-speed.svg" class="additional-info__img" alt="Weather">
                        <div class="additional-info__values">
                        ${windDirection}
            
                        <div class="additional-info__description">
                                Направление ветра
                            </div>
                        </div>
                    </div>
                    <div class="additional-info__item">
                    <img src="../img/icons/humidity.svg" class="additional-info__img" alt="Weather">
                        <div class="additional-info__values">
                        ${data.current.humidity}%
                        <div class="additional-info__description">
                                Влажность
                            </div>
                        </div>
                    </div>
                    <div class="additional-info__item">
                        <img src="../img/icons/cloudy.svg" class="additional-info__img" alt="Weather">
                        <div class="additional-info__values">
                        ${data.current.cloud}%
                        <div class="additional-info__description">
                                Облачность
                            </div>
                        </div>
                    </div>
                    <div class="additional-info__item">
                    <img src="../img/icons/precipitation.svg" class="additional-info__img" alt="Weather">
                         <div class="additional-info__values">
                        ${data.current.precip_mm}мм
                        <div class="additional-info__description">
                                Осадки
                            </div>
                        </div>
                    </div>
            
                    </div>
                    <div class="description">
                    ${data.current.condition.text}
                </div>   
                </div>
            </div>`
    
            modeList.insertAdjacentHTML('afterEnd', cardHTML);
}

function generateWeatherByIntervals(data, numberOfDays) {
   
        const dateNumber=data.forecast.forecastday[numberOfDays].date;
        const dayOfTheWeek = getDayOfTheWeekByDate(dateNumber);

        const cardHTML = ` 
            <div class="card">
            <div class="card__city">
            
                <div class="card__header">
                    <div class="location">
                            ${data.location.name}
                    </div>
            
                    <div class="date">
                    <div class="date__relatively-today">
                         ${dayOfTheWeek}
                    </div>
                    <div class="date__number">
                        ${dateNumber}
                    </div>
                    </div>
                </div>

                <div class="values-table">
                
                <div class="additional-info__item additional-info__item--column">
                <img src="../img/icons/watch.svg" class="additional-info__img" alt="Weather">
                    <div class="additional-info__description">
                        Время
                    </div>
                 </div>

                    <div class="additional-info__item additional-info__item--column">
                            <img src="../img/icons/thermometer.svg" class="additional-info__img" alt="Weather">
                                <div class="additional-info__description">
                                    Температура
                                </div>
                    </div>

                    <div class="additional-info__item additional-info__item--column">
                            <img src="../img/icons/visibility.svg" class="additional-info__img" alt="Weather">
                                <div class="additional-info__description">
                                    Средняя видимость
                                </div>
                    </div>

                    <div class="additional-info__item additional-info__item--column">
                            <img src="../img/icons/wind-speed.svg" class="additional-info__img" alt="Weather">
                                <div class="additional-info__description">
                                    Скорость ветра
                                </div>
                    </div>

                    <div class="additional-info__item additional-info__item--column">
                            <img src="../img/icons/cloudy.svg" class="additional-info__img" alt="Weather">
                                <div class="additional-info__description">
                                    Облачность
                                </div>
                    </div>

                    <div class="additional-info__item additional-info__item--column">
                            <img src="../img/icons/humidity.svg" class="additional-info__img" alt="Weather">
                                <div class="additional-info__description">
                                Влажность
                                </div>
                    </div>

                    <div class="additional-info__item additional-info__item--column">
                            <img src="../img/icons/precipitation.svg" class="additional-info__img" alt="Weather">
                                <div class="additional-info__description">
                                Осадки
                                </div>
                    </div>
                
                    ${getHtmlCellsValue(data, 4)}





                </div>

            </div>`
            modeList.insertAdjacentHTML('afterEnd', cardHTML);
}

function generateError(errorMessage) {
    const cardHTML = ` <div class="card">${errorMessage}</div>`
    header.insertAdjacentHTML('afterend', cardHTML);
}

function getDayOfTheWeekByDate(date) {
    const dayOfTheWeekNumber = new Date(date.split(' ')[0]).getDay();
    var days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ];
    return days[dayOfTheWeekNumber];
}

function getHtmlCellsValue(data, interval) {
    let temp = data.forecast.forecastday[0].hour;
    let rezHTML=``;

    for(let i=0;i<24;i+=interval) {
        rezHTML=rezHTML+`
    <div class="values-table__cell">
        ${i}:00
    </div>
    <div class="values-table__cell values-table__cell-row">
         <img src="${temp[i].condition.icon}" class="values-table__cell-img">
        ${temp[i].temp_c}°
    </div>
    <div class="values-table__cell">
        ${temp[i].vis_km}км
    </div>
    <div class="values-table__cell">
        ${temp[i].wind_kph}км/ч
    </div>
    <div class="values-table__cell">
        ${temp[i].cloud}%
    </div>
    <div class="values-table__cell">
        ${temp[i].humidity}%
    </div>
    <div class="values-table__cell">
        ${temp[i].precip_mm}мм
    </div>`;
    }

    return rezHTML;
}

function converWindDirectionToRu(direction) {
    return direction.replaceAll('S', 'Ю').
        replaceAll('N', 'С').
        replaceAll('E', 'В').
        replaceAll('W', 'З');

}
