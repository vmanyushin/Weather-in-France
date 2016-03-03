/**
 * Created by swop on 01.03.2016.
 */
function save_options() {

    data = {
        city: $('#city').val() == '' ? 'Paris' : $('#city').val(),
        temp: $('#temp').prop('checked'),
        humidity: $('#humidity').prop('checked'),
        wind: $('#wind').prop('checked'),
        direction: $('#direction').prop('checked'),
        forecast: $('#forecast').prop('checked')
    };

    chrome.storage.sync.set(data, function() {
        alert('Options saved');
    });
}

function restore_options() {
    chrome.storage.sync.get({
        city: 'Paris',
        temp: true,
        humidity: true,
        wind: true,
        direction: true,
        forecast: false
    }, function(items) {

        $('#city').val(items.city);
        $('#temp').prop('checked', items.temp);
        $('#humidity').prop('checked', items.humidity);
        $('#wind').prop('checked', items.wind);
        $('#direction').prop('checked', items.direction);
        $('#forecast').prop('checked', items.forecast);
    });
}

