
function QuerySumData(url, chartName) {
    var queryPara = {
        statisticsType: chartName,
        startDate: $("#startDate").val(),
        endDate: $("#endDate").val()
    };
    $.post(url, queryPara, function (dataResult) {
        $("#elecGrid").datagrid({
            data: dataResult
        });
        HadnelData(dataResult);
    }, "JSON");
}

var dataChart;
function HadnelData(jsonData) {
    var data1 = [], data2 = [], data3 = [], data4 = [], data5 = [], data6 = [], data7 = [];
    $.each(jsonData, function (index, item) {
        data1.push(item.StaYear + '年' + item.StaMonth + '月');
        data2.push(item.CurrentGeneratingCapacitySum);
        data3.push(item.LastYearSameMonthGeneratingCapacitySum);
        data4.push(item.AddUpGeneratingCapacity);
        data5.push(item.LastYearAddUpGeneratingCapacity);
        data6.push(EMS.DataFormCommonMethods.PointFloat((item.CurrentGeneratingCapacitySum * 100 / item.LastYearSameMonthGeneratingCapacitySum), 1));
        data7.push(EMS.DataFormCommonMethods.PointFloat((item.AddUpGeneratingCapacity * 100 / item.LastYearAddUpGeneratingCapacity), 1));
    });
    dataChart = echarts.init(document.getElementById('Elechistogram'));
    var option = {
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['本月', '上年同月', '累计', '上年累计'],
            y: 30
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { show: true, type: ['line', 'bar', 'pie'] },
                restore: { show: true },
                saveAsImage: { show: true }
            },
            right: 35,
            top: 28
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: data1
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '月度'
            },
            {
                type: 'value',
                name: '累计'
            }
        ],
        series: [
            {
                name: '本月',
                type: 'bar',
                data: data2
            },
            {
                name: '上年同月',
                type: 'bar',
                data: data3
            },
            {
                name: '累计',
                type: 'bar',
                yAxisIndex: 1,
                data: data4
            },
            {
                name: '上年累计',
                type: 'bar',
                yAxisIndex: 1,
                data: data5
            }
        ]
    };
    dataChart.setOption(option);
    list.push(dataChart);
    dataChart.on('click', function (params) {
        $("#pieChar").remove();
        $("#pieChar1").remove();
        $("#chars").append("<div id=\"pieChar\" style=\"height: 300px; width: 49%; padding-top: 20px; float: left;\"></div>");
        getPieCharData(params.name);
        var div = document.getElementsByClassName("center panel-body panel-body-noheader panel-body-noborder layout-body");
        div[1].scrollTop = div[1].scrollHeight;
    });
    function getPieCharData(date) {
        var yearData = date.split('年');
        var year = yearData[0];
        var month = yearData[1].replace('月', '');
        $.easyui.showLoadingByStr("加载中...");
        var seriesData = [];
        $.get("/DataForm/DataElectricityGenerationProductStatistics/GetElecProduct6000StatisticsData", { year: year, month: month }, function(result) {
            $.easyui.removeLoading();
            $.each(eval("("+result+")"), function (index, item) {
                 seriesData.push({ value: item.CurrentGeneratingCapacitySum, name: item.IndicatorName, typeid: item.indicatorinfoid, year: year, month: month });
            });
            bindPieChar(date, seriesData);
        });
    }
    var piechar;
    function bindPieChar(date, seriesData) {
        piechar = echarts.init(document.getElementById("pieChar"));
        var optionpie = {
            title: {
                text: date + " 6000kw分类占比",
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: date + " 6000kw分类占比",
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: seriesData
                }
            ]
        };
        piechar.setOption(optionpie);
        list.push(piechar);
        piechar.on('click', function (params) {
            $("#pieChar1").remove();
            $("#chars").append("<div id=\"pieChar1\" style=\"height: 300px; width: 49%; padding-top: 20px; float: right;\"></div>");
            buildPieChar1Data(params.name, params.data.year, params.data.month, params.data.typeid);
        });
    }

    function buildPieChar1Data(indicatorName, year, month, typeid) {
        $.get("/DataForm/DataElectricityGenerationProductStatistics/GetElecProduct6000CategoryStatisticsData", { year: year, month: month, typeId: typeid }, function (result) {
            $.easyui.removeLoading();
            var seriesData = [];
            $.each(eval("(" + result + ")"), function(index, item) {
                seriesData.push({ value: item.CurrentGeneratingCapacitySum, name: item.IndicatorName });
            });
            bindPieChar1(seriesData, indicatorName, year, month);
        });
    }

    var piechar1;
    function bindPieChar1(seriesData, indicatorName, year, month) {
        piechar1 = echarts.init(document.getElementById("pieChar1"));
        var option = {
            title: {
                text: year + "年" + month + "月 " + indicatorName,
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [
                {
                    name: year + "年" + month + "月 " + indicatorName,
                    type: 'pie',
                    radius: ['10%', '50%'],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    data: seriesData
                }
            ]
        };
        piechar1.setOption(option);
        list.push(piechar1);
    }

}

var list = [];
function EchartExport(procName) {
    $.easyui.showLoading();
    var imgUrl = "";
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined)
            imgUrl += "'" + encodeURI(list[i].getDataURL("png"));
    }
    var startDate = $("#startDate").val();
    var endDate = DateAdd("endDate");
    var headTitle = $("#headTitle").html();
    var exportString = "StaYear,StaMonth,CurrentGeneratingCapacitySum" +
        ",LastYearSameMonthGeneratingCapacitySum,AddUpGeneratingCapacity,LastYearAddUpGeneratingCapacity";
    var exportheadString = "统计年份 ,统计月份,本月(万千瓦时) ,上年同月(万千瓦时),累计(万千瓦时),上年累计(万千瓦时) ";
    $.post("/DataForm/DataElectricityGenerationProductStatistics/EchartExport",
        {
            startDate: startDate, endDate: endDate, exportStr: exportString,
            headStr: exportheadString, procName: procName, headTitle: headTitle, imgUrl: imgUrl
        }, function (data) {
            DownLoadChart(data, "/DataForm/DataSocietyElectricityConsumption/DownEchartWord");
            $.easyui.removeLoading();
        });
}