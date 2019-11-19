//查询
function QuerySumData(datatype) {
    var endData = $("#endDate").val();
    if (endData != "") {
        var dateYear = endData.substr(0, 4);
        var dateMonth = endData.substr(endData.indexOf('年') + 1, 2);
        if (dateMonth == "12") {
            dateYear = parseFloat(dateYear) + 1;
            dateMonth = "00";
        }
        endData = dateYear + '年' + (parseFloat(dateMonth) + 1) + '月';
    }
    var queryPara = {
        dataType: datatype,
        startDate: $("#startDate").val(),
        endDate: endData
    };
    $.post("/DataForm/DataGasMonthProductConsume/GetGasMonthConsumData", queryPara, function (dataResult) {
        $.easyui.removeLoading();
        var dateField = [
                { name: '统计年月', field: 'StatisticsDate' }
        ];
        var childField = [
            { name: '本月(万立方米)', field: 'CurrentMonth' },
            { name: '上年同月(万立方米)', field: 'LastYearSameMonth' },
            { name: '本月同比(%)', field: 'CurrentSameRate' }
        ];
        gridFiled = BindGridData(dataResult, "elecGrid", dateField, childField, "IndicatorName");
        HadnelData(dataResult);
    }, 'json');
}

function HadnelData(dataResult) {
    var jsonData = dataResult;
    if (jsonData == null) {
        return;
    }
    var data1 = [], data2 = [], data3 = [], data4 = [];
    $.each(jsonData, function (index, item) {
        data1.push(item.StaYear + '年' + item.StaMonth + '月');
        data2.push(item.CurrentMonth);
        data3.push(item.LastYearSameMonth);
        data4.push(item.CurrentSameRate);

    });
    createBar(data1, data2, data3, data4);

}

//取消费总量数据
function createBar(data1, data2, data3, data4, data5) {
    list = [];
    var dataChart = echarts.init(document.getElementById('Elechistogram'));
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
            data: ['本月', '上年同月', '本月同比'],
            y: 30
        }, calculable: true,
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
                name: '月度(万立方米)'
            },
            {
                type: 'value',
                name: '同比(%)'
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
               name: '本月同比',
               type: 'line',
               yAxisIndex: 1,
               data: data4
           }
        ]
    };
    dataChart.setOption(option);
    list.push(dataChart);
    //getMapCharData();
}

//生产消费对比数据
function getDiffData() {
    var queryPara = {
        procStr: "exec proc_Gas_ProductAndConsum '" + $("#startDate").val() + "','" + $("#endDate").val() + "'"
    };
    var data1 = [], data2 = [], data3 = [];
    $.post("/DataForm/DataSocietyElectricityConsumption/GetElecConsumCommonStatisticsData", queryPara, function (dataResult) {
        $.easyui.removeLoading();
        var dateField = [
             { name: '统计年月', field: 'StatisticsDate' }

        ];
        var childField = [
            { name: '本月生产(万方)', field: 'CurrentMonthProduct' },
            { name: '本月消费(万方)', field: 'CurrentMonthConsum' },
            { name: '消费占比(%)', field: 'ConsumRate' }
        ];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        gridFiled = BindGridData(dataResult, "RateGrid", dateField, childField, "IndicatorName");
        $.each(dataResult, function (index, item) {
            var date = item.StaYear + '年' + item.StaMonth + '月';
            if ($.inArray(date, data1) < 0) {
                data1.push(date);
            }
            data2.push(item.CurrentMonthProduct);
            data3.push(item.CurrentMonthConsum);
        });
        createAreaChart(data1, data2, data3);
    }, 'json');
}

function createAreaChart(data1, data2, data3) {
    list = [];
    var dataChart2 = echarts.init(document.getElementById('AreaChart'));
    var option2 = {
        title: {
            text: "天然气生产和消费对比",
            x: "center"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['本月生产', '本月消费'],
            y: 30
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: data1
            }
        ],
        yAxis: [
            {
                type: 'value', name: '(万方)'
            }
        ],
        series: [
            {
                name: '本月生产',
                type: 'line',
                stack: '总量',
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: data2
            },
            {
                name: '本月消费',
                type: 'line',
                stack: '总量',
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: data3
            }
        ]
    };
    dataChart2.setOption(option2);
    list.push(dataChart2);
}


//天然气消费总量统计(按地区)
function getMapCharData() {
    var endData = $("#endDate").val();
    var startDate = endData;
    var dateYear, dateMonth;
    if (endData != "") {
        dateYear = endData.substr(0, 4);
        var monthpos = endData.indexOf('月');
        var yearpos = endData.indexOf('年');
        dateMonth = endData.substr(yearpos + 1, monthpos - yearpos - 1);
        if (dateMonth == "12") {
            dateYear = parseFloat(dateYear) + 1;
            dateMonth = "00";
        }
        endData = dateYear + '年' + (parseFloat(dateMonth) + 1) + '月';
    }
    var queryPara = {
        dataType: "ConsumeCIty",
        startDate: startDate,
        endDate: endData
    };

    $.post("/DataForm/DataGasMonthProductConsume/GetGasMonthConsumData", queryPara, function (dataResult) {
        $.easyui.removeLoading();
        gascitygrid = dataResult;
        $("#cityGrid").datagrid({
            data: dataResult
        });
        var year = dateYear;
        var month = dateMonth;
        //var jsondata = [];
        //$.each(dataResult, function (inde, val) {
        //    if (val.StaYear.toString() === year & val.StaMonth.toString() === month) {
        //        jsondata.push(val);
        //    }
        //});
        HandMapData(dataResult, year, month);
    }, 'json');
}

// 消费总量
var gascitygrid;
function ExportTotalData() {
    if (gascitygrid.length == 0) {
        $.easyui.topShow("无数据！");
        return;
    }
    var imgUrl = "";
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined)
            imgUrl += "'" + encodeURI(list[i].getDataURL("png"));
    }
    var endData = $("#endDate").val();
    var startDate = endData;
    if (endData != "") {
        var dateYear = endData.substr(0, 4);
        var dateMonth = endData.substr(endData.indexOf('年') + 1, endData.length);
        if (dateMonth == "12") {
            endData = endData.replace(dateYear, parseFloat(dateYear) + 1 + "月");
            //endData = endData.replace(dateMonth, 1);
        } else {
            endData = endData.replace(dateMonth, parseFloat(dateMonth) + 1 + "月");
        }
    }
    var headTitle = $("#headTitle").html();
    var exportString = "IndicatorName,StatisticsDate,AddUp,LastYearAddUp";
    var exportheadString = "指标名称,统计年月,累计(万立方米),上年累计(万立方米)";
    EchartExport("ConsumeCIty", startDate, endData, exportString, exportheadString, headTitle, imgUrl);
}

// 消费对比
function ExportRateData() {
    var imgUrl = "";
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined)
            imgUrl += "'" + encodeURI(list[i].getDataURL("png"));
    }
    var data = $("#RateGrid").datagrid("getData");
    var headTitle = $("#headTitle").html();
    var exportString = "StaYear,StaMonth,field00,field01,field110,field111";
    var exportheadString = "统计年份(年),统计月份(月),天然气消费量本月(万立方米),天然气消费量累计(万立方米),天然气产量本月(万立方米) ,天然气消费量累计(万立方米)";
    ExportDataToWorld("RateGrid", exportheadString, exportString, headTitle, list);
}

var list = [];
function EchartExport(dataType, startDate, endDate, exportStr, headStr, headTitle, imgUrl) {

    $.post("/DataForm/DataGasMonthProductConsume/EchartExport",
        {
            dataType: dataType,
            startDate: startDate,
            endDate: endDate,
            exportStr: exportStr,
            headStr: headStr,
            headTitle: headTitle,
            imgUrl: imgUrl
        },
        function (data) {
            DownLoadChart(data, "/DataForm/DataSocietyElectricityConsumption/DownEchartWord", headTitle);
            $.easyui.removeLoading();
        });
}

function GetInvestmentAmount(name, dataResult) {
    var data = "";
    $.each(dataResult, function (inde, val) {
        if (RegExp(name.substring(0, 2)).test(val.IndicatorName)) {
            data = val.AddUp;
            return;
        }
    });
    return parseFloat(data);
}

function GetMaxData(data1) {
    var maxdata = 0;
    $.each(data1, function (index, val) {
        if (parseFloat(val.value) > maxdata)
            maxdata = parseFloat(val.value);
    });
    if (isNaN(maxdata))
        maxdata = 0;
    return maxdata;
}
function GetMinData(data1) {
    var maxdata = -1;
    $.each(data1, function (index, val) {
        if (maxdata === -1) {
            maxdata = parseFloat(val.value);
        }
        if (parseFloat(val.value) < maxdata)
            maxdata = parseFloat(val.value);
    });
    if (isNaN(maxdata))
        maxdata = 0;
    return maxdata;
}

function HandMapData(data, year, month) {
    var datamapdata = [
        { name: '甘孜藏族自治州', value: GetInvestmentAmount("甘孜藏族自治州", data) },
        { name: '阿坝藏族羌族自治州', value: GetInvestmentAmount("阿坝藏族羌族自治州", data) },
        { name: '凉山彝族自治州', value: GetInvestmentAmount("凉山彝族自治州", data) },
        { name: '绵阳市', value: GetInvestmentAmount("绵阳市", data) },
        { name: '达州市', value: GetInvestmentAmount("达州市", data) },
        { name: '广元市', value: GetInvestmentAmount("广元市", data) },
        { name: '雅安市', value: GetInvestmentAmount("雅安市", data) },
        { name: '宜宾市', value: GetInvestmentAmount("宜宾市", data) },
        { name: '乐山市', value: GetInvestmentAmount("乐山市", data) },
        { name: '南充市', value: GetInvestmentAmount("南充市", data) },
        { name: '巴中市', value: GetInvestmentAmount("巴中市", data) },
        { name: '泸州市', value: GetInvestmentAmount("泸州市", data) },
        { name: '成都市', value: GetInvestmentAmount("成都市", data) },
        { name: '资阳市', value: GetInvestmentAmount("资阳市", data) },
        { name: '攀枝花市', value: GetInvestmentAmount("攀枝花市", data) },
        { name: '眉山市', value: GetInvestmentAmount("眉山市", data) },
        { name: '广安市', value: GetInvestmentAmount("广安市", data) },
        { name: '德阳市', value: GetInvestmentAmount("德阳市", data) },
        { name: '内江市', value: GetInvestmentAmount("内江市", data) },
        { name: '遂宁市', value: GetInvestmentAmount("遂宁市", data) },
        { name: '自贡市', value: GetInvestmentAmount("自贡市", data) }
    ];
    LoadMap(datamapdata, year, month);
}

function LoadMap(datamapdata, year, month) {
    list = [];
    var myChart = echarts.init(document.getElementById('mapChart'));
    var option3 = {
        title: {
            text: year + '年' + month + '月 各市州天然气消费量分布展示(万方)',
            subtext: '',
            x: 'left'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data: ['月消费'], y: "left"
        },
        dataRange: {
            min: GetMinData(datamapdata),
            max: GetMaxData(datamapdata),
            color: ['orange', 'yellow'],
            text: ['总消费\n\n高', '低'],
            calculable: true
        },

        series: [
            {
                name: '月消费',
                type: 'map',
                mapType: '四川',
                selectedMode: 'single',
                itemStyle: {

                    normal: { label: { show: true } },
                    emphasis: { label: { show: true } }
                },
                data: datamapdata
            }
        ]
    };
    // 为echarts对象加载数据 
    myChart.setOption(option3);
    list.push(myChart);
}


