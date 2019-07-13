//得到站点实时和站点日报的状态和监测因子的状态
function GPClickNowOrDay() {
    if (stationNow == 1 & stationDay == -1) {
        alert("实时报GP");
        if (SO2ID == 1) { GPFiledValue = "SO2"; GetNowPG(); }
        else if (NO2ID == 1) { GPFiledValue = "NO2"; GetNowPG(); }
        else if (O3ID == 1) { GPFiledValue = "O3"; GetNowPG(); }
        else if (PM25ID == 1) { GPFiledValue = "PM25"; GetNowPG(); }
        else if (COID == 1) { GPFiledValue = "CO"; GetNowPG(); }
        else if (AQIID == 1) { GPFiledValue = "AQI"; GetNowPG(); }
        else {
            alert("请选择监测因子");
        }
    }
    else if (stationNow == -1 & stationDay == 1) {
        alert("日报GP");
        if (AQIDayID == 1) { GPFiledValue = "AQIDay"; GetNowPG(); }
        else if (CO_24hID == 1) { GPFiledValue = "CO_24h"; GetNowPG(); }
        else if (ICO_24hID == 1) { GPFiledValue = "ICO_24h"; GetNowPG(); }
        else if (INO2_24ID == 1) { GPFiledValue = "INO2_24"; GetNowPG(); }
        else if (IO3_8h_24hID == 1) { GPFiledValue = "IO3_8h_24h"; GetNowPG(); }
        else if (IO3_24hID == 1) { GPFiledValue = "IO3_24h"; GetNowPG(); }
        else if (IPM2_5_24hID == 1) { GPFiledValue = "IPM2_5_24h"; GetNowPG(); }
        else if (IPM10_24hID == 1) { GPFiledValue = "IPM10_24h"; GetNowPG(); }
        else if (ISO2_24hID == 1) { GPFiledValue = "ISO2_24h"; GetNowPG(); }
        else if (NO2_24hID == 1) { GPFiledValue = "NO2_24h"; GetNowPG(); }
        else if (O3_8h_24hID == 1) { GPFiledValue = "O3_8h_24h"; GetNowPG(); }
        else if (O3_24hID == 1) { GPFiledValue = "O3_24h"; GetNowPG(); }
        else if (PM10_24hID == 1) { GPFiledValue = "PM10_24h"; GetNowPG(); }
        else if (SO2_24hID == 1) { GPFiledValue = "SO2_24h"; GetNowPG(); }
        else {
            alert("请选择监测因子");
        }
    }
    else {
        alert("请选择查看日报或实时报");
    }
}


//点击的时候传入状态