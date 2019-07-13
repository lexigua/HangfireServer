//污染物选择情况
var SO2ID = -1;
var NO2ID = -1;
var O3ID = -1;
var PM25ID = -1;
var COID = -1;
var AQIID = 1;
var AQIDayID = 1;
var CO_24hID = -1;
var ICO_24hID = -1;
var INO2_24ID = -1;
var IO3_8h_24hID = -1;
var IO3_24hID = -1;
var IPM2_5_24hID = -1;
var IPM10_24hID = -1;
var ISO2_24hID = -1;
var NO2_24hID = -1;
var O3_8h_24hID = -1;
var O3_24hID = -1;
var PM10_24hID = -1;
var SO2_24hID = -1;
//站点实时和站点日报选择情况
var stationNow = 1;
var stationDay = -1;
//来个默认颜色
$("#AQIID").ready(RaadyColorAQIID);
$("#stationNow").ready(RaadyColorstationNow);
$("#stationNow").ready(AirPolutionPan);
function RaadyColorAQIID() {
    $("#AQIID").css("background-color", "steelblue");
}
function RaadyColorstationNow() {
    $("#stationNow").css("background-color", "steelblue");
}
//////////////////////
//选择污染化合物种类
function Choosetype(yuansu) {
    $("#SO2ID").css("background-color", "whitesmoke");
    $("#NO2ID").css("background-color", "whitesmoke");
    $("#O3ID").css("background-color", "whitesmoke");
    $("#PM25ID").css("background-color", "whitesmoke");
    $("#COID").css("background-color", "whitesmoke");
    $("#AQIID").css("background-color", "whitesmoke");
    $("#" + yuansu).css("background-color", "steelblue");
    SO2ID = -1;
    NO2ID = -1;
    O3ID = -1;
    PM25ID = -1;
    COID = -1;
    AQIID = -1;
    switch (yuansu) {
        case "SO2ID":
            SO2ID = 1;
            break;
        case "NO2ID":
            NO2ID = 1;
            break;
        case "O3ID":
            O3ID = 1;
            break;
        case "PM25ID":
            PM25ID = 1;
            break;
        case "COID":
            COID = 1;
            break;
        case "AQIID":
            AQIID = 1;
            break;
        default:
            return;
    }
    union();
}

//选择站点实时和站点日报
function Choosereport(report) {
    $("#stationNow").css("background-color", "whitesmoke");
    $("#stationDay").css("background-color", "whitesmoke");
    $("#" + report).css("background-color", "steelblue");
    stationNow = -1;
    stationDay = -1;
    switch (report) {
        case "stationNow":
            stationNow = 1;
            break;
        case "stationDay":
            stationDay = 1;
            break;
        default:
            return;
    }
    union();
}
//////////////////////

//选择污染化合物种类
function Choosetype(yuansu) {
    if (stationNow == 1 & stationDay == -1) {
        $("#SO2ID").css("background-color", "whitesmoke");
        $("#NO2ID").css("background-color", "whitesmoke");
        $("#O3ID").css("background-color", "whitesmoke");
        $("#PM25ID").css("background-color", "whitesmoke");
        $("#COID").css("background-color", "whitesmoke");
        $("#AQIID").css("background-color", "whitesmoke");
        $("#" + yuansu).css("background-color", "steelblue");
        SO2ID = -1;
        NO2ID = -1;
        O3ID = -1;
        PM25ID = -1;
        COID = -1;
        AQIID = -1;
        switch (yuansu) {
            case "SO2ID":
                SO2ID = 1;
                break;
            case "NO2ID":
                NO2ID = 1;
                break;
            case "O3ID":
                O3ID = 1;
                break;
            case "PM25ID":
                PM25ID = 1;
                break;
            case "COID":
                COID = 1;
                break;
            case "AQIID":
                AQIID = 1;
                break;
            default:
                return;
        }
        union();
    }
    else if (stationNow == -1 & stationDay == 1) {
        $("#AQIDayID").css("background-color", "whitesmoke");
        $("#CO_24hID").css("background-color", "whitesmoke");
        $("#ICO_24hID").css("background-color", "whitesmoke");
        $("#INO2_24ID").css("background-color", "whitesmoke");
        $("#IO3_8h_24hID").css("background-color", "whitesmoke");
        $("#IO3_24hID").css("background-color", "whitesmoke");
        $("#IPM2_5_24hID").css("background-color", "whitesmoke");
        $("#IPM10_24hID").css("background-color", "whitesmoke");
        $("#ISO2_24hID").css("background-color", "whitesmoke");
        $("#NO2_24hID").css("background-color", "whitesmoke");
        $("#O3_8h_24hID").css("background-color", "whitesmoke");
        $("#O3_24hID").css("background-color", "whitesmoke");
        $("#PM10_24hID").css("background-color", "whitesmoke");
        $("#SO2_24hID").css("background-color", "whitesmoke");
        $("#" + yuansu).css("background-color", "steelblue");

        AQIDayID = -1;
        CO_24hID = -1;
        ICO_24hID = -1;
        INO2_24ID = -1;
        IO3_8h_24hID = -1;
        IO3_24hID = -1;
        IPM2_5_24hID = -1;
        IPM10_24hID = -1;
        ISO2_24hID = -1;
        NO2_24hID = -1;
        O3_8h_24hID = -1;
        O3_24hID = -1;
        PM10_24hID = -1;
        SO2_24hID = -1;

        switch (yuansu) {
            case "AQIDayID":
                AQIDayID = 1;
                break;
            case "CO_24hID":
                CO_24hID = 1;
                break;
            case "ICO_24hID":
                ICO_24hID = 1;
                break;
            case "INO2_24ID":
                INO2_24ID = 1;
                break;
            case "IO3_8h_24hID":
                IO3_8h_24hID = 1;
                break;
            case "IO3_24hID":
                IO3_24hID = 1;
                break;
            case "IPM2_5_24hID":
                IPM2_5_24hID = 1;
                break;
            case "IPM10_24hID":
                IPM10_24hID = 1;
                break;
            case "ISO2_24hID":
                ISO2_24hID = 1;
                break;
            case "NO2_24hID":
                NO2_24hID = 1;
                break;
            case "O3_8h_24hID":
                O3_8h_24hID = 1;
                break;
            case "O3_24hID":
                O3_24hID = 1;
                break;
            case "PM10_24hID":
                PM10_24hID = 1;
                break;
            case "SO2_24hID":
                SO2_24hID = 1;
                break;
            default:
                alert("监测因子错误或者不存在");
                break;
        }
    }
    union();
}

//选择站点实时和站点日报
function Choosereport(report) {
    $("#stationNow").css("background-color", "whitesmoke");
    $("#stationDay").css("background-color", "whitesmoke");
    $("#" + report).css("background-color", "steelblue");
    stationNow = -1;
    stationDay = -1;
    switch (report) {
        case "stationNow":
            stationNow = 1;
            AirPolutionPan();
            break;
        case "stationDay":
            stationDay = 1;
            AirPolutionPan();
            break;
        default:
            return;
    }
    union();
}

//化合物和站点的联动
function union() {
    if (stationNow == 1 & SO2ID == 1) {
        drawAirPointNowSO2();
    }
    else if (stationNow == 1 & NO2ID == 1) {
        drawAirPointNowNO2();
    }
    else if (stationNow == 1 & O3ID == 1) {
        drawAirPointNowO3();
    }
    else if (stationNow == 1 & PM25ID == 1) {
        drawAirPointNowPM25();
    }
    else if (stationNow == 1 & COID == 1) {
        drawAirPointNowCO();
    }
    else if (stationNow == 1 & AQIID == 1) {
        drawAirPointNowAQI();
    }

        //插入新的站点日报的监测因子
        /////////
    else if (stationDay == 1 & AQIDayID == 1) {
        drawAirPointDayAQIDay();
    }
    else if (stationDay == 1 & CO_24hID == 1) {
        drawAirPointDayCO_24hID();
    }
    else if (stationDay == 1 & ICO_24hID == 1) {
        drawAirPointDayICO_24hID();
    }
    else if (stationDay == 1 & INO2_24ID == 1) {
        drawAirPointDayINO2_24ID();
    }
    else if (stationDay == 1 & IO3_8h_24hID == 1) {
        drawAirPointDayIO3_8h_24hID();
    }
    else if (stationDay == 1 & IO3_24hID == 1) {
        drawAirPointDayIO3_24hID();
    }
    else if (stationDay == 1 & IPM2_5_24hID == 1) {
        drawAirPointDayIPM2_5_24hID();
    }
    else if (stationDay == 1 & IPM10_24hID == 1) {
        drawAirPointDayIPM10_24hID();
    }
    else if (stationDay == 1 & ISO2_24hID == 1) {
        drawAirPointDayISO2_24hID();
    }
    else if (stationDay == 1 & NO2_24hID == 1) {
        drawAirPointDayNO2_24hID();
    }
    else if (stationDay == 1 & O3_8h_24hID == 1) {
        drawAirPointDayO3_8h_24hID();
    }
    else if (stationDay == 1 & O3_24hID == 1) {
        drawAirPointDayO3_24hID();
    }
    else if (stationDay == 1 & PM10_24hID == 1) {
        drawAirPointDayPM10_24hID();
    }
    else if (stationDay == 1 & SO2_24hID == 1) {
        drawAirPointDaySO2_24hID();
    }
        /////////




    else if (stationDay == 1 & SO2ID == 1) {
        drawAirPointDaySO2();
    }
    else if (stationDay == 1 & NO2ID == 1) {
        drawAirPointDayNO2();
    }
    else if (stationDay == 1 & O3ID == 1) {
        drawAirPointDayO3();
    }
    else if (stationDay == 1 & PM25ID == 1) {
        drawAirPointDayPM25();
    }
    else if (stationDay == 1 & COID == 1) {
        drawAirPointDayCO();
    }
    else if (stationDay == 1 & AQIID == 1) {
        drawAirPointDayAQI();
    }
    else{
        alert("没有改监测因子，或监测因子值无效");
    }
}