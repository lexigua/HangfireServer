var allRiverStation;
var map;
var roadLayer;
var satLayer;
var lableLayer;

//画空气站点列表
function RiverStationList() {
    $.ajax({
        type: "get", //使用get方法访问后台
        datatype: "json", //返回json格式的数据
        url: "LoadData", //要访问的后台地址
        data: null,
        //data: "Year=" + year & "Month=" + mouth & "Day=" + day, //要发送的数据
        async: false,

        success: function (station) {
            allRiverStation = station;
            //插入html标签
            $.each(allRiverStation, function (index, value) {
                var xShapes = value.LongitudeDegree / 1.0 + value.LongitudeMinute / 60.0 + value.LongitudeSecond / 3600.0;
                var yShapes = value.LatitudeDegree / 1.0 + value.LatitudeMinute / 60.0 + value.LatitudeSecond / 3600.0;
                //<button id="SO2ID" class="btn btn-default" onclick="Choosetype('SO2ID')">SO2</button>
                $("#AirPoint").append("<button id=" + value.StationCode + " class=btn btn-default onclick=GoZoomRiverto(" + xShapes + "," + yShapes + "," + "'" + value.SecPonName + "'" + ")>" + value.SecPonName + "</button><br/>");
                //$("#pointName").append("<li>" + value.SecPonName + "</li>");
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + '"' + value.Id + '"' + ')\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:void(0); \"onclick=\"goZoomAirto(' + xShapes + ',' + yShapes + ',' + value.Id + ');\">' + value.AirCounty + '</a></span></li>');
                //$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');
                //console.log("<button id=" + value.StationCode + " class=btn btn-default onclick=GoZoomAirto(" + xShapes + "," + yShapes + "," + value.StationCodes + ")>" + value.PositionDesign + "</button>");
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

    //这里才是程序的入口
    //drawAirPointNow();

    //drawAirPointDay();
    map.on("load", drawRiverPoint());


    //程序HTML好了就默认点击站点实时和AQI这两个按钮
    //map.on("load", Choosereport("stationNow"));

    //$("#AQIID").ready(Choosetype);
    //$("#stationNow").ready(Choosereport);

    //画河流断面的点
    function drawRiverPoint() {
        $("#AirName").ready(RiverStationList);
        $.each(allRiverStation, function (i, item) {
            var xShapes = item.LongitudeDegree / 1.0 + item.LongitudeMinute / 60.0 + item.LongitudeSecond / 3600.0;
            var yShapes = item.LatitudeDegree / 1.0 + item.LatitudeMinute / 60.0 + item.LatitudeSecond / 3600.0;
            var pt = new esri.geometry.Point(parseFloat(xShapes), parseFloat(yShapes), new esri.SpatialReference({ wkid: 4326 }));
            var webpt = esri.geometry.geographicToWebMercator(pt);
            var symbol = new esri.symbol.PictureMarkerSymbol("../../Content/GIS/PIC/point.png", 35, 35);
            //"点击GIS上站点，可在Infowindow查看最新的空气监测信息CO，CO2，NO2，O3,PM2.5，PM10，AQI，污染程度"
            var dataJson = {};
            var infoTemplate = new esri.InfoTemplate(item.SecPonName + "断面", '水系流经（市）:' + item.SecPonProperties + '<br/>' +
                '断面代码:' + item.SectionCode + '<br/>' + '断面级别:' + item.SectionLevel + '<br/>' +
                '备注:' + item.Remark + '<br/>' + '点位类型:' + item.PointTypeName + '<br/>' +
                '经度（度）:' + xShapes + '<br/>' + '纬度（度）:' + yShapes + '<br/>' 
                );
            var graphic = new esri.Graphic(webpt, symbol, dataJson, infoTemplate);
            map.graphics.add(graphic);

            /*
            var title;
            var content;
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
                    console.log("drawAirPointNow:" + allAirpollution[0].SO2);
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
            */

        });
    }
});

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

function GoZoomRiverto(x, y, station) {
    //站点列表点击定位
    map.infoWindow.hide();
    var pt = new esri.geometry.Point(x, y, new esri.SpatialReference({ wkid: 4326 }));
    var zoomPt = esri.geometry.geographicToWebMercator(pt);
    //map.infoWindow.setTitle(station);
    //map.infoWindow.setContent(null);
    //map.infoWindow.show(zoomPt);
    map.centerAndZoom(zoomPt, 15);
}