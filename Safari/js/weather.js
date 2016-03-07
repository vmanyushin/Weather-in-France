var APPID = '6ba4ff646f8f1a95298d0d707618d366';
var settings = {city: '', temp: true, humidity: true, wind: true, direction: true, forecast: false};
var weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

function updateWeatherError(error) {
    console.log(error);
}


function update() {
    settings.city = safari.extension.settings.city;
    settings.temp = safari.extension.settings.temp;
    settings.humidity = safari.extension.settings.humidity;
    settings.wind = safari.extension.settings.wind;
    settings.direction = safari.extension.settings.direction;
    settings.forecast = safari.extension.settings.forecast;
    
    if (settings.temp == true) {
        $('.mod-weather__data_temp').removeClass('hide');
    }

    if (settings.humidity == true) {
        $('.mod-weather__data_humidity').removeClass('hide');
    }

    if (settings.wind == true) {
        $('.mod-weather__data_wind').removeClass('hide');
    }

    if (settings.direction == true) {
        $('.mod-weather__data_direction').removeClass('hide');
    }

    var promise = new Promise(function (updateWeather, updateWeatherError) {
        var geoAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=' + settings.city + ',fr&appid=' + APPID + '&units=metric&cnt=8';

        $.getJSON(geoAPI, function (response) {
            showWeatherLocation(response, 1);
        }).error(function () {
            reject('error occured');
        });
    });
}

function showWeatherLocation(data) {
    moment.locale('fr');

    icons = {
        "01d": {b: 'clear_sky--day', p: 'picto-clear_sky--day.png', d: 'day'},
        "02d": {b: 'few_clouds--day', p: 'picto-few_clouds--day.png', d: 'day'},
        "03d": {b: 'scattered_clouds--day', p: 'picto-scattered_clouds--day.png', d: 'day'},
        "04d": {b: 'broken_clouds--day', p: 'picto-broken_clouds--day.png', d: 'day'},
        "09d": {b: 'shower_rain--day', p: 'picto-shower_rain--day.png', d: 'day'},
        "10d": {b: 'rain--day', p: 'picto-rain--day.png', d: 'day'},
        "11d": {b: 'thunderstorm--day', p: 'picto-thunderstorm--day.png', d: 'day'},
        "13d": {b: 'freezing_rain--day', p: 'picto-freezing_rain--day.png', d: 'day'},
        "50d": {b: 'mist--day', p: 'picto-mist--day.png', d: 'day'},

        "01n": {b: 'clear_sky--night', p: 'picto-clear_sky--day.png', d: 'night'},
        "02n": {b: 'few_clouds--night', p: 'picto-few_clouds--day.png', d: 'night'},
        "03n": {b: 'scattered_clouds--night', p: 'picto-scattered_clouds--day.png', d: 'night'},
        "04n": {b: 'broken_clouds--night', p: 'picto-broken_clouds--day.png', d: 'night'},
        "09n": {b: 'shower_rain--night', p: 'picto-shower_rain--day.png', d: 'night'},
        "10n": {b: 'rain--night', p: 'picto-rain--day.png', d: 'night'},
        "11n": {b: 'thunderstorm--night', p: 'picto-thunderstorm--day.png', d: 'night'},
        "13n": {b: 'freezing_rain--night', p: 'picto-freezing_rain--day.png', d: 'night'},
        "50n": {b: 'mist--night', p: 'picto-mist--day.png', d: 'night'},
    };


    var context = {
        temp: Math.ceil(data.list[0].main.temp),
        humidity: data.list[0].main.humidity,
        wind: Math.ceil(data.list[0].wind.speed),
        direction: degToCompass(data.list[0].wind.deg),
        dayOfWeek: ucfirst(moment().format('dddd')),
        location: data.city.name,
        background: icons[data.list[0].weather[0].icon].b,
        picto: icons[data.list[0].weather[0].icon].p,
        nightOrDay: icons[data.list[0].weather[0].icon].d
    };

    $('#temp').text(context.temp + ' °');
    $('#humidity').text(context.humidity + ' %');
    $('#wind').text(context.wind + ' km/h');
    $('#direction').text(context.direction);
    $('#location').text(context.location);
    $('#picto').prop('src', 'img/' + context.picto);
    $('#background').prop('class', '').prop('class', 'mod-weather__main ' + context.background);

    if (context.nightOrDay == 'night') $('#nestor').addClass('night');
    day = moment().day();

    if (settings.forecast == false) {
        $('.forecast').addClass('hide');
        return;
    }

    $('.forecast, .mod-weather__days td.hide').removeClass('hide');

    j = day = moment().day() - 1;

    for (var i = 1; i < 8; i++) {
        if (j == 7) j = 0;

        $('#day' + i).text(weekDays[j])

        if (weekDays[j] == 'Sa' || weekDays[j] == 'Di') {
            $('#day' + i).addClass('weekend ');
        }

        $('#forecastDay' + i).text(Math.round(data.list[i].main.temp) + ' °');
        j++;
    }
}

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


$('#timestamp').text(moment().format('DD/MM/YYYY - HH:mm'));
$('#date').text(moment().format('DD MMMM YYYY'));

update();

// Safari API
$('#settings').click(function(){
    settingsTab = safari.application.activeBrowserWindow.openTab();
    settingsTab.url = safari.extension.baseURI + "options.html";
})

safari.application.addEventListener("message", processMessage, false);

function processMessage(eventMessage) {
    if(eventMessage.name == "saveSettings") {
        saveSettings(eventMessage.message, eventMessage)
    }

    if(eventMessage.name == "restoreSettings") {
        restoreSettings(eventMessage);
    }
}

function saveSettings(data, message) {
    safari.extension.settings.city = data.city;
    safari.extension.settings.temp = data.temp;
    safari.extension.settings.wind = data.wind;
    safari.extension.settings.direction = data.direction;
    safari.extension.settings.humidity = data.humidity;
    safari.extension.settings.forecast = data.forecast;

    update();
}

function restoreSettings(event) {
    var data = {
        city: safari.extension.settings.city,
        temp: safari.extension.settings.temp,
        humidity: safari.extension.settings.humidity,
        wind: safari.extension.settings.wind,
        direction: safari.extension.settings.direction,
        forecast: safari.extension.settings.forecast,
    }

    event.target.page.dispatchMessage("settings", data, false);
}

function setButtonIcon(icon) {
    var itemArray = safari.extension.toolbarItems;

    for (var i = 0; i < itemArray.length; ++i) {
        var item = itemArray[i];
        if(item.dentifier == 'weather') {
            item.image = safari.extension.baseURI + '128-' + icon + '.png';
        }
    }
}


window.setInterval(function() {
    update();
}, 360000)