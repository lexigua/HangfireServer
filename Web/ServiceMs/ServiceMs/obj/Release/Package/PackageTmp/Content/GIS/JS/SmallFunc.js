//获取今天的日期
var nowYear;
var nowMonth;
var nowDay;
//来个测试时分秒
var nowHours;
var nowMinute;
var nowSecond;
function NowTime() {
    var nowdate = new Date();
    nowYear = nowdate.getFullYear();
    nowMonth = nowdate.getMonth() + 1;
    nowDay = nowdate.getDate();
    nowHours = nowdate.getHours();
    nowMinute = nowdate.getMinutes();
    nowSecond = nowdate.getSeconds();
    //console.log(nowYear + "年");
    //console.log(nowMonth + "月");
    //console.log(nowDay + "日");
    //console.log(nowHours + "时");
    //console.log(nowMinute + "分");
    //console.log(nowSecond + "秒");
}
//轮询时间
setInterval("NowTime()", 1000);


if (nowMinute == 0 && nowSecond == 1) {
    //轮询实时
}
if (nowHours == 0 && nowMinute == 0 && nowSecond == 1) {
    //轮询日报
}


//判断轮询请求实时信息
function lunxunNow() {
    
}

//判断轮询请求日报信息
function lunxunDay() {
    
}


//监测因子面板动态
function AirPolutionPan() {
    //实时报时请求实时的数据获得实时的监测因子
    if (stationNow == 1 & stationDay == -1) {
        //<button id="SO2ID" class="btn btn-default" onclick="Choosetype('SO2ID')">SO2</button>
        $("#AirPollution").empty();
        $("#AirPollution").append("<button id=\"SO2ID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'SO2ID' + "'" + ")\">" + 'SO2' + "</button><br/>");
        $("#AirPollution").append("<button id=\"NO2ID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'NO2ID' + "'" + ")\">" + 'NO2' + "</button><br/>");
        $("#AirPollution").append("<button id=\"O3ID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'O3ID' + "'" + ")\">" + 'O3' + "</button><br/>");
        $("#AirPollution").append("<button id=\"PM25ID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'PM25ID' + "'" + ")\">" + 'PM2.5' + "</button><br/>");
        $("#AirPollution").append("<button id=\"COID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'COID' + "'" + ")\">" + 'CO' + "</button><br/>");
        $("#AirPollution").append("<button id=\"AQIID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'AQIID' + "'" + ")\">" + 'AQI' + "</button><br/>");
        $("#AQIID").css("background-color", "steelblue");
    }
    //日报时请求天的数据获得日报的监测因子
    else if (stationNow == -1 & stationDay == 1) {
        $("#AirPollution").empty();
        $("#AirPollution").append("<button id=\"AQIDayID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'AQIDayID' + "'" + ")\">" + 'AQI' + "</button><br/>");
        $("#AirPollution").append("<button id=\"CO_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'CO_24hID' + "'" + ")\">" + 'CO_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"ICO_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'ICO_24hID' + "'" + ")\">" + 'ICO_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"INO2_24ID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'INO2_24ID' + "'" + ")\">" + 'INO2_24' + "</button><br/>");
        $("#AirPollution").append("<button id=\"IO3_8h_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'IO3_8h_24hID' + "'" + ")\">" + 'IO3_8h_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"IO3_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'IO3_24hID' + "'" + ")\">" + 'IO3_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"IPM2_5_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'IPM2_5_24hID' + "'" + ")\">" + 'IPM2_5_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"IPM10_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'IPM10_24hID' + "'" + ")\">" + 'IPM10_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"ISO2_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'ISO2_24hID' + "'" + ")\">" + 'ISO2_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"NO2_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'NO2_24hID' + "'" + ")\">" + 'NO2_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"O3_8h_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'O3_8h_24hID' + "'" + ")\">" + 'O3_8h_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"O3_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'O3_24hID' + "'" + ")\">" + 'O3_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"PM10_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'PM10_24hID' + "'" + ")\">" + 'PM10_24h' + "</button><br/>");
        $("#AirPollution").append("<button id=\"SO2_24hID\" class=\"btn btn-default\" onclick=\"Choosetype(" + "'" + 'SO2_24hID' + "'" + ")\">" + 'SO2_24h' + "</button><br/>");
        $("#AQIDayID").css("background-color", "steelblue");

    }
    //既不是实时报又不是日报就提示选择
    else{
        alert("未能找到日报或实时报的信息");
    }
}
//$("#AirName").append('<li><span><a href=\"javascript:goZoomAirto(' + xShapes + ',' + yShapes + ',' + '\'' + value.PositionDesign + '\'' + ')\">' + value.PositionDesign + '</a></span></li>');


