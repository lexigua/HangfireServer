function QuerySumData(datatype) {
    var queryPara = {
        dataType: datatype,
        startDate: $("#startDate").val().replace("年", ''),
        endDate: $("#endDate").val().replace("年", '')
    };
    $.post("/DataForm/DataGasMonthProductConsume/GetGasMonthConsumYearData", queryPara, function (dataResult) {
        $.easyui.removeLoading();
        var dateField = [
                { name: '统计年份(年)', field: 'StaYear' }
        ];
        var childField = [
            { name: '本年累计(万立方米)', field: 'AddUp' },
            { name: '上年累计(万立方米)', field: 'LastYearAddUp' },
            { name: '累计同比(%)', field: 'AddUpSameRate' }
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
    var data1 = [], data2 = [], data3 = [], data4 = [], data5 = [];
    $.each(jsonData, function (index, item) {
        data1.push(item.StaYear + '年');
        data4.push(item.AddUp);
        data3.push(item.AddUpSameRate);
        data5.push(item.LastYearAddUp);
    });
    createBar(data1, data2, data3, data4, data5);
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
        ",LastYearSameMonthGeneratingCapacitySum,CurrentSameRate";
    var exportheadString = "数据年份(年),数据年份(月),本月生产,去年同月生产,本月同比(%)";
    var typeId = 'a295bcb5-ab81-4285-b036-e018bc31be6f';
    var queryStr = "exec " + procName + " '" + startDate + "','" + endDate + "','" + typeId + "'";
    $.post("/DataForm/DataElectricityGenerationProductStatistics/EchartExport",
    {
        exportStr: exportString, headStr: exportheadString, queryStr: queryStr,
        headTitle: headTitle, imgUrl: imgUrl
    }, function (data) {
        DownLoadChart(data, "/DataForm/DataSocietyElectricityConsumption/DownEchartWord");
        $.easyui.removeLoading();
    });
}

//取消费总量数据
function createBar(data1, data2, data3, data4, data5) {
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
            data: ['本年累计', '上年累计', '累计同比'],
            y: 30
        },
        calculable: true,
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
                name: '累计(万立方米)'
            },
            {
                type: 'value',
                name: '同比(%)'
            }
        ],
        series: [
            {
                name: '本年累计',
                type: 'bar',
                data: data4
            },
            {
                name: '上年累计',
                type: 'bar',
                data: data5
            },
            {
                name: '累计同比',
                type: 'line',
                yAxisIndex: 1,
                data: data3
            }
        ]
    };
    dataChart.setOption(option);
    dataChart.on('click', function (params) {
        $("#pieChar1").remove();
        $("#chars").append("<div id=\"pieChar\" style=\"height: 300px; width: 49%; padding-top: 20px; float: left;\"></div>");
        getPieCharData(params.name);
        var div = document.getElementsByClassName("center panel-body panel-body-noheader panel-body-noborder layout-body");
        div[1].scrollTop = div[1].scrollHeight;
    });
    list = [];
    list.push(dataChart);
}

function getPieCharData(date) {
    $.easyui.showLoadingByStr("加载中...");
    var seriesData = [];
    $.post("/DataForm/DataGasMonthProductConsume/GetGasMonthConsumYearData", {
        startDate: date,
        endDate: date,
        dataType: 'ConsumePrivince'
    }, function (result) {
        $.easyui.removeLoading();
        $.each(eval(result), function (index, item) {
            seriesData.push({ value: item.CurrentMonth, name: item.IndicatorName, typeid: item.IndicatorInfoID, year: item.StaYear });
        });
        bindPieChar(date, seriesData);
    }, 'json');
}

function bindPieChar(date, seriesData) {
    var piechar = echarts.init(document.getElementById("pieChar"));
    var optionpie = {
        title: {
            text: date + " 四川省全省用气量占比",
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: date + "天然气消费",
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: seriesData
            }
        ]
    };
    piechar.setOption(optionpie);
    piechar.on('click', function (params) {
        $("#pieChar2").remove();
        $("#chars").append("<div id=\"pieChar2\" style=\"height: 300px; width: 49%; padding-top: 20px; float: left;\"></div>");
        GetCharData2(params.data.typeid, params.data.year + "年", params.data.name);
        var div = document.getElementsByClassName("center panel-body panel-body-noheader panel-body-noborder layout-body");
        div[1].scrollTop = div[1].scrollHeight;
    });
}
function GetCharData2(typedata, date, name) {
    $.post("/DataForm/DataGasMonthProductConsume/GetYearDataByIndicator", {
        startDate: date,
        endDate: date,
        dataType: typedata
    }, function (result) {
        $.easyui.removeLoading();
        var seriesData = [];
        $.each(result, function (index, item) {
            seriesData.push({ value: item.CurrentMonth, name: item.IndicatorName, typeid: item.IndicatorInfoID, year: item.StaYear });
        });
        bindPieChar2(date, seriesData, name);
    }, 'json');
}

function bindPieChar2(date, seriesData, name) {
    var piechar2 = echarts.init(document.getElementById("pieChar2"));
    var option2 = {
        title: {
            text: date + name,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: date + " 天然气消费占比",
                type: 'pie',
                radius: ['50%', '70%'],
                data: seriesData
            }
        ]
    };
    piechar2.setOption(option2);
}



function getMapCharData() {
    var endData = $("#endDate").val();
    var queryPara = {
        dataType: "ConsumeCIty",
        startDate: endData.replace('年', ''),
        endDate: parseFloat(endData.replace('年', '')) + 1
    };

    var year = endData.replace('年', '');
    $.post("/DataForm/DataGasMonthProductConsume/GetGasMonthConsumYearData", queryPara, function (dataResult) {
        $.easyui.removeLoading();
        //var dateField = [
        //        { name: '统计年份(年)', field: 'StaYear' }
        //];
        //var childField = [
        //    { name: '本月(万立方米)', field: 'AddUp' },
        //    { name: '上年同月(万立方米)', field: 'LastYearAddUp' },
        //    { name: '累计同比(%)', field: 'AddUpSameRate' }
        //];
        //BindGridData(dataResult, "elecGrid", dateField, childField, "IndicatorName");
        $("#elecGrid").datagrid({ data: dataResult });
        HandMapData(dataResult, year);
    }, 'json');
}

function GetInvestmentAmount(name, dataResult) {
    var data = "";
    $.each(dataResult, function (inde, val) {
        if (name.substring(0, 2).contains(val.IndicatorName.substring(0, 2))) {
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

function HandMapData(data, year) {
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
    LoadMap(datamapdata, year);
}

function LoadMap(datamapdata, year) {
    var myChart = echarts.init(document.getElementById('mapChart'));
    var option3 = {
        title: {
            text: year + '年' + ' 各市州天然气消费量分布展示(万方)',
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
    list = [];
    list.push(myChart);
}

//生产消费对比数据
function getDiffData() {
    var queryPara = {
        procStr: "exec proc_Gas_ProductAndConsumYear '" + $("#startDate").val().replace('年', '') + "','" + $("#endDate").val().replace('年', '') + "'"
    };
    $.post("/DataForm/DataSocietyElectricityConsumption/GetElecConsumCommonStatisticsData", queryPara, function (dataResult) {
        $.easyui.removeLoading();
        if (dataResult.length === 0)
            return;
        var dateField = [
             { name: '统计年份(年)', field: 'StaYear' }
        ];
        var childField = [
            { name: '本年累计成产(万方)', field: 'CurrentYearProduct' },
            { name: '本年累计消费(万方)', field: 'CurrentYearConsum' },
            { name: '消费占比(%)', field: 'ConsumRate' }
        ];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        gridFiled= BindGridData(dataResult, "RateGrid", dateField, childField, "IndicatorName");
        $.each(dataResult, function (index, item) {
            var date = item.StaYear + '年';
            if ($.inArray(date, data1) < 0) {
                data1.push(date);
            }
            data2.push(item.CurrentYearProduct);
            data3.push(item.CurrentYearConsum);
        });
        createAreaChart(data1, data2, data3);
    }, 'json');
}

function createAreaChart(data1, data2, data3) {
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
            data: ['本年累计成产', '本年累计消费'],
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
                name: '本年累计成产',
                type: 'line',
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: data2
            },
            {
                name: '本年累计消费',
                type: 'line',
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: data3
            }
        ]
    };
    dataChart2.setOption(option2);
    list = [];
    list.push(dataChart2);
}
