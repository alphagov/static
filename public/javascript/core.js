jQuery(document).ready(function() {

    //Setup annotator links 
    $('a.annotation').each(function(index) {
        $(this).linkAnnotator();
    });

});