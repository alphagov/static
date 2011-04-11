jQuery(document).ready(function() {

    //leaderboards
    var leaderboards = [
            {"title": "Working Smoke Alarms Save Lives", "image_url": "/promos/working-smoke-alarms.jpg", "target_url": "http://www.direct.gov.uk/en/HomeAndCommunity/InYourHome/FireSafety/DG_071751"},  
            //{"title": "My first advert", "image_url": "https://www.google.com/adsense/static/en/images/exampleLeaderboard.gif", "target_url": "http://bbc.co.uk"},
            //{"title": "My Second Advert", "image_url": "https://www.google.com/adsense/static/en/images/leaderboard_img.jpg", "target_url": "http://google.com"}                        
        ];
    
    //mpu
    var mpus = [
            {"title": "My first advert", "image_url": "https://www.google.com/adsense/static/en/images/300x250_img.jpg", "target_url": "http://bbc.co.uk"},
            {"title": "My Second Advert", "image_url": "https://www.google.com/adsense/static/en/images/inline_rectangle.gif", "target_url": "http://google.com"}                        
        ];

    //setup each type
    apply_promotion('government-promotion-leaderboard', 728, 90, leaderboards)
    apply_promotion('government-promotion-mpu', 300, 250, mpus)
    
    //apply
    function apply_promotion(class_name, width, height, assets){
        //apply a random one to placeholder on the page
        iRandom = Math.floor(Math.random() * assets.length)
        var a = $('<a/>');
        var img = $('<img/>');
        a.attr('href', assets[iRandom].target_url);
        img.attr('src', assets[iRandom].image_url);
        img.attr('title', assets[iRandom].title);
        img.attr('alt', assets[iRandom].title);
        img.attr('width', width);
        img.attr('height', height);
        a.append(img)
        $('.' + class_name).html(a)
    }
    
});
