/**
 * Created by swop on 01.03.2016.
 */
function save_options() {
    console.log('functions.js: save_options');
    data = {
        city: $('#city').val() == '' ? 'Paris' : $('#city').val(),
        temp: $('#temp').prop('checked'),
        humidity: $('#humidity').prop('checked'),
        wind: $('#wind').prop('checked'),
        direction: $('#direction').prop('checked'),
        forecast: $('#forecast').prop('checked')
    };

    safari.self.tab.dispatchMessage("saveSettings", data);
}

function restore_options() {
    safari.self.tab.dispatchMessage("restoreSettings");   
    safari.self.addEventListener("message", getSettings, false);
}

function getSettings(eventMessage) {
    console.log('<- getSettings');
    var items = eventMessage.message;

    $('#city').val(items.city);
    $('#temp').prop('checked', items.temp);
    $('#humidity').prop('checked', items.humidity);
    $('#wind').prop('checked', items.wind);
    $('#direction').prop('checked', items.direction);
    $('#forecast').prop('checked', items.forecast);
}

