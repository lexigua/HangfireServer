//  @x.Button("导 出").Width(70).Icon("icon-remove").Click("EchartExport('elecGrid')")
function EchartExport(gridId) {
    var gridData = $("#" + gridId).datagrid("getData");
    var imgUrl = "";

    var list = [myChart1, piechar1, piechar];

    //list.each(function(index) {
    //    this.remove();
    //});
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined)
            imgUrl += "'" + encodeURI(list[i].getDataURL("png"));
    }

    //var nodes = $("#chars>div");
    //nodes.each(function (index) {
    //    var thisid = $("#chars>div:eq(" + index + ")").attr("id");
    //    var myChart = document.getElementById(thisid);
    //    imgUrl = "ImageSend=" + encodeURI(myChart.getDataURL("png"));
    //    var imgUrl2 = "ImageSend=" + encodeURI(myChart.getImage());
    //});
    //imgUrl = encodeURI(myChart1.getDataURL("png"));
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var procName = "getElecConsumIndustryStatistics";
    var exportString = "StaYear,StaMonth," +
        "CurrentMonthUsed,InTheSameMonthLastYearUsed";
    var exportheadString = "数据年份(年),数据月份(月),本月消费(万千瓦时),去年同月消费(万千瓦时)";
    //$.post("/DataForm/DataSocietyElectricityConsumption/EchartExport",
    //    {
    //        startDate: startDate, endDate: endDate, exportStr: exportString,
    //        headStr: exportheadString, procName: procName, imgUrl: imgUrl
    //    }, function (data) {
    //    alert(data);
    //});
}