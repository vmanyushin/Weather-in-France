/**
 * Created by swop on 01.03.2016.
 */
$(document).ready(function() {
    $('#city').autocomplete({
        source: cities
    });

    restore_options();

    $('#save').click(function(){
        save_options();
    })
});


