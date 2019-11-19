
function QuerySumData(url, chartName) {
    var startData = $("#startDate").val();
    var endData = $("#endDate").val();
    if (endData != "") {
        var dateYear = endData.substr(0, 4);
        var dateMonth = endData.substr(endData.indexOf('年') + 1, 2);
        if (dateMonth == "12") {
            dateYear += 1;
            dateMonth = "00";
        }
        endData = dateYear + '年' + (parseFloat(dateMonth) + 1) + '月';
    }
    var queryPara = {
        statisticsType: chartName,
        startDate: startData,
        endDate: endData
    };
    $.post(url, queryPara, function (dataResult) {
        $("#elecGrid").datagrid({
            data: dataResult
        });
        HadnelData(dataResult);
    }, "JSON");
}

function HadnelData(jsonData) {
    var data1 = [], data2 = [], data3 = [], data4 = [], data5 = [], data6 = [], data7 = [];
    $.each(jsonData, function (index, item) {
        data1.push(item.StaYear + '年' + item.StaMonth + '月');
        data2.push(item.CurrentGeneratingCapacitySum);
        data3.push(item.LastYearSameMonthGeneratingCapacitySum);
        data4.push(item.AddUpGeneratingCapacity);
        data5.push(item.LastYearAddUpGeneratingCapacity);
        data6.push(EMS.DataFormCommonMethods.PointFloat((item.CurrentGeneratingCapacitySum*100 / item.LastYearSameMonthGeneratingCapacitySum),1));
        data7.push(EMS.DataFormCommonMethods.PointFloat((item.AddUpGeneratingCapacity*100 / item.LastYearAddUpGeneratingCapacity),1));
    });
    var dataChart = echarts.init(document.getElementById('Elechistogram'));
    var option = {
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100/*,
            backgroundColor: 'rgba(0,0,0,0)',
            dataBackgroundColor : '#ffffff',
            handleColor: 'rgba(70,130,180,0.8)',
            fillerColor: 'rgba(144,197,237,0.2)'*/
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['本月', '上年同月', '累计', '上年累计'/*, '累计同比', '累计环比'*/],
            y: 30
        },
        toolbox: {
                show: true,
                feature: {
                    magicType: { show: true, type: ['line', 'bar','pie'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                },
                right: 30,
                top: 5
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
            }/*,
            {
                name: '累计同比',
                type: 'line',
                yAxisIndex: 1,
                data: data6
            },
            {
                name: '累计环比',
                type: 'line',
                yAxisIndex: 1,
                data: data7
            }*/
        ]
    };
    dataChart.setOption(option);
}