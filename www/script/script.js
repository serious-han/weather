$(document).ready(function(){
    
    // 위도,경도 검색
    var lat;
    var lon;
    //            if(navigator.geolocation){
    //                navigator.geolocation.getCurrentPosition(function(position){
    //                    lat = position.coords.latitude;
    //                    lon = position.coords.longitude;
    //                });
    //            }
    $.ajax({
        url: "https://ipinfo.io/geo",
        dataType: "json",
        success: function(result){
            var loc = result.loc;
            loc = loc.split(",");
            lat = loc[0];
            lon = loc[1];
        }
    });
    
    // 헤더바, 섹션 높이 설정해주기
    function secset(){
        var vh = $(window).outerHeight();
        var vw = $(window).outerWidth();
        var hh = $("#hdbar").outerHeight();
        var mh = $("#mid").outerHeight();
        var bh = $("#bot").outerHeight();
        $("section").height(vh-hh);
        $("#top").height(vh-hh-mh-bh);
        
        if(vh < vw){
            $("#midbot").css("margin-top",vh-hh-220+"px");
        }else{
            $("#midbot").css("margin-top","0px");
        }
    }
    
    secset();
    
    $(window).resize(function(){
        secset();
    });
    
    
    // city글자수에 따라 글자크기 지정하기
    function clen(){
        var len = $("#city").text().length;
        if(len >= 14){
            $("#city").addClass("stext");
        }else{
            $("#city").removeClass("stext");
        }
    }
    
    clen();
    

    
    
    $(".citybtn").click(function(){
        upd(this);
    });

    // http://api.openweathermap.org/data/2.5/forecast
    //      q=London
    //      mode=json
    //      units=metric
    //      appid=e6ee8ea2d7131ed534209b93ca4235a2
    var link = "http://api.openweathermap.org/data/2.5/forecast";
    var myid = "e6ee8ea2d7131ed534209b93ca4235a2";
    
    function id2icon(id){
        var icon = "";
        if(id>=200 && id<300){
            icon = "fas fa-bolt";
        }else if(id>=300 && id<400){
            icon = "fas fa-cloud-rain";
        }else if(id>=400 && id<600){
            icon = "fas fa-cloud-showers-heavy";
        }else if(id>=600 && id<700){
            icon = "fas fa-snowflake";
        }else if(id>=700 && id<800){
            icon = "fas fa-smog";
        }else if(id==800){
            icon = "fas fa-sun";
        }else if(id==801 || id==802){
            icon = "fas fa-cloud-sun";
        }else if(id==803 || id==804){
            icon = "fas fa-cloud";
        }
        
        return icon;
    }
//   0     1     2    3    4    5    6    7
//  i----i----i----i----i----i----i----i----i
//  9    12   15   18   21  24(0) 3    6
    function settime(tz){
        var now = new Date();
        var result;
        now = now.getUTCHours() + tz;
        
        if(now >= 0 && now < 3){
            result = 5;
        }else if(now >= 3 && now < 6){
            result = 6;
        }else if(now >= 6 && now < 9){
            result = 7;
        }else if(now >= 9 && now < 12){
            result = 0;
        }else if(now >= 12 && now < 15){
            result = 1;
        }else if(now >= 15 && now < 18){
            result = 2;
        }else if(now >= 18 && now < 21){
            result = 3;
        }else if(now >= 21 && now < 24){
            result = 4;
        }
        return result;
    }
    
    
    function suc(result){
        var timezone = result.city.timezone / 3600;
        var listindex = settime(timezone);
        
        console.log(result);
        $("#city").text(result.city.name);
        var icontxt = id2icon(result.list[listindex].weather[0].id);
        $("#icon").removeClass().addClass(icontxt);
        $("#info").text(result.list[listindex].weather[0].description);
        var temp = result.list[listindex].main.temp;
        temp = temp.toFixed(1);
        $(".temp").text(temp);
        var speed = result.list[listindex].wind.speed;
        speed = speed.toFixed(1);
        $("#speed").text(speed);
        $("#hum").text(result.list[listindex].main.humidity);
        var deg = result.list[listindex].wind.deg;
        $("#dir").css("transform","rotate("+deg+"deg)");
        var max = result.list[listindex].main.temp_max;
        var min = result.list[listindex].main.temp_min;
        max = max.toFixed(1);
        min = min.toFixed(1);
        $("#max").text(max);
        $("#min").text(min);
        clen();
        for(i=0; i<5; i++){
            var ftime = new Date(result.list[i*8+2].dt*1000);
            var fmonth = ftime.getMonth() + 1;
            var fdate = ftime.getDate();
            $(".fdate").eq(i).text(fmonth+"/"+fdate);
            var code = result.list[i*8+2].weather[0].id;
            var icon = id2icon(code);
            $(".fc").eq(i).children("svg").removeClass().addClass(icon);       
            var ftemp = result.list[i*8+2].main.temp;
            ftemp = ftemp.toFixed(1);
            $(".fc").eq(i).children(".ftemp").text(ftemp);
        }
        var sunset = result.city.sunset * 1000;
        sunset = new Date(sunset);
        var now = new Date();
        if(now < sunset){
            var iconpic = $("#icon").attr("class");
            iconpic = iconpic.split(" ");
            iconpic = iconpic[1];
            if(iconpic.indexOf("bolt") != -1){
                $("section").css("background-image","url(images/day_thunder.jpg)");
            }else if(iconpic.indexOf("smog") != -1){
                $("section").css("background-image","url(images/day_cloud.jpg)");
            }else if(iconpic.indexOf("snowflake") != -1){
                $("section").css("background-image","url(images/day_snow.jpg)");
            }else if(iconpic.indexOf("rain") != -1){
                $("section").css("background-image","url(images/day_rain.jpg)");
            }else if(iconpic.indexOf("showers") != -1){
                $("section").css("background-image","url(images/day_rain.jpg)");
            }else if(iconpic.indexOf("cloud-sun") != -1){
                $("section").css("background-image","url(images/day_cloudsun.jpg)");
            }else if(iconpic.indexOf("cloud") != -1){
                $("section").css("background-image","url(images/day_cloud.jpg)");
            }else if(iconpic.indexOf("sun") != -1){
                $("section").css("background-image","url(images/day_clear.jpg)");
            }
        }else{
            $("section").css("background-image","url(images/night_clear.jpg)");
        }
    }
    
    function upd(subject){
        var city = $(subject).attr("data");
        if(city != "custom"){
            // 도시명 검색
            $.ajax({
                url: link,
                method: "GET",
                dataType: "json",
                data: {
                    "q":city,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric",
                    "lang":"kr"
                },
                success: suc
            });
        }else{
            $.ajax({
                url: link,
                method: "GET",
                dataType: "json",
                data: {
                    "lat":lat,
                    "lon":lon,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric",
                    "lang":"kr"
                },
                success: suc
            });
        }
    }
    
    upd($(".citybtn:nth-of-type(2)"));
    
    
    
    
    
    
    
});











