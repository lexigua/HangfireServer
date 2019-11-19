//打开查看历史数据的弹框，传入参数站点名称，站点代码，污染的化合物名称
function openHistoryData(n1, n2, n3) {
    //alert("开发中");
    $("#operate6").click();
    //设置默认的站点
}

//查询历史数据按钮事件
function QueryHistoryData(StationCode, BeginTime, EndTime, Element) {
    //只是为了得到CityAirID
    var connectCityAirId;
    //预留一个选择日报和实时的选项
    //var noworday = "实时";
    //var noworday = "日报";
    var noworday = $("#selectReportType").val();



    var myBeginTime = jQuery("#startTime1").val();
    var myCityAirName = $("#zhandian").val();
    //var myCityAirName = jQuery("#AirStationName option:selected").text();
    var myEndTime = jQuery("#endTime2").val();
    var myElement = $("#wuranwu").val() == "PM2.5" ? "PM2_5" : $("#wuranwu").val();
    $.each(allAirStation, function (i, item) {
        if (myCityAirName == item.PositionDesign) {
            connectCityAirId = item.StationCode;
            //connectCityAirId = item.StationCode == undefined ? item.StationCodes : item.StationCode;
        }
    });

    if (noworday == "实时") {
        $.ajax({
            type: "post", //使用get方法访问后台
            datatype: "json", //返回json格式的数据
            url: "VariationTrend", //要访问的后台地址
            //data: "CityAirID=" + CityAirID & "BeginTime=" + BeginTime & "EndTime=" + EndTime & "Element=" + Element, //要发送的数据
            //data: "StationCode=1001A" & "BeginTime=2015-01-12_00:00:00" & "EndTime=2015-08-12_00:00:00" & "Element=SO2", //要发送的数据
            data: {
                StationCode: connectCityAirId,
                BeginTime: myBeginTime,
                EndTime: myEndTime,
                Element: myElement
            },
            //async: false,
            success: function (historyData) {
                var allHistoryData = $.parseJSON(historyData);

                ///////////////////////////////////
                //清除以前的查询记录
                $("#stationHistoryTableGrid").clearGridData();
                //移除表格
                if ($("#gbox_stationHistoryTableGrid") != null) {
                    $("#gbox_stationHistoryTableGrid").remove();
                }
                $("#stationHistoryTableGrid").remove();
                $("#stationHistoryDivGrid").remove();

                //写chart的
                //if ($("#myChart") != null) {
                //    $("#myChart").remove();
                //}
                //$("#pagePic").append("<canvas id='myCanvas'></canvas>");

                //空格
                var kongge = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                var kongge2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                //添加查询结果表格节点
                $("#pageList").append("<table id='stationHistoryTableGrid'></table>");
                $("#pageList").append("<div id='stationHistoryDivGrid' height='450' width='200'></div>");
                $("#stationHistoryTableGrid").jqGrid({
                    datatype: "local",
                    data: allHistoryData,
                    loadonce: true, //添加左侧行号
                    colNames: [kongge + "监测时间" + kongge2, myElement],
                    colModel: [
                        { name: "TimePoint", index: "TimePoint", sorttype: "string", width: 30, height: 20, align: "center" },
                        { name: myElement, index: myElement, sorttype: "string", width: 30, height: 20, align: "center" }
                    ],
                    // viewrecords: false, //是否在浏览导航栏显示记录总数
                    width: 430,
                    height: 200,
                    rowNum: 5,
                    rowList: [5, 10, 15],
                    pager: "#stationHistoryDivGrid",
                    caption: myCityAirName + myElement + "实时查询结果",
                    // autowidth:true,
                    //此事件在点击表格特定单元格时发生。
                    //onCellSelect 单击事件
                    //双击事件
                    //ondblClickRow
                    onSelectRow: function (rowid, status) {
                        //getsentimenthot();
                        //alert("点击定位");
                    }
                });
                //设置样式
                //$("#gview_stationHistoryTableGrid").css({ width: 420, height: 270 });
                $("#first_stationHistoryDivGrid").text("首页");
                $("#prev_stationHistoryDivGrid").text("上页");
                $("#next_stationHistoryDivGrid").text("下页");
                $("#last_stationHistoryDivGrid").text("尾页");

                //eval('var d=allHistoryData[5].' + myElement);
                function listdata(i) {
                    if (eval('allHistoryData[' + i + '].' + myElement) == "—") {
                        return 0;
                    } else {
                        parseFloat(eval('var d=allHistoryData[' + i + '].' + myElement));
                        return d;
                    }
                }

                //echart
                var myEchart = echarts.init(document.getElementById('myChart'));
                myEchart.setOption(


                    {
                        title: {
                            text: myElement + '实时变化图',
                            subtext: ''
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function (params) {
                                var date = new Date(params.value[0]);
                                data = date.getFullYear() + '-'
                                       + (date.getMonth() + 1) + '-'
                                       + date.getDate() + ' '
                                       + date.getHours() + ':'
                                       + date.getMinutes();
                                return data + '<br/>'
                                       + params.value[2] + '含量：'
                                       + params.value[1];
                            }
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        dataZoom: {
                            show: true,
                            start: 70
                        },
                        legend: {
                            data: [myElement]
                        },
                        grid: {
                            y2: 80
                        },
                        xAxis: [
                            {
                                type: 'time',
                                splitNumber: 10
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: 'series1',
                                type: 'line',
                                showAllSymbol: true,
                                symbolSize: function (value) {
                                    return Math.round(value[1] / 10) + 2;
                                },
                                data: (function () {
                                    var d = [];
                                    //var codata = [{ "CO": "0.535", "TimePoint": "2015-06-01 00:00:00" }, { "CO": "0.532", "TimePoint": "2015-06-01 01:00:00" }, { "CO": "0.342", "TimePoint": "2015-06-01 02:00:00" }, { "CO": "0.335", "TimePoint": "2015-06-01 03:00:00" }, { "CO": "0.315", "TimePoint": "2015-06-01 04:00:00" }, { "CO": "0.254", "TimePoint": "2015-06-01 05:00:00" }, { "CO": "0.208", "TimePoint": "2015-06-01 06:00:00" }, { "CO": "0.243", "TimePoint": "2015-06-01 07:00:00" }, { "CO": "0.353", "TimePoint": "2015-06-01 08:00:00" }, { "CO": "0.328", "TimePoint": "2015-06-01 09:00:00" }, { "CO": "0.461", "TimePoint": "2015-06-01 10:00:00" }, { "CO": "0.384", "TimePoint": "2015-06-01 11:00:00" }, { "CO": "0.356", "TimePoint": "2015-06-01 12:00:00" }, { "CO": "0.395", "TimePoint": "2015-06-01 13:00:00" }, { "CO": "0.310", "TimePoint": "2015-06-01 14:00:00" }, { "CO": "0.309", "TimePoint": "2015-06-01 15:00:00" }, { "CO": "0.336", "TimePoint": "2015-06-01 16:00:00" }, { "CO": "0.343", "TimePoint": "2015-06-01 17:00:00" }, { "CO": "0.297", "TimePoint": "2015-06-01 18:00:00" }, { "CO": "0.290", "TimePoint": "2015-06-01 19:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-01 20:00:00" }, { "CO": "0.491", "TimePoint": "2015-06-01 21:00:00" }, { "CO": "0.464", "TimePoint": "2015-06-01 22:00:00" }, { "CO": "0.434", "TimePoint": "2015-06-01 23:00:00" }, { "CO": "0.440", "TimePoint": "2015-06-02 00:00:00" }, { "CO": "0.481", "TimePoint": "2015-06-02 01:00:00" }, { "CO": "0.490", "TimePoint": "2015-06-02 02:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-02 03:00:00" }, { "CO": "0.522", "TimePoint": "2015-06-02 04:00:00" }, { "CO": "0.548", "TimePoint": "2015-06-02 05:00:00" }, { "CO": "0.432", "TimePoint": "2015-06-02 06:00:00" }, { "CO": "0.427", "TimePoint": "2015-06-02 07:00:00" }, { "CO": "0.424", "TimePoint": "2015-06-02 08:00:00" }, { "CO": "0.425", "TimePoint": "2015-06-02 09:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-02 10:00:00" }, { "CO": "0.535", "TimePoint": "2015-06-02 11:00:00" }, { "CO": "0.381", "TimePoint": "2015-06-02 12:00:00" }, { "CO": "0.329", "TimePoint": "2015-06-02 13:00:00" }, { "CO": "0.325", "TimePoint": "2015-06-02 14:00:00" }, { "CO": "0.362", "TimePoint": "2015-06-02 15:00:00" }, { "CO": "0.347", "TimePoint": "2015-06-02 16:00:00" }, { "CO": "0.330", "TimePoint": "2015-06-02 17:00:00" }, { "CO": "0.326", "TimePoint": "2015-06-02 18:00:00" }, { "CO": "0.361", "TimePoint": "2015-06-02 19:00:00" }, { "CO": "0.376", "TimePoint": "2015-06-02 20:00:00" }, { "CO": "0.351", "TimePoint": "2015-06-02 21:00:00" }, { "CO": "0.342", "TimePoint": "2015-06-02 22:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-02 23:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-03 00:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-03 01:00:00" }, { "CO": "0.304", "TimePoint": "2015-06-03 02:00:00" }, { "CO": "0.322", "TimePoint": "2015-06-03 03:00:00" }, { "CO": "0.323", "TimePoint": "2015-06-03 04:00:00" }, { "CO": "0.310", "TimePoint": "2015-06-03 05:00:00" }, { "CO": "0.291", "TimePoint": "2015-06-03 06:00:00" }, { "CO": "0.349", "TimePoint": "2015-06-03 07:00:00" }, { "CO": "0.410", "TimePoint": "2015-06-03 08:00:00" }, { "CO": "0.375", "TimePoint": "2015-06-03 09:00:00" }, { "CO": "0.370", "TimePoint": "2015-06-03 10:00:00" }, { "CO": "0.369", "TimePoint": "2015-06-03 11:00:00" }, { "CO": "0.368", "TimePoint": "2015-06-03 12:00:00" }, { "CO": "0.286", "TimePoint": "2015-06-03 13:00:00" }, { "CO": "0.359", "TimePoint": "2015-06-03 14:00:00" }, { "CO": "0.325", "TimePoint": "2015-06-03 15:00:00" }, { "CO": "0.290", "TimePoint": "2015-06-03 16:00:00" }, { "CO": "0.189", "TimePoint": "2015-06-03 17:00:00" }, { "CO": "0.184", "TimePoint": "2015-06-03 18:00:00" }, { "CO": "0.266", "TimePoint": "2015-06-03 19:00:00" }, { "CO": "0.293", "TimePoint": "2015-06-03 20:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-03 21:00:00" }, { "CO": "0.342", "TimePoint": "2015-06-03 22:00:00" }, { "CO": "0.318", "TimePoint": "2015-06-03 23:00:00" }, { "CO": "0.327", "TimePoint": "2015-06-04 00:00:00" }, { "CO": "0.327", "TimePoint": "2015-06-04 01:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-04 02:00:00" }, { "CO": "0.315", "TimePoint": "2015-06-04 03:00:00" }, { "CO": "0.327", "TimePoint": "2015-06-04 04:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-04 05:00:00" }, { "CO": "0.416", "TimePoint": "2015-06-04 06:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-04 07:00:00" }, { "CO": "0.362", "TimePoint": "2015-06-04 08:00:00" }, { "CO": "0.304", "TimePoint": "2015-06-04 09:00:00" }, { "CO": "0.264", "TimePoint": "2015-06-04 10:00:00" }, { "CO": "0.295", "TimePoint": "2015-06-04 11:00:00" }, { "CO": "0.271", "TimePoint": "2015-06-04 12:00:00" }, { "CO": "0.215", "TimePoint": "2015-06-04 13:00:00" }, { "CO": "0.199", "TimePoint": "2015-06-04 14:00:00" }, { "CO": "0.232", "TimePoint": "2015-06-04 15:00:00" }, { "CO": "0.249", "TimePoint": "2015-06-04 16:00:00" }, { "CO": "0.185", "TimePoint": "2015-06-04 17:00:00" }, { "CO": "0.210", "TimePoint": "2015-06-04 18:00:00" }, { "CO": "0.216", "TimePoint": "2015-06-04 19:00:00" }, { "CO": "0.306", "TimePoint": "2015-06-04 20:00:00" }, { "CO": "0.359", "TimePoint": "2015-06-04 21:00:00" }, { "CO": "0.391", "TimePoint": "2015-06-04 22:00:00" }, { "CO": "0.459", "TimePoint": "2015-06-04 23:00:00" }, { "CO": "0.492", "TimePoint": "2015-06-05 00:00:00" }, { "CO": "0.480", "TimePoint": "2015-06-05 01:00:00" }, { "CO": "0.382", "TimePoint": "2015-06-05 02:00:00" }, { "CO": "0.347", "TimePoint": "2015-06-05 03:00:00" }, { "CO": "0.372", "TimePoint": "2015-06-05 04:00:00" }, { "CO": "0.392", "TimePoint": "2015-06-05 05:00:00" }, { "CO": "0.367", "TimePoint": "2015-06-05 06:00:00" }, { "CO": "0.381", "TimePoint": "2015-06-05 07:00:00" }, { "CO": "0.440", "TimePoint": "2015-06-05 08:00:00" }, { "CO": "0.427", "TimePoint": "2015-06-05 09:00:00" }, { "CO": "0.398", "TimePoint": "2015-06-05 10:00:00" }, { "CO": "0.372", "TimePoint": "2015-06-05 11:00:00" }, { "CO": "0.437", "TimePoint": "2015-06-05 12:00:00" }, { "CO": "0.590", "TimePoint": "2015-06-05 13:00:00" }, { "CO": "0.622", "TimePoint": "2015-06-05 14:00:00" }, { "CO": "0.289", "TimePoint": "2015-06-05 15:00:00" }, { "CO": "0.176", "TimePoint": "2015-06-05 16:00:00" }, { "CO": "0.190", "TimePoint": "2015-06-05 17:00:00" }, { "CO": "0.228", "TimePoint": "2015-06-05 18:00:00" }, { "CO": "0.244", "TimePoint": "2015-06-05 19:00:00" }, { "CO": "0.276", "TimePoint": "2015-06-05 20:00:00" }, { "CO": "0.274", "TimePoint": "2015-06-05 21:00:00" }, { "CO": "0.278", "TimePoint": "2015-06-05 22:00:00" }, { "CO": "0.313", "TimePoint": "2015-06-05 23:00:00" }, { "CO": "0.077", "TimePoint": "2015-06-09 15:00:00" }, { "CO": "0.055", "TimePoint": "2015-06-09 16:00:00" }, { "CO": "0.043", "TimePoint": "2015-06-09 17:00:00" }, { "CO": "0.044", "TimePoint": "2015-06-09 18:00:00" }, { "CO": "0.082", "TimePoint": "2015-06-09 19:00:00" }, { "CO": "0.255", "TimePoint": "2015-06-09 20:00:00" }, { "CO": "0.386", "TimePoint": "2015-06-09 21:00:00" }, { "CO": "0.477", "TimePoint": "2015-06-09 22:00:00" }, { "CO": "0.434", "TimePoint": "2015-06-09 23:00:00" }, { "CO": "0.476", "TimePoint": "2015-06-10 00:00:00" }, { "CO": "0.443", "TimePoint": "2015-06-10 01:00:00" }, { "CO": "0.424", "TimePoint": "2015-06-10 02:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-10 03:00:00" }, { "CO": "0.490", "TimePoint": "2015-06-10 04:00:00" }, { "CO": "0.416", "TimePoint": "2015-06-10 05:00:00" }, { "CO": "0.454", "TimePoint": "2015-06-10 06:00:00" }, { "CO": "0.536", "TimePoint": "2015-06-10 07:00:00" }, { "CO": "0.653", "TimePoint": "2015-06-10 08:00:00" }, { "CO": "0.519", "TimePoint": "2015-06-10 09:00:00" }, { "CO": "0.452", "TimePoint": "2015-06-10 10:00:00" }, { "CO": "0.411", "TimePoint": "2015-06-10 11:00:00" }, { "CO": "0.328", "TimePoint": "2015-06-10 12:00:00" }, { "CO": "0.497", "TimePoint": "2015-06-10 13:00:00" }, { "CO": "0.276", "TimePoint": "2015-06-10 14:00:00" }, { "CO": "0.255", "TimePoint": "2015-06-10 15:00:00" }, { "CO": "0.241", "TimePoint": "2015-06-10 16:00:00" }, { "CO": "0.249", "TimePoint": "2015-06-10 17:00:00" }, { "CO": "0.237", "TimePoint": "2015-06-10 18:00:00" }, { "CO": "0.280", "TimePoint": "2015-06-10 19:00:00" }, { "CO": "0.401", "TimePoint": "2015-06-10 20:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-10 21:00:00" }, { "CO": "0.540", "TimePoint": "2015-06-10 22:00:00" }, { "CO": "0.483", "TimePoint": "2015-06-10 23:00:00" }, { "CO": "0.457", "TimePoint": "2015-06-11 00:00:00" }, { "CO": "0.452", "TimePoint": "2015-06-11 01:00:00" }, { "CO": "0.443", "TimePoint": "2015-06-11 02:00:00" }, { "CO": "0.541", "TimePoint": "2015-06-11 03:00:00" }, { "CO": "0.667", "TimePoint": "2015-06-11 04:00:00" }, { "CO": "0.774", "TimePoint": "2015-06-11 05:00:00" }, { "CO": "0.857", "TimePoint": "2015-06-11 06:00:00" }, { "CO": "0.820", "TimePoint": "2015-06-11 07:00:00" }, { "CO": "0.767", "TimePoint": "2015-06-11 08:00:00" }, { "CO": "0.650", "TimePoint": "2015-06-11 09:00:00" }, { "CO": "0.533", "TimePoint": "2015-06-11 10:00:00" }, { "CO": "0.529", "TimePoint": "2015-06-11 11:00:00" }, { "CO": "0.515", "TimePoint": "2015-06-11 12:00:00" }, { "CO": "0.475", "TimePoint": "2015-06-11 13:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-11 14:00:00" }, { "CO": "0.183", "TimePoint": "2015-06-11 15:00:00" }, { "CO": "0.077", "TimePoint": "2015-06-11 16:00:00" }, { "CO": "0.215", "TimePoint": "2015-06-11 17:00:00" }, { "CO": "0.216", "TimePoint": "2015-06-11 18:00:00" }, { "CO": "0.282", "TimePoint": "2015-06-11 19:00:00" }, { "CO": "0.240", "TimePoint": "2015-06-11 20:00:00" }, { "CO": "0.382", "TimePoint": "2015-06-11 21:00:00" }, { "CO": "0.477", "TimePoint": "2015-06-11 22:00:00" }, { "CO": "0.415", "TimePoint": "2015-06-11 23:00:00" }, { "CO": "0.351", "TimePoint": "2015-06-12 00:00:00" }];
                                    var codata = allHistoryData;
                                    var len = 0;
                                    var now = new Date();
                                    var value;
                                    for (var c = 0; c < codata.length; c++) {
                                        var citem = codata[c];
                                        var v = 0;
                                        if (eval('citem.' + myElement) == "—") {
                                            v = 0;
                                        } else {
                                            parseFloat(eval('var v=citem.' + myElement));
                                          
                                        }
                                        d.push([
                                        new Date(citem.TimePoint),
                                           v,
                                            myElement
                                        ]

                                        );
                                    }

                                    return d;
                                })()
                            }
                        ]
                    }


                );

                //echart end

               
            }
        });
    }
        //如果是查询日报
    else if (noworday == "日报") {
        $.ajax({
            type: "post", //使用get方法访问后台
            datatype: "json", //返回json格式的数据
            url: "VariationTrendDaily", //要访问的后台地址
            //data: "CityAirID=" + CityAirID & "BeginTime=" + BeginTime & "EndTime=" + EndTime & "Element=" + Element, //要发送的数据
            //data: "StationCode=1001A" & "BeginTime=2015-01-12_00:00:00" & "EndTime=2015-08-12_00:00:00" & "Element=SO2", //要发送的数据
            data: {
                StationCode: connectCityAirId,
                BeginTime: myBeginTime,
                EndTime: myEndTime,
                Element: myElement
            },
            //async: false,
            success: function (historyData) {
                var allAirStationDay = $.parseJSON(historyData);

                ///////////////////////////////////
                //清除以前的查询记录
                $("#stationHistoryTableGrid").clearGridData();
                //移除表格
                if ($("#gbox_stationHistoryTableGrid") != null) {
                    $("#gbox_stationHistoryTableGrid").remove();
                }
                $("#stationHistoryTableGrid").remove();
                $("#stationHistoryDivGrid").remove();

                //写chart的
                //if ($("#myChart") != null) {
                //    $("#myChart").remove();
                //}
                //$("#pagePic").append("<canvas id='myCanvas'></canvas>");

                //空格
                var kongge = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                var kongge2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                //添加查询结果表格节点
                $("#pageList").append("<table id='stationHistoryTableGrid'></table>");
                $("#pageList").append("<div id='stationHistoryDivGrid' height='450' width='200'></div>");
                $("#stationHistoryTableGrid").jqGrid({
                    datatype: "local",
                    data: allAirStationDay,
                    loadonce: true, //添加左侧行号
                    colNames: [kongge + "监测时间" + kongge2, myElement],
                    colModel: [
                        { name: "ThisTimePoint", index: "ThisTimePoint", sorttype: "string", width: 30, height: 20, align: "center" },
                        { name: myElement, index: myElement, sorttype: "string", width: 30, height: 20, align: "center" }
                    ],
                    // viewrecords: false, //是否在浏览导航栏显示记录总数
                    width: 430,
                    height: 200,
                    rowNum: 5,
                    rowList: [5, 10, 15],
                    pager: "#stationHistoryDivGrid",
                    caption: myCityAirName + myElement + "日报查询结果",
                    // autowidth:true,
                    //此事件在点击表格特定单元格时发生。
                    //onCellSelect 单击事件
                    //双击事件
                    //ondblClickRow
                    onSelectRow: function (rowid, status) {
                        //getsentimenthot();
                        //alert("点击定位");
                    }
                });

                //设置样式
                //$("#gview_stationHistoryTableGrid").css({ width: 420, height: 270 });
                $("#first_stationHistoryDivGrid").text("首页");
                $("#prev_stationHistoryDivGrid").text("上页");
                $("#next_stationHistoryDivGrid").text("下页");
                $("#last_stationHistoryDivGrid").text("尾页");
                $("#gbox_stationHistoryTableGrid").css({width: 550});


                function listdata(i) {
                    if (eval('allAirStationDay[' + i + '].' + myElement) == "—") {
                        return 0;
                    } else {
                        parseFloat(eval('var d=allAirStationDay[' + i + '].' + myElement));
                        return d;
                    }
                }

                //echart
                var myEchart = echarts.init(document.getElementById('myChart'));
                myEchart.setOption(


                    {
                        title: {
                            text: myElement + '日报变化图',
                            subtext: ''
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function (params) {
                                var date = new Date(params.value[0]);
                                data = date.getFullYear() + '-'
                                       + (date.getMonth() + 1) + '-'
                                       + date.getDate() + ' '
                                       + date.getHours() + ':'
                                       + date.getMinutes();
                                return data + '<br/>'
                                       + params.value[2] + '含量：'
                                       + params.value[1];
                            }
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        dataZoom: {
                            show: true,
                            start: 70
                        },
                        legend: {
                            data: [myElement]
                        },
                        grid: {
                            y2: 80
                        },
                        xAxis: [
                            {
                                type: 'time',
                                splitNumber: 10
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: 'series1',
                                type: 'line',
                                showAllSymbol: true,
                                symbolSize: function (value) {
                                    return Math.round(value[1] / 10) + 2;
                                },
                                data: (function () {
                                    var d = [];
                                    //var codata = [{ "CO": "0.535", "TimePoint": "2015-06-01 00:00:00" }, { "CO": "0.532", "TimePoint": "2015-06-01 01:00:00" }, { "CO": "0.342", "TimePoint": "2015-06-01 02:00:00" }, { "CO": "0.335", "TimePoint": "2015-06-01 03:00:00" }, { "CO": "0.315", "TimePoint": "2015-06-01 04:00:00" }, { "CO": "0.254", "TimePoint": "2015-06-01 05:00:00" }, { "CO": "0.208", "TimePoint": "2015-06-01 06:00:00" }, { "CO": "0.243", "TimePoint": "2015-06-01 07:00:00" }, { "CO": "0.353", "TimePoint": "2015-06-01 08:00:00" }, { "CO": "0.328", "TimePoint": "2015-06-01 09:00:00" }, { "CO": "0.461", "TimePoint": "2015-06-01 10:00:00" }, { "CO": "0.384", "TimePoint": "2015-06-01 11:00:00" }, { "CO": "0.356", "TimePoint": "2015-06-01 12:00:00" }, { "CO": "0.395", "TimePoint": "2015-06-01 13:00:00" }, { "CO": "0.310", "TimePoint": "2015-06-01 14:00:00" }, { "CO": "0.309", "TimePoint": "2015-06-01 15:00:00" }, { "CO": "0.336", "TimePoint": "2015-06-01 16:00:00" }, { "CO": "0.343", "TimePoint": "2015-06-01 17:00:00" }, { "CO": "0.297", "TimePoint": "2015-06-01 18:00:00" }, { "CO": "0.290", "TimePoint": "2015-06-01 19:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-01 20:00:00" }, { "CO": "0.491", "TimePoint": "2015-06-01 21:00:00" }, { "CO": "0.464", "TimePoint": "2015-06-01 22:00:00" }, { "CO": "0.434", "TimePoint": "2015-06-01 23:00:00" }, { "CO": "0.440", "TimePoint": "2015-06-02 00:00:00" }, { "CO": "0.481", "TimePoint": "2015-06-02 01:00:00" }, { "CO": "0.490", "TimePoint": "2015-06-02 02:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-02 03:00:00" }, { "CO": "0.522", "TimePoint": "2015-06-02 04:00:00" }, { "CO": "0.548", "TimePoint": "2015-06-02 05:00:00" }, { "CO": "0.432", "TimePoint": "2015-06-02 06:00:00" }, { "CO": "0.427", "TimePoint": "2015-06-02 07:00:00" }, { "CO": "0.424", "TimePoint": "2015-06-02 08:00:00" }, { "CO": "0.425", "TimePoint": "2015-06-02 09:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-02 10:00:00" }, { "CO": "0.535", "TimePoint": "2015-06-02 11:00:00" }, { "CO": "0.381", "TimePoint": "2015-06-02 12:00:00" }, { "CO": "0.329", "TimePoint": "2015-06-02 13:00:00" }, { "CO": "0.325", "TimePoint": "2015-06-02 14:00:00" }, { "CO": "0.362", "TimePoint": "2015-06-02 15:00:00" }, { "CO": "0.347", "TimePoint": "2015-06-02 16:00:00" }, { "CO": "0.330", "TimePoint": "2015-06-02 17:00:00" }, { "CO": "0.326", "TimePoint": "2015-06-02 18:00:00" }, { "CO": "0.361", "TimePoint": "2015-06-02 19:00:00" }, { "CO": "0.376", "TimePoint": "2015-06-02 20:00:00" }, { "CO": "0.351", "TimePoint": "2015-06-02 21:00:00" }, { "CO": "0.342", "TimePoint": "2015-06-02 22:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-02 23:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-03 00:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-03 01:00:00" }, { "CO": "0.304", "TimePoint": "2015-06-03 02:00:00" }, { "CO": "0.322", "TimePoint": "2015-06-03 03:00:00" }, { "CO": "0.323", "TimePoint": "2015-06-03 04:00:00" }, { "CO": "0.310", "TimePoint": "2015-06-03 05:00:00" }, { "CO": "0.291", "TimePoint": "2015-06-03 06:00:00" }, { "CO": "0.349", "TimePoint": "2015-06-03 07:00:00" }, { "CO": "0.410", "TimePoint": "2015-06-03 08:00:00" }, { "CO": "0.375", "TimePoint": "2015-06-03 09:00:00" }, { "CO": "0.370", "TimePoint": "2015-06-03 10:00:00" }, { "CO": "0.369", "TimePoint": "2015-06-03 11:00:00" }, { "CO": "0.368", "TimePoint": "2015-06-03 12:00:00" }, { "CO": "0.286", "TimePoint": "2015-06-03 13:00:00" }, { "CO": "0.359", "TimePoint": "2015-06-03 14:00:00" }, { "CO": "0.325", "TimePoint": "2015-06-03 15:00:00" }, { "CO": "0.290", "TimePoint": "2015-06-03 16:00:00" }, { "CO": "0.189", "TimePoint": "2015-06-03 17:00:00" }, { "CO": "0.184", "TimePoint": "2015-06-03 18:00:00" }, { "CO": "0.266", "TimePoint": "2015-06-03 19:00:00" }, { "CO": "0.293", "TimePoint": "2015-06-03 20:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-03 21:00:00" }, { "CO": "0.342", "TimePoint": "2015-06-03 22:00:00" }, { "CO": "0.318", "TimePoint": "2015-06-03 23:00:00" }, { "CO": "0.327", "TimePoint": "2015-06-04 00:00:00" }, { "CO": "0.327", "TimePoint": "2015-06-04 01:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-04 02:00:00" }, { "CO": "0.315", "TimePoint": "2015-06-04 03:00:00" }, { "CO": "0.327", "TimePoint": "2015-06-04 04:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-04 05:00:00" }, { "CO": "0.416", "TimePoint": "2015-06-04 06:00:00" }, { "CO": "0.320", "TimePoint": "2015-06-04 07:00:00" }, { "CO": "0.362", "TimePoint": "2015-06-04 08:00:00" }, { "CO": "0.304", "TimePoint": "2015-06-04 09:00:00" }, { "CO": "0.264", "TimePoint": "2015-06-04 10:00:00" }, { "CO": "0.295", "TimePoint": "2015-06-04 11:00:00" }, { "CO": "0.271", "TimePoint": "2015-06-04 12:00:00" }, { "CO": "0.215", "TimePoint": "2015-06-04 13:00:00" }, { "CO": "0.199", "TimePoint": "2015-06-04 14:00:00" }, { "CO": "0.232", "TimePoint": "2015-06-04 15:00:00" }, { "CO": "0.249", "TimePoint": "2015-06-04 16:00:00" }, { "CO": "0.185", "TimePoint": "2015-06-04 17:00:00" }, { "CO": "0.210", "TimePoint": "2015-06-04 18:00:00" }, { "CO": "0.216", "TimePoint": "2015-06-04 19:00:00" }, { "CO": "0.306", "TimePoint": "2015-06-04 20:00:00" }, { "CO": "0.359", "TimePoint": "2015-06-04 21:00:00" }, { "CO": "0.391", "TimePoint": "2015-06-04 22:00:00" }, { "CO": "0.459", "TimePoint": "2015-06-04 23:00:00" }, { "CO": "0.492", "TimePoint": "2015-06-05 00:00:00" }, { "CO": "0.480", "TimePoint": "2015-06-05 01:00:00" }, { "CO": "0.382", "TimePoint": "2015-06-05 02:00:00" }, { "CO": "0.347", "TimePoint": "2015-06-05 03:00:00" }, { "CO": "0.372", "TimePoint": "2015-06-05 04:00:00" }, { "CO": "0.392", "TimePoint": "2015-06-05 05:00:00" }, { "CO": "0.367", "TimePoint": "2015-06-05 06:00:00" }, { "CO": "0.381", "TimePoint": "2015-06-05 07:00:00" }, { "CO": "0.440", "TimePoint": "2015-06-05 08:00:00" }, { "CO": "0.427", "TimePoint": "2015-06-05 09:00:00" }, { "CO": "0.398", "TimePoint": "2015-06-05 10:00:00" }, { "CO": "0.372", "TimePoint": "2015-06-05 11:00:00" }, { "CO": "0.437", "TimePoint": "2015-06-05 12:00:00" }, { "CO": "0.590", "TimePoint": "2015-06-05 13:00:00" }, { "CO": "0.622", "TimePoint": "2015-06-05 14:00:00" }, { "CO": "0.289", "TimePoint": "2015-06-05 15:00:00" }, { "CO": "0.176", "TimePoint": "2015-06-05 16:00:00" }, { "CO": "0.190", "TimePoint": "2015-06-05 17:00:00" }, { "CO": "0.228", "TimePoint": "2015-06-05 18:00:00" }, { "CO": "0.244", "TimePoint": "2015-06-05 19:00:00" }, { "CO": "0.276", "TimePoint": "2015-06-05 20:00:00" }, { "CO": "0.274", "TimePoint": "2015-06-05 21:00:00" }, { "CO": "0.278", "TimePoint": "2015-06-05 22:00:00" }, { "CO": "0.313", "TimePoint": "2015-06-05 23:00:00" }, { "CO": "0.077", "TimePoint": "2015-06-09 15:00:00" }, { "CO": "0.055", "TimePoint": "2015-06-09 16:00:00" }, { "CO": "0.043", "TimePoint": "2015-06-09 17:00:00" }, { "CO": "0.044", "TimePoint": "2015-06-09 18:00:00" }, { "CO": "0.082", "TimePoint": "2015-06-09 19:00:00" }, { "CO": "0.255", "TimePoint": "2015-06-09 20:00:00" }, { "CO": "0.386", "TimePoint": "2015-06-09 21:00:00" }, { "CO": "0.477", "TimePoint": "2015-06-09 22:00:00" }, { "CO": "0.434", "TimePoint": "2015-06-09 23:00:00" }, { "CO": "0.476", "TimePoint": "2015-06-10 00:00:00" }, { "CO": "0.443", "TimePoint": "2015-06-10 01:00:00" }, { "CO": "0.424", "TimePoint": "2015-06-10 02:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-10 03:00:00" }, { "CO": "0.490", "TimePoint": "2015-06-10 04:00:00" }, { "CO": "0.416", "TimePoint": "2015-06-10 05:00:00" }, { "CO": "0.454", "TimePoint": "2015-06-10 06:00:00" }, { "CO": "0.536", "TimePoint": "2015-06-10 07:00:00" }, { "CO": "0.653", "TimePoint": "2015-06-10 08:00:00" }, { "CO": "0.519", "TimePoint": "2015-06-10 09:00:00" }, { "CO": "0.452", "TimePoint": "2015-06-10 10:00:00" }, { "CO": "0.411", "TimePoint": "2015-06-10 11:00:00" }, { "CO": "0.328", "TimePoint": "2015-06-10 12:00:00" }, { "CO": "0.497", "TimePoint": "2015-06-10 13:00:00" }, { "CO": "0.276", "TimePoint": "2015-06-10 14:00:00" }, { "CO": "0.255", "TimePoint": "2015-06-10 15:00:00" }, { "CO": "0.241", "TimePoint": "2015-06-10 16:00:00" }, { "CO": "0.249", "TimePoint": "2015-06-10 17:00:00" }, { "CO": "0.237", "TimePoint": "2015-06-10 18:00:00" }, { "CO": "0.280", "TimePoint": "2015-06-10 19:00:00" }, { "CO": "0.401", "TimePoint": "2015-06-10 20:00:00" }, { "CO": "0.472", "TimePoint": "2015-06-10 21:00:00" }, { "CO": "0.540", "TimePoint": "2015-06-10 22:00:00" }, { "CO": "0.483", "TimePoint": "2015-06-10 23:00:00" }, { "CO": "0.457", "TimePoint": "2015-06-11 00:00:00" }, { "CO": "0.452", "TimePoint": "2015-06-11 01:00:00" }, { "CO": "0.443", "TimePoint": "2015-06-11 02:00:00" }, { "CO": "0.541", "TimePoint": "2015-06-11 03:00:00" }, { "CO": "0.667", "TimePoint": "2015-06-11 04:00:00" }, { "CO": "0.774", "TimePoint": "2015-06-11 05:00:00" }, { "CO": "0.857", "TimePoint": "2015-06-11 06:00:00" }, { "CO": "0.820", "TimePoint": "2015-06-11 07:00:00" }, { "CO": "0.767", "TimePoint": "2015-06-11 08:00:00" }, { "CO": "0.650", "TimePoint": "2015-06-11 09:00:00" }, { "CO": "0.533", "TimePoint": "2015-06-11 10:00:00" }, { "CO": "0.529", "TimePoint": "2015-06-11 11:00:00" }, { "CO": "0.515", "TimePoint": "2015-06-11 12:00:00" }, { "CO": "0.475", "TimePoint": "2015-06-11 13:00:00" }, { "CO": "0.311", "TimePoint": "2015-06-11 14:00:00" }, { "CO": "0.183", "TimePoint": "2015-06-11 15:00:00" }, { "CO": "0.077", "TimePoint": "2015-06-11 16:00:00" }, { "CO": "0.215", "TimePoint": "2015-06-11 17:00:00" }, { "CO": "0.216", "TimePoint": "2015-06-11 18:00:00" }, { "CO": "0.282", "TimePoint": "2015-06-11 19:00:00" }, { "CO": "0.240", "TimePoint": "2015-06-11 20:00:00" }, { "CO": "0.382", "TimePoint": "2015-06-11 21:00:00" }, { "CO": "0.477", "TimePoint": "2015-06-11 22:00:00" }, { "CO": "0.415", "TimePoint": "2015-06-11 23:00:00" }, { "CO": "0.351", "TimePoint": "2015-06-12 00:00:00" }];
                                    var codata = allAirStationDay;
                                    var len = 0;
                                    var now = new Date();
                                    var value;
                                    for (var c = 0; c < codata.length; c++) {
                                        var citem = codata[c];
                                        var v = 0;
                                        if (eval('citem.' + myElement) == "—") {
                                            v = 0;
                                        } else {
                                            parseFloat(eval('var v=citem.' + myElement));

                                        }
                                        d.push([
                                        new Date(citem.ThisTimePoint),
                                           v,
                                            myElement
                                        ]

                                        );
                                    }

                                    return d;
                                })()
                            }
                        ]
                    }


                );
                //echart end
            }
        });

    } else {
        return;
    }
}