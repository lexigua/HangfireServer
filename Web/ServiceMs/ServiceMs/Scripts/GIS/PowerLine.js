
$(function () {
    var winW = $("#divMain").width() - 10;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    mychart1.css('width', winW / 2 + 'px');
    mychart2.css('width', winW / 2 + 'px');
});
var fieldarray = ['Name', 'StartPoint', 'EndPoint', 'Length', 'Maxtransmission', 'AnnTransVol', 'LoadRate', 'Type', 'ProductionTime', 'All'];
var typearray = ['2', '2', '2', '1', '1', '1', '1', '2','3', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("p_legend1", 0);
    localStorage.setItem("p_legend2", 0);
    localStorage.setItem("p_legend3", 0);
    localStorage.setItem("p_legend4", 0);
    localStorage.setItem("p_legend5", 0);
    localStorage.setItem("p_state6", 0);
    localStorage.setItem("p_state7", 0);
    localStorage.setItem("p_state8", 0);
    $("#legend0").show();
    $("#legend1").hide();
    $("#legend2").show();
    $("#legend3").hide();
    $("#legend4").show();
    $("#legend5").hide();
    $("#legend6").show();
    $("#legend7").hide();
    $("#legend8").show();
    $("#legend9").hide();
    $("#state10").show();
    $("#state11").hide();
    $("#state12").show();
    $("#state13").hide();
    $("#state14").show();
    $("#state15").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        if (tabtip == 0) {
            selectlegend(PowerStationArry);//图例选择
        } else {
            selectState(PowerStationArry);//状态选择
        }
    } else {
        $.each(fieldarray, function (index, item) {
            if (item == values) {
                type = typearray[index];
            }
        });
        var minvalue = '';
        var maxvalue = '';
        if (type == 1) {
            minvalue = $("#minvalue").val();
            maxvalue = $("#maxvalue").val();
        } else if (type == 3) {
            minvalue = $("#datesStart + .textbox .textbox-value").val();
            maxvalue = $("#datesEnd + .textbox .textbox-value").val();
        } else if (type == 2) {
            minvalue = $("#nametext").val();
            maxvalue = "";
        }
        var condition = values;
        var array = ConditionQuery(PowerStationArry, condition, minvalue, maxvalue, type);
        if (tabtip == 0) {
            selectlegend(array);//图例选择
        } else {
            selectState(array);//状态选择
        }
    }
});
$(function () {
    document.onkeydown = function (e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $('#searchbutton').click();
        }
    }
});



var tabtip = 0;//初始化图例选择的tab值
var PowerProjectLayer;//输电线图层
var PowerStationArry;//表格数据数组
var PowerStationRegionArry;//类别数组
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");

require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "esri/layers/GraphicsLayer"], function (Map, InfoWindow, TDTRoadLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer) {
    map = new Map("map",
    {
        logo: false,
        center: [104.0706, 30.164789],
        minZoom: 6
    });
    baseMap_roadLayer = new TDTRoadLayer();
    map.addLayer(baseMap_roadLayer);
    baseMap_annoLayer = new TDTAnnoLayer();
    map.addLayer(baseMap_annoLayer);
    baseMap_imageLayer = new TDTImageLayer();
    map.addLayer(baseMap_imageLayer);
    baseMap_imageLayer.hide();

    PowerProjectLayer = new GraphicsLayer();
    map.addLayer(PowerProjectLayer);


    //鼠标移动事件，将graphic的样式换为另外一个
    PowerProjectLayer.on('mouse-move', function (event) {
        //console.log('你经过了一个graphic');
        var index = event.graphic.attributes.ProductionTime.indexOf("T");
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 3);
        event.graphic.setSymbol(lineSymbol)
        var content = "<ul><li><b>名称:</b><span>" + ((event.graphic.attributes.Name == null || event.graphic.attributes.Name == "") ? "暂无" : event.graphic.attributes.Name)
                   + "</span></li><li><b>起点:</b><span>" + ((event.graphic.attributes.StartPoint == null || event.graphic.attributes.StartPoint == "") ? "暂无" : event.graphic.attributes.StartPoint)
                   + "</span></li><li><b>终点:</b><span>" + ((event.graphic.attributes.EndPoint == null || event.graphic.attributes.EndPoint == "") ? "暂无" : event.graphic.attributes.EndPoint)
                   + "</span></li><li><b>长度:</b><span>" + ((event.graphic.attributes.Length == null || event.graphic.attributes.Length == "") ? "暂无" : event.graphic.attributes.Length)
                   + "</span></li><li><b>设计输送容:</b><span>" + ((event.graphic.attributes.Maxtransmission == null || event.graphic.attributes.Maxtransmission == "") ? "暂无" : event.graphic.attributes.Maxtransmission)
                   + "</span></li><li><b>年输送量:</b><span>" + ((event.graphic.attributes.AnnTransVol == null || event.graphic.attributes.AnnTransVol == "") ? "暂无" : event.graphic.attributes.AnnTransVol)
                   + "</span></li><li><b>负载:</b><span>" + ((event.graphic.attributes.LoadRate == null || event.graphic.attributes.LoadRate == "") ? "暂无" : event.graphic.attributes.LoadRate)
                   + "</span></li><li><b>类别:</b><span>" + ((event.graphic.attributes.Type == null || event.graphic.attributes.Type == "") ? "暂无" : event.graphic.attributes.Type)
                   + "</span></li><li><b>投产时间:</b><span>" + ((event.graphic.attributes.ProductionTime == null || event.graphic.attributes.ProductionTime == "") ? "暂无" : event.graphic.attributes.ProductionTime.substring(0, index));
        map.infoWindow.setContent(content);
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    PowerProjectLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var lineSymbol;
        if (tabtip == 0) {
            if (event.graphic.attributes.Type == "500kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([164, 102, 250]), 2);
            } else if (event.graphic.attributes.Type == "220kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([175, 180, 219]), 2);
            }
            else if (event.graphic.attributes.Type == "35kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([144, 212, 83]), 2);
            }
            else if (event.graphic.attributes.Type == "110kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([122, 185, 0]), 2);
            }
            else if (event.graphic.attributes.Type == "特高压") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 2);
            }
        } else {
            if (event.graphic.attributes.State == "已建")
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([221, 101, 114]), 2);
            if (event.graphic.attributes.State == "在建")
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([234, 128, 16]), 2);
            if (event.graphic.attributes.State == "规划")
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([157, 85, 184]), 2);
        }


        event.graphic.setSymbol(lineSymbol);
        map.infoWindow.hide();
    });


    //设置地图的中心点和缩放层级
    //map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } }), 5);
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    pt = esri.geometry.geographicToWebMercator(pt);
    map.centerAndZoom(pt, 5);

    //加载四川省边界
    addSiChuanShengBorder();
    postPowerLine();
    postPowerLineRegion();
    //根据风区筛选水电站数据

});
//加载数据表格
function postPowerLine() {
    $.post("/GIS/ProjectPowerLine/GetAllData", function (result) {
        var temparr = eval(result);
        var temparray = [];
        $.each(temparr, function (index, item) {
            var length = item.Length.toFixed(2);
            temparray.push({ Name: item.Name, Length: length, ProductionTime: item.ProductionTime, Shape: item.Shape, Maxtransmission: item.Maxtransmission, LoadRate: item.LoadRate, Type: item.Type, State: item.State, ShpLen: item.ShpLen, AnnTransVol: item.AnnTransVol, StartPoint: item.StartPoint, EndPoint: item.EndPoint });
        });
        PowerStationArry = temparray;
        addPowerLine(PowerStationArry);
        $('#data_list').datagrid({
            data: PowerStationArry
        });
    });
}
//加载区域数据
function postPowerLineRegion() {
    $.post("/GIS/ProjectPowerLine/CountByType", function (result) {
        PowerStationRegionArry = FormatJsonDefault(eval(result));
        var powerline = PowerStationRegionArry;
        //$.each(PowerStationRegionArry, function (index, obj) {
        //    var length = obj.Length.toFixed(2);
        //    var objpowerline = { Type: obj.Type, Length: length, Num: obj.Num, Maxtransmission: obj.Maxtransmission, AnnTransVol: obj.AnnTransVol, LoadRate: obj.LoadRate };
        //    powerline.push(objpowerline);

        //});
        $('#data_class').datagrid({
            data: powerline
        });
        addEchart1(powerline);
        addEchart2(powerline);
    });
}
//加载输电线数据
function addPowerLine(res) {
    PowerProjectLayer.clear();
    map.infoWindow.hide();
    console.log("length:" + res.length);
    $('#data_list').datagrid({
        data: res
    });
    if (res.length == 0) return;
    $.each(res, function (index, obj) {
        var wkt = new Wkt.Wkt();
        wkt.read(obj.Shape);
        var config = {
            spatialReference: {
                wkid: 4490
            },
            editable: false
        };
        var lineSymbol;
        if (tabtip == 0) {
            if (obj.Type == "500kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([164, 102, 250]), 2);
            } else if (obj.Type == "220kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([175, 180, 219]), 2);
            } else if (obj.Type == "35kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([144, 212, 83]), 2);
            } else if (obj.Type == "110kV") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([122, 185, 0]), 2);
            } else if (obj.Type == "特高压") {
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 2);
            }
        }
        if (tabtip == 1) {
            if (obj.State == "已建")
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([221, 101, 114]), 2);
            if (obj.State == "在建")
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([234, 128, 16]), 2);
            if (obj.State == "规划")
                lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([157, 85, 184]), 2);
        }
        var polygon = wkt.toObject(config);
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = polygon;
        graphicWeb.attributes = obj;
        graphicWeb.setSymbol(lineSymbol);
        PowerProjectLayer.add(graphicWeb);
    });


    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(PowerProjectLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });

}
function addEchart1(Arry) { //
    var myChart1 = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Type);
        arry2.push(item.Length);
        arry3.push(item.Num);
    });
    console.log(arry2);
    console.log(arry1);
    var option = {
        color: ['#4BBC63', '#59C9EF'],
        title: {
            text: '输电线路长度与数量统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            //trigger: 'axis'

        },
        legend: {
            x: 'right',
            y: 'top',
            top: 15,
            itemGap: 2,
            data: ['长度', '数量']
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: arry1
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '长度：千米'
            }, {
                'type': 'value',
                'name': '数量：根'
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [
            {
                name: '长度',
                type: 'bar',
                data: arry2,
                barWidth: 30
            },
            {
                name: '数量',
                yAxisIndex: 1,
                type: 'bar',
                data: arry3,
                barWidth: 30
            }
        ]
    };

    myChart1.setOption(option);
    myChart1.on("click", function(params) {
        $.each(PowerStationRegionArry, function (index, item) {
            if (item.Type == params.name) {
                postStationInfo_wind_after(item.Type);
            }
        });
    });
}

function addEchart2(Arry) { //
    var myChart2 = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Type);
        arry2.push(item.Maxtransmission);
        arry3.push(item.LoadRate);
        arry4.push(item.AnnTransVol);
    });
    console.log(arry2);
    console.log(arry1);
    var option = {
        color: ['#FF855F', '#67D6C1', '#9966CC'],
        title: {
            text: '输电线路年输送量与负载统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            //trigger: 'axis'

        },
        legend: {
            x: 'right',
            y: 'top',
            top: 15,
            itemGap: 2,
            data: ['最大传输功率', '负载', '年传送体积']
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: arry1
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '输送量：万千瓦·时'
            }, {
                type: 'value',
                name: '年输送体积：立方千米',
                splitLine: {
                    splitLine: false
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [
            {
                name: '最大传输功率',
                type: 'bar',
                data: arry2,
                barWidth: 30
            },
            {
                name: '负载',
                type: 'line',
                yAxisIndex: 1,
                data: arry3
            }, {
                name: '年传送体积',
                type: 'line',
                yAxisIndex: 1,
                data: arry4
            }
        ]
    };

    myChart2.setOption(option);
    myChart2.on("click", function (params) {
        $.each(PowerStationRegionArry, function (index, item) {
            if (item.Type == params.name) {
                postStationInfo_wind_after(item.Type);
            }
        });
    });
}

$(function () {
    //左侧tab切换事件

    $("#tab4").tabs({
        onSelect: function (title, index) {
            $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
            if (index == 0) {
                tabtip = 0;
                selectlegend(PowerStationArry); //图例选择
            } else if (index == 1) {
                tabtip = 1;
                selectState(PowerStationArry); //状态选择
            }
        }
    });
    //图例筛选触发事件
    $(".legend_huise").hide();
    localStorage.setItem("p_legend1", 0);
    localStorage.setItem("p_legend2", 0);
    localStorage.setItem("p_legend3", 0);
    localStorage.setItem("p_legend4", 0);
    localStorage.setItem("p_legend5", 0);
    $(".state_huise").hide();
    //0表示选中，1表示未选
    localStorage.setItem("p_state6", 0);
    localStorage.setItem("p_state7", 0);
    localStorage.setItem("p_state8", 0);

    $(".legendImg").click(function () {
        var id = $(this)[0].id;
        $(".legendImg").each(function (index, item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (id.indexOf("state") >= 0) {
                    if (ex.test(num)) {
                        $("#state" + index).hide();
                        $("#state" + (index + 1)).show();
                        localStorage.setItem("p_state" + (num + 1), 1);
                    } else {
                        $("#state" + index).hide();
                        $("#state" + (index - 1)).show();
                        localStorage.setItem("p_state" + (parseInt(num) + 1), 0);
                    }
                    $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
                    selectState(PowerStationArry);
                } else {
                    if (ex.test(num)) {
                        $("#legend" + index).hide();
                        $("#legend" + (index + 1)).show();
                        localStorage.setItem("p_legend" + (num + 1), 1);
                    } else {
                        $("#legend" + index).hide();
                        $("#legend" + (index - 1)).show();
                        localStorage.setItem("p_legend" + (parseInt(num) + 1), 0);
                    }
                    $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
                    selectlegend(PowerStationArry);
                }
            }
        });
    });


    $('#tab1 .tabs li a').click(function () {
        $('.legend_550').show();
        $('.legend').show();
        $('.legend_35').show();
        $('.legend_110').show();
        $('.legend_high').show();
        $('#data_list').datagrid({
            data: PowerStationArry
        });
        addPowerLine(PowerStationArry);
    }
    );
    $('#divid').click(function () {
        alert('ok');
    })
    //分页
    $('#data_list').datagrid({ loadFilter: pagerFilter });
    //数据表格
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            console.log(row);
            $.each(PowerStationArry, function (index, item) {
                if (item.Length == row.Length) {
                    var piot = item.ProductionTime.indexOf("T");
                    var content = "<ul><li><b>名称:</b><span>" + ((item.Name == null || item.Name == "") ? "暂无" : item.Name)
                        + "</span></li><li><b>起点:</b><span>" + ((item.StartPoint == null || item.StartPoint == "") ? "暂无" : item.StartPoint)
                        + "</span></li><li><b>终点:</b><span>" + ((item.EndPoint == null || item.EndPoint == "") ? "暂无" : item.EndPoint)
                        + "</span></li><li><b>长度:</b><span>" + ((item.Length == null || item.Length == "") ? "暂无" : item.Length)
                        + "</span></li><li><b>设计输送容:</b><span>" + ((item.Maxtransmission == null || item.Maxtransmission == "") ? "暂无" : item.Maxtransmission)
                        + "</span></li><li><b>年输送量:</b><span>" + ((item.AnnTransVol == null || item.AnnTransVol == "") ? "暂无" : item.AnnTransVol)
                        + "</span></li><li><b>负载:</b><span>" + ((item.LoadRate == null || item.LoadRate == "") ? "暂无" : item.LoadRate)
                        + "</span></li><li><b>类别:</b><span>" + ((item.Type == null || item.Type == "") ? "暂无" : item.Type)
                        + "</span></li><li><b>投产时间:</b><span>" + ((item.ProductionTime == null || item.ProductionTime == "") ? "暂无" : item.ProductionTime.substring(0, piot));
                    map.infoWindow.setContent(content);
                    map.infoWindow.setTitle("详情");
                    var wkt = new Wkt.Wkt();
                    wkt.read(item.Shape);
                    var config = {
                        spatialReference: {
                            wkid: 4490
                        },
                        editable: false
                    };
                    var pt = wkt.toObject(config);
                    console.log(pt.getExtent());
                    console.log(pt.getExtent().ymax);
                    var point = new esri.geometry.Point(pt.getExtent().xmax, pt.getExtent().ymax, map.spatialReference);
                    map.setExtent(pt.getExtent());
                    map.infoWindow.show(point);
                    return;
                }
            });
        }
    });
    //根据类别筛选
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            console.log(row);
            $.each(PowerStationRegionArry, function (index, item) {
                if (item.Type == row.Type) {
                    console.log(item.Type);
                    postStationInfo_wind_after(item.Type);
                    //addBorder(item.Type, 1); //添加边界之后，面图层在上，点图层在下
                }
            });
        }
    });
    //根据风区筛选
    $('#data_class_region').datagrid({
        onClickRow: function (index, row) {
            console.log(windStationArry);
            console.log("你点击了" + row.Address);
            $.each(windStationRegionArry, function (index, item) {
                if (item.Address == row.Address) {
                    postStationInfo_region_after(item.Address);
                }
            });
        }
    });
    $('#tab1').tabs({
        onSelect: function (title, index) {
            console.log(title);
            console.log(index);
            $('.legend_550').show();
            $('.legend').show();
            $('.legend_35').show();
            $('.legend_110').show();
            $('.legend_high').show();
            if (index == 0) {
                $('#data_list').datagrid({
                    data: PowerStationArry
                });
                $("#searchinputbox").val("");
            }
            if (index == 1) {
                $('#data_list').datagrid({
                    data: PowerStationArry
                });
                $("#searchinputbox").val("");
            }

            addPowerLine(PowerStationArry);
        }
    });
});

//根据图例筛选数据
    function selectlegend(arrystation) {
        var arrystation1 = [];
        var arry1 = ["特高压", "500kV", "220kV", "110kV", "35kV"];
        var legend1 = localStorage.getItem("p_legend1");
        var legend2 = localStorage.getItem("p_legend2");
        var legend3 = localStorage.getItem("p_legend3");
        var legend4 = localStorage.getItem("p_legend4");
        var legend5 = localStorage.getItem("p_legend5");
        var arry2 = [legend1, legend2, legend3, legend4, legend5];
        $.each(arry2, function(index, item) {
            if (item == "0") {
                $.each(arrystation, function(index1, obj) {
                    if (obj.Type == arry1[index]) {
                        arrystation1.push(obj);
                    }
                });
            }

    });
    addPowerLine(arrystation1);
}

//列举可能出现的选择情况
function selectState(atationArray) {
    var state1 = localStorage.getItem("p_state6");
    var state2 = localStorage.getItem("p_state7");
    var state3 = localStorage.getItem("p_state8");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    addPowerLine(SelectByArbitrarily('State', atationArray, array1, array2));
}

//根据区域筛选输电线路数据
function postStationInfo_wind_after(code) {
    if (PowerStationArry.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(PowerStationArry, function (index, item) {
        if (code == item.Type) {
            arrystation.push(item);
        }
    });
    selectState(arrystation);
}


