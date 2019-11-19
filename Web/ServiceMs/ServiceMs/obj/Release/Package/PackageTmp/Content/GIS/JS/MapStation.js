var allAirStation;
var allAirStationDay;
var map;
var roadLayer;
var satLayer; 
var lableLayer;


//画空气站点列表
function StationList() {
    $.ajax({
        type: "get", //使用get方法访问后台
        datatype: "json", //返回json格式的数据
        url: "GetAirLiveAQI", //要访问的后台地址
        data: null,
        //data: "Year=" + year & "Month=" + mouth & "Day=" + day, //要发送的数据
        async: false,

        success: function(station) {
            allAirStation = $.parseJSON(station);
            //插入html标签
            $.each(allAirStation, function (index, value) {
                var xShapes = value.Longitude.split(",")[0] / 1.0 + value.Longitude.split(",")[1] / 60.0 + value.Longitude.split(",")[2] / 3600.0;
                var yShapes = value.Latitude.split(",")[0] / 1.0 + value.Latitude.split(",")[1] / 60.0 + value.Latitude.split(",")[2] / 3600.0;
                //<button id="SO2ID" class="btn btn-default" onclick="Choosetype('SO2ID')">SO2</button>
                $("#AirPoint").append("<button id=" + value.StationCode + " class=btn btn-default onclick=GoZoomAirto(" + xShapes + "," + yShapes + "," + "'" + value.PositionDesign + "'" + ")>" + value.PositionDesign + "</button><br/>");
                //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
                //console.log("<button id=" + value.StationCode + " class=btn btn-default onclick=GoZoomAirto(" + xShapes + "," + yShapes + "," + value.StationCodes + ")>" + value.PositionDesign + "</button>");
            });
        }
    });
}

//只为得到历史的日报数据

/*
function StationListDay() {
    $.ajax({
        type: "get", //使用get方法访问后台
        datatype: "json", //返回json格式的数据
        url: "GetAirLiveAQI", //要访问的后台地址
        data: null,
        //data: "Year=" + year & "Month=" + mouth & "Day=" + day, //要发送的数据
        async: false,

        success: function (station) {
            allAirStationDay = $.parseJSON(station);
            //插入html标签
            $.each(allAirStationDay, function (index, value) {
                var xShapes = value.Longitude.split[0] / 1.0 + value.Longitude.split[1] / 60.0 + value.Longitude.split(",")[2] / 3600.0;
                var yShapes = value.Latitude.split[0] / 1.0 + value.Latitude.split[1] / 60.0 + value.Latitude.split(",")[2] / 3600.0;
                //<button id="SO2ID" class="btn btn-default" onclick="Choosetype('SO2ID')">SO2</button>
                $("#AirPoint").append("<button id=" + value.StationCode + " class=btn btn-default onclick=GoZoomAirto(" + xShapes + "," + yShapes + "," + "'" + value.PositionDesign + "'" + ")>" + value.PositionDesign + "</button><br/>");
                //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
                console.log("<button id=" + value.StationCode + " class=btn btn-default onclick=GoZoomAirto(" + xShapes + "," + yShapes + "," + value.StationCodes + ")>" + value.PositionDesign + "</button>");
            });
        }
    });
}
*/
$("#AirName").ready(StationList);
$("#AirPollution").load(function () {
    //AirPollution
})


//得到空气站点
function getAirStationNow() {
    NowTime();
    $.ajax({
        type: "get", //使用get方法访问后台
        datatype: "json", //返回json格式的数据
        url: "GetAirLiveAQI", //要访问的后台地址
        data: null,
        //data: "Year=" + year & "Month=" + mouth & "Day=" + day, //要发送的数据
        async: false,

        success: function (station) {
            allAirStation = $.parseJSON(station);
            //插入html标签
            $.each(allAirStation, function (index, value) {
                var xShapes = value.Longitude.split(",")[0] / 1.0 + value.Longitude.split(",")[1] / 60.0 + value.Longitude.split(",")[2] / 3600.0;
                var yShapes = value.Latitude.split(",")[0] / 1.0 + value.Latitude.split(",")[1] / 60.0 + value.Latitude.split(",")[2] / 3600.0;
                //<button id="SO2ID" class="btn btn-default" onclick="Choosetype('SO2ID')">SO2</button>
                //$("#AirPoint").append("<button id=" + value.StationCodes + " class=btn btn-default onclick=GoZoomto(" + xShapes + "," + yShapes + ")>" + value.PositionDesign + "</button>");
                //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
                //console.log("<button id=" + value.StationCodes + " class=btn btn-default onclick=GoZoomto(" + xShapes + "," + yShapes + ")>" + value.PositionDesign + "</button><br/>");
            });
        }
    });
}
//div加载完成后执行
//$("#AirName").ready(getAirStationNow);
//得到空气站点日报
function getAirStationDay() {
    NowTime();
    $.ajax({
        type: "post", //使用get方法访问后台
        datatype: "json", //返回json格式的数据
        url: "GetAirDailyAQI", //要访问的后台地址
        data: {
            //StationCode:XXXX,
            //这个是当前的要用的TimePoint: nowYear + "-" + nowMonth + "-" + nowDay + " " + "23:00:00"
            //TimePoint:"2015-07-1 23:00:00"
            //TimePoint: nowYear + "-" + "6-" + nowDay + " " + "23:00:00"
            TimePoint: "2015-06-1 23:00:00"
        },
        async: false,

        success: function (station) {
            if (station == null || station == [] || station == "" || station=="[]") {
                alert("没有日报数据");
            }
            allAirStation = $.parseJSON(station);
            //插入html标签
            $.each(allAirStation, function (index, value) {
                var xShapes = value.Longitude.split(",")[0] / 1.0 + value.Longitude.split(",")[1] / 60.0 + value.Longitude.split(",")[2] / 3600.0;
                var yShapes = value.Latitude.split(",")[0] / 1.0 + value.Latitude.split(",")[1] / 60.0 + value.Latitude.split(",")[2] / 3600.0;
                //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
               //console.log('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
            });
        }
    });
}


require(["esri/map", "esri/geometry/Point", "esri/dijit/InfoWindow", "dojo/domReady!"], function (Map, Point, infoWindow) {
    map = new esri.Map("mapDiv", { logo: false });
    //var layer = new esri.layers.ArcGISDynamicMapServiceLayer("http://192.168.2.204:6080/arcgis/rest/services/huanbao/MapServer");
    //map.addLayer(layer);

    //谷歌地图加载
    defineClassesBeforInitMap();
    roadLayer = new GoogleMapLayer();
    satLayer = new GoogleImageLayer(); //无标注影像图
    lableLayer = new GoogleAnooLayer();
    satLayer.visible = false;
    lableLayer.visible = false;
    map.addLayer(satLayer);
    map.addLayer(lableLayer);
    map.addLayer(roadLayer);

    //var lastPt = new esri.geometry.Point(11735857.316880668, 3346931.0100315223, new esri.SpatialReference({ wkid: 102113 }));
    var lastPt = new esri.geometry.Point(11735857.316880668, 3361931.0100315223, new esri.SpatialReference({ wkid: 102113 }));
    map.centerAndZoom(lastPt, 11);
    getHistoryData();
    //这里才是程序的入口
    //drawAirPointNow();
    
    //drawAirPointDay();
    //map.on("load", drawAirPointNow);


    //程序HTML好了就默认点击站点实时和AQI这两个按钮
    map.on("load", Choosereport("stationNow"));
    map.on("load", Choosetype("AQIID"));
    //$("#AQIID").ready(Choosetype);
    //$("#stationNow").ready(Choosereport);


    //请求空气站点数据
    function getAirData() {
        $.ajax({
            type: "get", //使用get方法访问后台
            datatype: "json", //返回json格式的数据
            url: "GetAirLiveAQI", //要访问的后台地址
            data: null,
            //data: "Year=" + year & "Month=" + mouth & "Day=" + day, //要发送的数据
            async: false,

            success: function (station) {
                allAirStation = $.parseJSON(station);
                //插入html标签
                $.each(allAirStation, function (index, value) {
                    var xShapes = value.Longitude.split(",")[0] / 1.0 + value.Longitude.split(",")[1] / 60.0 + value.Longitude.split(",")[2] / 3600.0;
                    var yShapes = value.Latitude.split(",")[0] / 1.0 + value.Latitude.split(",")[1] / 60.0 + value.Latitude.split(",")[2] / 3600.0;
                    //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                    //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                    //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                    //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
                    //console.log('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
                });
            }
        });
    }
    //请求历史数据站点数据
    function getHistoryData() {
        $.ajax({
            type: "post", //使用get方法访问后台
            datatype: "json", //返回json格式的数据
            url: "VariationTrend", //要访问的后台地址
            //data: "CityAirID=" + CityAirID & "BeginTime=" + BeginTime & "EndTime=" + EndTime & "Element=" + Element, //要发送的数据
            data: "StationCode=1001A" & "BeginTime=2015-01-12_00:00:00" & "EndTime=2015-08-12_00:00:00" & "Element=SO2", //要发送的数据
            //data: {
            //    StationCode: "1001A",
            //    BeginTime: "2015-01-12 00:00:00",
            //    EndTime: "2015-08-12 00:00:00",
            //    Element: "SO2"
            //   },
            //async: false,
            success: function (historyData) {
                var allHistoryData = $.parseJSON(historyData);
                //插入html标签
                $.each(allHistoryData, function (index, value) {
                    var xShapes = value.LongitudeDegree + value.LongitudeMinute / 60.0 + value.LongitudeSecond / 3600.0;
                    var yShapes = value.LatitudeDegree + value.LatitudeMinute / 60.0 + value.LatitudeSecond / 3600.0;
                    //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                    //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                    //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                    //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.Id + '\'' + ')\">' + value.AirCounty + '</a></span></li>');
                    //console.log('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.Id + '\'' + ')\">' + value.AirCounty + '</a></span></li>');
                });
            }
        });
    }


    //画空气实时站点的点
    function drawAirPointNow() {
        $("#AirName").ready(getAirStationNow);
        $.each(allAirStation, function (i, item) {
            var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
            var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
            var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
            var webpt = esri.geometry.geographicToWebMercator(pt);
            var symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/point.png", 35, 35);
            //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
            var dataJson = {};
            var title;
            var content;
            var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "空气实时信息", '空气级别:' + item.AQILevel + '<br/>' +
                '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
                '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
                '经度（度）:' + xShapes + '<br/>' + '纬度（度）:' + yShapes + '<br/>' +
                'SO2:' + item.SO2 + '<br/>' + 'NO2:' + item.NO2 + '<br/>' +
                'PM10:' + item.PM10 + '<br/>' + 'CO:' + item.CO + '<br/>' +
                'O3:' + item.O3 + '<br/>' + 'PM2_5:' + item.PM2_5 + '<br/>' +
                'AQI:' + item.AQI + '<br/>' + '站点代码:' + item.StationCodes + '<br/>'
                );
            var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
            map.graphics.add(graphic);

            var infoRiverWindow = new infoWindow();
            $.ajax({
                type: "post", //使用get方法访问后台
                datatype: "json", //返回json格式的数据
                url: "GetAirLiveAQI", //要访问的后台地址
                data: { CityAirID: String(item.Id) }, //要发送的数据

                success: function (pollution) {

                    var allAirpollution = $.parseJSON(pollution);
                    if (allAirpollution.length == 0) return;
                    title = "Kong";
                    //console.log("drawAirPointNow:" + allAirpollution[0].SO2);
                    content = "<h1>" +
                        "SO2:" + allAirpollution[0].SO2 + "<br/>" + "SO2_24h:" + allAirpollution[0].SO2_24h +
                        "NO2:" + allAirpollution[0].NO2 + "<br/>" + "NO2_24h:" + allAirpollution[0].NO2_24h +
                        "PM10:" + allAirpollution[0].PM10 + "<br/>" + "PM10_24h:" + allAirpollution[0].PM10_24h +
                        "PM2_5:" + allAirpollution[0].PM2_5 + "<br/>" + "PM2_5_24h:" + allAirpollution[0].PM2_5_24h +
                        "O3:" + allAirpollution[0].O3 + "<br/>" + "O3_24h:" + allAirpollution[0].O3_24h +
                        "O3_8h:" + allAirpollution[0].O3_8h + "<br/>" + "O3_8h_24h:" + allAirpollution[0].O3_8h_24h +
                        "CO:" + allAirpollution[0].CO + "<br/>" + "CO_24h:" + allAirpollution[0].CO_24h +
                        "AQI:" + allAirpollution[0].AQI + "<br/>" + "Quality:" + allAirpollution[0].Quality +
                        "PrimaryPollutant:" + allAirpollution[0].PrimaryPollutant + "<br/>" + "Unheathful:" + allAirpollution[0].Unheathful +
                        "ICO:" + allAirpollution[0].ICO + "<br/>" + "INO2:" + allAirpollution[0].INO2 +
                        "IO3:" + allAirpollution[0].IO3 + "<br/>" + "IO3_8h:" + allAirpollution[0].IO3_8h +
                        "IPM10:" + allAirpollution[0].IPM10 + "<br/>" + "IPM2_5:" + allAirpollution[0].IPM2_5 +
                        "TimePoint:" + allAirpollution[0].TimePoint + "<br/>" + "StationCode:" + allAirpollution[0].StationCode +
                        "Area:" + allAirpollution[0].Area + "<br/>" + "PositionDesign:" + allAirpollution[0].PositionDesign +
                        "</h1>";

                }
            });
            map.infoWindow.setTitle(title);
            map.infoWindow.setContent(content);
            map.infoWindow.hide();


        });
    }
    //画空气日报站点的点
    function drawAirPointDay() {
        $("#AirName").ready(getAirStationDay);
        $.each(allAirStation, function (i, item) {
            var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
            var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
            var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
            var webpt = esri.geometry.geographicToWebMercator(pt);
            var symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/blue.png", 35, 35);
            //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
            var dataJson = {};
            var title;
            var content;
            var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "空气日报信息", '空气级别:' + item.AQILevel + '<br/>' +
                '空气等级:' + item.AQILevelValue + '<br/>' +
                '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
                '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
                '经度（度）:' + xShapes + '<br/>' + '纬度（度）:' + yShapes + '<br/>' +
                'SO2:' + item.SO2 + '<br/>' + 'NO2:' + item.NO2 + '<br/>' +
                'PM10:' + item.PM10 + '<br/>' + 'CO:' + item.CO + '<br/>' +
                'O3:' + item.O3 + '<br/>' + 'PM2_5:' + item.PM2_5 + '<br/>' +
                'AQI:' + item.AQI + '<br/>' + '站点代码:' + item.StationCodes + '<br/>'
                );
            var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
            map.graphics.add(graphic);

            var infoRiverWindow = new infoWindow();
            $.ajax({
                type: "post", //使用get方法访问后台
                datatype: "json", //返回json格式的数据
                url: "GetAirLiveAQI", //要访问的后台地址
                data: { CityAirID: String(item.Id) }, //要发送的数据

                success: function (pollution) {

                    var allAirpollution = $.parseJSON(pollution);
                    if (allAirpollution.length == 0) return;
                    title = "Kong";
                    console.log("drawAirPoint:" + allAirpollution[0].SO2);
                    content = "<h1>" +
                        "SO2:" + allAirpollution[0].SO2 + "<br/>" + "SO2_24h:" + allAirpollution[0].SO2_24h +
                        "NO2:" + allAirpollution[0].NO2 + "<br/>" + "NO2_24h:" + allAirpollution[0].NO2_24h +
                        "PM10:" + allAirpollution[0].PM10 + "<br/>" + "PM10_24h:" + allAirpollution[0].PM10_24h +
                        "PM2_5:" + allAirpollution[0].PM2_5 + "<br/>" + "PM2_5_24h:" + allAirpollution[0].PM2_5_24h +
                        "O3:" + allAirpollution[0].O3 + "<br/>" + "O3_24h:" + allAirpollution[0].O3_24h +
                        "O3_8h:" + allAirpollution[0].O3_8h + "<br/>" + "O3_8h_24h:" + allAirpollution[0].O3_8h_24h +
                        "CO:" + allAirpollution[0].CO + "<br/>" + "CO_24h:" + allAirpollution[0].CO_24h +
                        "AQI:" + allAirpollution[0].AQI + "<br/>" + "Quality:" + allAirpollution[0].Quality +
                        "PrimaryPollutant:" + allAirpollution[0].PrimaryPollutant + "<br/>" + "Unheathful:" + allAirpollution[0].Unheathful +
                        "ICO:" + allAirpollution[0].ICO + "<br/>" + "INO2:" + allAirpollution[0].INO2 +
                        "IO3:" + allAirpollution[0].IO3 + "<br/>" + "IO3_8h:" + allAirpollution[0].IO3_8h +
                        "IPM10:" + allAirpollution[0].IPM10 + "<br/>" + "IPM2_5:" + allAirpollution[0].IPM2_5 +
                        "TimePoint:" + allAirpollution[0].TimePoint + "<br/>" + "StationCode:" + allAirpollution[0].StationCode +
                        "Area:" + allAirpollution[0].Area + "<br/>" + "PositionDesign:" + allAirpollution[0].PositionDesign +
                        "</h1>";

                }
            });
            map.infoWindow.setTitle(title);
            map.infoWindow.setContent(content);
            map.infoWindow.hide();


        });
    }
});



///////////////////////////
//割割割。。。
//画空气实时站点的SO2点
function drawAirPointNowSO2() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationNow);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3: 
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //var symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/point.png", 35, 35);
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "SO2实时信息", '空气质量等级:' + item.AQILevel + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'SO2:' + item.SO2 + '微克/立方米' + '<br/>'+
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>'+
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' +'\'' +item.PositionDesign +'\'' + ','+'\'' + item.StationCodes+'\'' + ','+'\'' + 'SO2' +'\'' +')>' + item.PositionDesign + "历史数据" + '</button>'
            );
       // "<button id=" + value.StationCodes + " class=btn btn-default onclick=openHistoryData(" + xShapes + "," + yShapes + "," + value + ")>" + "查看" + item.PositionDesign + "的历史数据" + "</button>"
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        //infoWindowTitle.style.float = 'none';
        //infoWindowTitle.style.styleFloat = 'none';  // IE
        map.graphics.add(graphic);
        //var infoRiverWindow = new infoWindow();
        //$.ajax({
        //    type: "post", //使用get方法访问后台
        //    datatype: "json", //返回json格式的数据
        //    url: "GetAirLiveAQI", //要访问的后台地址
        //    data: { CityAirID: String(item.Id) }, //要发送的数据

        //    success: function (pollution) {

        //        var allAirpollution = $.parseJSON(pollution);
        //        if (allAirpollution.length == 0) return;
        //        title = "Kong";
        //        console.log("drawAirPointNow:" + allAirpollution[0].SO2);
        //        content = "<h1>" +
        //            "SO2:" + allAirpollution[0].SO2 + "<br/>" + "SO2_24h:" + allAirpollution[0].SO2_24h +
        //            "NO2:" + allAirpollution[0].NO2 + "<br/>" + "NO2_24h:" + allAirpollution[0].NO2_24h +
        //            "PM10:" + allAirpollution[0].PM10 + "<br/>" + "PM10_24h:" + allAirpollution[0].PM10_24h +
        //            "PM2_5:" + allAirpollution[0].PM2_5 + "<br/>" + "PM2_5_24h:" + allAirpollution[0].PM2_5_24h +
        //            "O3:" + allAirpollution[0].O3 + "<br/>" + "O3_24h:" + allAirpollution[0].O3_24h +
        //            "O3_8h:" + allAirpollution[0].O3_8h + "<br/>" + "O3_8h_24h:" + allAirpollution[0].O3_8h_24h +
        //            "CO:" + allAirpollution[0].CO + "<br/>" + "CO_24h:" + allAirpollution[0].CO_24h +
        //            "AQI:" + allAirpollution[0].AQI + "<br/>" + "Quality:" + allAirpollution[0].Quality +
        //            "PrimaryPollutant:" + allAirpollution[0].PrimaryPollutant + "<br/>" + "Unheathful:" + allAirpollution[0].Unheathful +
        //            "ICO:" + allAirpollution[0].ICO + "<br/>" + "INO2:" + allAirpollution[0].INO2 +
        //            "IO3:" + allAirpollution[0].IO3 + "<br/>" + "IO3_8h:" + allAirpollution[0].IO3_8h +
        //            "IPM10:" + allAirpollution[0].IPM10 + "<br/>" + "IPM2_5:" + allAirpollution[0].IPM2_5 +
        //            "TimePoint:" + allAirpollution[0].TimePoint + "<br/>" + "StationCode:" + allAirpollution[0].StationCode +
        //            "Area:" + allAirpollution[0].Area + "<br/>" + "PositionDesign:" + allAirpollution[0].PositionDesign +
        //            "</h1>";

        //    }
        //});
        //map.infoWindow.setTitle(title);
        //map.infoWindow.setContent(content);
        //map.infoWindow.hide();


    });
}
//画空气实时站点的NO2点
function drawAirPointNowNO2() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationNow);
    $.each(allAirStation, function (i, item){
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "NO2实时信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
             'NO2:' + item.NO2 + '微克/立方米' + '<br/>'+
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>'+
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' +'\'' +item.PositionDesign +'\'' + ','+'\'' + item.StationCodes+'\'' + ','+'\'' + 'NO2' +'\'' +')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
//画空气实时站点的O3点
function drawAirPointNowO3() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationNow);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "O3实时信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'O3:' + item.O3 + '微克/立方米' + '<br/>'+
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>'+
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'O3' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
//画空气实时站点的PM2.5点
function drawAirPointNowPM25() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationNow);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "PM2.5实时信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'PM2_5:' + item.PM2_5 + '微克/立方米' + '<br/>' + '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>'+
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'PM25' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
//画空气实时站点的CO点
function drawAirPointNowCO() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationNow);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "CO实时信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
             'CO:' + item.CO + '微克/立方米' + '<br/>' + '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>'+
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'CO' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);
    });
}
//画空气实时站点的AQI点
function drawAirPointNowAQI() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationNow);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "AQI实时信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'AQI:' + item.AQI + '<br/>'+
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>'+
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'AQI' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
////割割割。。。
//新
function drawAirPointDayAQIDay() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "AQI日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'AQI:' + item.AQI + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
} 
function drawAirPointDayCO_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "CO_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'CO_24h:' + item.CO_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayICO_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "ICO_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'ICO_24h:' + item.ICO_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayINO2_24ID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "INO2_24日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'INO2_24:' + item.INO2_24 + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayIO3_8h_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "IO3_8h_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'IO3_8h_24h:' + item.IO3_8h_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayIO3_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "IO3_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'IO3_24h:' + item.IO3_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayIPM2_5_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "IPM2_5_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'IPM2_5_24h:' + item.IPM2_5_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayIPM10_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "IPM10_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'IPM10_24h:' + item.IPM10_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayISO2_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "ISO2_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'ISO2_24h:' + item.ISO2_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayNO2_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "NO2_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'NO2_24h:' + item.NO2_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayO3_8h_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "O3_8h_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'O3_8h_24h:' + item.O3_8h_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayO3_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "O3_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'O3_24h:' + item.O3_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDayPM10_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "PM10_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'PM10_24h:' + item.PM10_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
function drawAirPointDaySO2_24hID() {
    NowTime();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#AirName").ready(getAirStationDay);
    $.each(allAirStation, function (i, item) {
        var xShapes = item.Longitude.split(",")[0] / 1.0 + item.Longitude.split(",")[1] / 60.0 + item.Longitude.split(",")[2] / 3600.0;
        var yShapes = item.Latitude.split(",")[0] / 1.0 + item.Latitude.split(",")[1] / 60.0 + item.Latitude.split(",")[2] / 3600.0;
        var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
        var webpt = esri.geometry.geographicToWebMercator(pt);
        var symbol;
        switch (item.AQILevelValue) {
            case 1:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyou.png", 35, 35);
                break;
            case 2:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowliang.png", 35, 35);
                break;
            case 3:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowqingdu.png", 35, 35);
                break;
            case 4:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongdu.png", 35, 35);
                break;
            case 5:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowzhongzhongdu.png", 35, 35);
                break;
            case 6:
                symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/nowyanzhong.png", 35, 35);
                break;
            default:
                return;
        }
        //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
        var dataJson = {};
        var title;
        var content;
        var infoTemplate = new esri.InfoTemplate(item.PositionDesign + "SO2_24h日报信息", '空气级别:' + item.AQILevel + '<br/>' +
            '空气等级:' + item.AQILevelValue + '<br/>' +
            '空气质量:' + item.AQIType + '<br/>' + '建议采取的措施:' + item.ActionTaken + '<br/>' +
            '对健康影响情况:' + item.Unheathful + '<br/>' + '首要污染物:' + (item.ParmaryPollutant == "" ? "无" : item.ParmaryPollutant) + '<br/>' +
            'SO2_24h:' + item.SO2_24h + '微克/立方米' + '<br/>' +
            '年:' + nowYear + '<br/>' + '月:' + nowMonth + '<br/>' +
            '日:' + nowDay + '<br/>' + '时:' + nowHours + '<br/>' +
            '分:' + nowMinute + '<br/>' + '秒:' + nowSecond + '<br/>' +
            '<button id="' + item.StationCodes + 'History' + '" class="btn btn-default" onclick=openHistoryData(' + '\'' + item.PositionDesign + '\'' + ',' + '\'' + item.StationCodes + '\'' + ',' + '\'' + 'SO2' + '\'' + ')>' + item.PositionDesign + "历史数据" + '</button>'
            );
        var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
        map.graphics.add(graphic);

    });
}
//新完

    ///////////////////////////


    //卫星地图 矢量地图切换:注意，是切换，不要去删除图层，否则其他图层会被新增加的图层隐藏
    function showLayer(toShowLayer) {
        if (toShowLayer == "jd") {
            $(".satellitemap").removeClass("mapfirst");
            $(".basemap").addClass("mapfirst");
            roadLayer.show();;
            satLayer.hide();
            lableLayer.hide();
            map.infoWindow.hide();
        } else if (toShowLayer == "wx") {
            $(".basemap").removeClass("mapfirst");
            $(".satellitemap").addClass("mapfirst");
            roadLayer.hide();;
            satLayer.show();
            lableLayer.show();
            map.infoWindow.hide();
        } else if (toShowLayer == "dx") {

        }
    }

    function GoZoomAirto(x, y, station) {
        //站点列表点击定位
        map.infoWindow.hide();
        var pt = new esri.geometry.Point(x, y, new esri.SpatialReference({ wkid: 4326 }));
        var zoomPt = esri.geometry.geographicToWebMercator(pt);
        //map.infoWindow.setTitle(station);
        //map.infoWindow.setContent(null);
        //map.infoWindow.show(zoomPt);
        map.centerAndZoom(zoomPt, 15);
    }





    //选择站点下拉框
    function SelectStation(name) {
        $("#zhandian").val(name);
    }
    //选择污染化合物站点
    function SelectPolution(name) {
        $("#wuranwu").val(name);
    }

    //报告类型下拉选择事件
    function SelectReportType(typereport) {
    
        switch (typereport) {
            case "实时":
                //$("#selectReportType").val("实时");
                //$("#AirPollution li").remove();
                //$("#AirPollution").append('<li><a href="#" onclick="javascript:SelectPolution(\'SO2\')">SO2</a></li>');
                //$("#AirPollution").append('<li><a href="#" onclick="javascript:SelectPolution(\'NO2\') ">NO2</a></li>');
                //$("#AirPollution").append('<li><a href="#" onclick="javascript:SelectPolution(\'O3\') ">O3</a></li>');
                //$("#AirPollution").append('<li><a href="#" onclick="javascript:SelectPolution(\'PM2.5\') ">PM2.5</a></li>');
                //$("#AirPollution").append('<li><a href="#" onclick="javascript:SelectPolution(\'CO\') ">CO</a></li>');
                //$("#AirPollution").append('<li><a href="#" onclick="javascript:SelectPolution(\'AQI\') ">AQI</a></li>');
                //$("#wuranwu").val("SO2");
                
                $("#selectReportType").val("实时");
                $("#AirPollutionBtn li").remove();
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'SO2\')">SO2</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'NO2\') ">NO2</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'O3\') ">O3</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'PM2.5\') ">PM2.5</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'CO\') ">CO</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'AQI\') ">AQI</a></li>');
                $("#wuranwu").val("SO2");
                break;
            case "日报":
                $("#selectReportType").val("日报");
                $("#AirPollutionBtn li").remove();
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'AQI\') ">AQI</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'CO_24h\') ">CO_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'ICO_24h\') ">ICO_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'INO2_24h\') ">INO2_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'IO3_8h_24h\') ">IO3_8h_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'IO3_24h\') ">IO3_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'IPM2_5_24h\') ">IPM2_5_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'IPM10_24h\') ">IPM10_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'ISO2_24h\') ">ISO2_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'NO2_24h\') ">NO2_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'O3_8h_24h\') ">O3_8h_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'O3_24h\') ">O3_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'PM10_24h\') ">PM10_24h</a></li>');
                $("#AirPollutionBtn").append('<li><a href="#" onclick="javascript:SelectPolution(\'SO2_24h\') ">SO2_24h</a></li>');
                $("#wuranwu").val("AQI");
                break;
            default:
                break;

        }
    }