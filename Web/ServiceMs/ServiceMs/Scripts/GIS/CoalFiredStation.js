var fieldarray = ['Name', 'Address', 'ConstructionUnit', 'InternetVoltage', 'Carbondioxide', 'Hydride', 'Dust', 'ProductionTime', 'All'];
var typearray = ['2', '2', '2', '1', '1', '1', '1', '3', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("c_state1", 0);
    localStorage.setItem("c_state2", 0);
    localStorage.setItem("c_state3", 0);
    $("#state0").show();
    $("#state1").hide();
    $("#state2").show();
    $("#state3").hide();
    $("#state4").show();
    $("#state5").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        State_Situation(CoalFiredProjectArry);
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
        var array = ConditionQuery(CoalFiredProjectArry, condition, minvalue, maxvalue, type);
        State_Situation(array);
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



var CoalFiredProjectArry;//燃煤电站数据
var CoalFiredProjectLayer;//燃煤电站图层;
var GetByTypeArray;//根据类型获取数据
var CoalFiredProjectArryRegion;//燃煤电站区域数据
var ArryCity;
var ArryBasin;
var labelPointGraphicLayer;//文本图层
var coal_arealayer;
var gra;//用于存储表格点击时获取到的一个graphic
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
dojo.require("extras.ThematicLayer");
require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer", "extras/ThematicLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "esri/layers/GraphicsLayer"], function (Map, InfoWindow, TDTRoadLayer, ThematicLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer) {
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

    labelPointGraphicLayer = new GraphicsLayer();
    map.addLayer(labelPointGraphicLayer);
    //设置地图的中心点和缩放层级
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    pt = esri.geometry.geographicToWebMercator(pt);
    map.centerAndZoom(pt, 5);

    borderLayer = new GraphicsLayer();
    map.addLayer(borderLayer);

    CoalFiredProjectLayer = new GraphicsLayer();
    map.addLayer(CoalFiredProjectLayer);

    //鼠标移动事件，将graphic的样式换为另外一个
    CoalFiredProjectLayer.on('mouse-move', function (event) {
        event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 20, 20));       
        map.infoWindow.setContent(infowindow_content(event.graphic));
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    CoalFiredProjectLayer.on('mouse-out', function (event) {
        var symbol;
        if (event.graphic.attributes.State == '规划') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/planning.png", 15, 15);
        } else if (event.graphic.attributes.State == '在建') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/building.png", 15, 15);
        } else if (event.graphic.attributes.State == '已建') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/builded.png", 15, 15);
        }
        event.graphic.setSymbol(symbol);
        map.infoWindow.hide();
    });

    //根据地图等级来设置文本图层的显示与隐藏
    dojo.connect(map, 'onZoomEnd', function () {
        var zoomlevel = map.getZoom();
        if (zoomlevel > 9) {
            labelPointGraphicLayer.show();
        } else {
            labelPointGraphicLayer.hide();
        }
    });
    //请求行政区划数据
    $.post("/GIS/City/GetCity", function (result) {
        ArryCity = FormatJsonDefault(eval(result));
    });

    addSiChuanShengBorder();
    postCoalFiredProject();
    postCoalFiredProjectRegion();
    postGetDataProjectByType();
    //添加专题图图层
    var Identifier = "MTCS";
    var tileMatrixSet = "Custom_MTCS";
    var extent = new esri.geometry.Extent(100.96736581498045, 26.42466067804793, 108.29276455344144, 32.53580121915098, new esri.SpatialReference({ wkid: 4326 }));
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-MTCS/wmts_tianditu";
    var origin = { "x": 100.96736581498045, "y": 32.53580121915098 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    coal_arealayer = new ThematicLayer(extent, url, origin);
    map.addLayer(coal_arealayer);
    coal_arealayer.hide();
});

//请求火力电站点位
function postCoalFiredProject() {
    $.post("/GIS/ProjectCoalFiredStation/GetBasinOne", function (result) {   //GetCoalProject
        var tempArray = JSON.parse(result);
        CoalFiredProjectArry = FormatJsonDefault(tempArray);
        $('#data_list').datagrid({
            data: CoalFiredProjectArry
        });
        State_Situation(CoalFiredProjectArry);//地图上加载全部点位
    });
}
//请求火力电站行政区域分布数据
function postCoalFiredProjectRegion() {
    $.post("/GIS/ProjectCoalFiredStation/GetCoalProjectByCoalRegion", function (result) {   //GetCoalProject
        CoalFiredProjectArryRegion = FormatJsonDefault(JSON.parse(JSON.parse(result)));
        $('#data_class').datagrid({
            data: CoalFiredProjectArryRegion
        });
        addEchart1(CoalFiredProjectArryRegion);
        addEchart2(CoalFiredProjectArryRegion);
        addEchart3(CoalFiredProjectArryRegion);
    });
}
//请求火力电站类型分布数据
function postGetDataProjectByType() {
    $.post("/GIS/ProjectCoalFiredStation/GetDataProjectByType", function (result) {
        GetByTypeArray = JSON.parse(JSON.parse(result));
        $('#data_class_sunregion').datagrid({
            data: GetByTypeArray
        });
    });
}

//根据区域筛选火力电站数据
function postStationInfo_basin_after(name) {
    if (CoalFiredProjectArry.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var CoalFiredArryRegion = [];
    $.each(CoalFiredProjectArry, function (index, item) {
        if (name == item.Address) {
            CoalFiredArryRegion.push(item);
        }
    });
    State_Situation(CoalFiredArryRegion);
}

//根据类型筛选水电站数据
function postStationInfo_type_after(code) {
    if (CoalFiredProjectArry.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(CoalFiredProjectArry, function (index, item) {
        if (code == item.Type) {
            arrystation.push(item);
        }
    });
    State_Situation(arrystation);
}


$(function () {
    $(".ckLegend").hide();
    $(".legend_xz").hide();
    //点击tab重新加载全部数据
    $('#tab1 .tabs li a').click(function () {
        $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
        State_Situation(CoalFiredProjectArry);
    });
    //数据表格分页
    $('#data_list').datagrid({ loadFilter: pagerFilter });

    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            $.each(ArryCity, function (index, item) {
                if (item.Name == row.Address) {
                    postStationInfo_basin_after(item.Name);
                    addBorder(item.Name, ArryCity);
                }
            });
        }
    });


    //显示与隐藏煤炭资源专题图
    $("#basin_populationGridLayer").click(function () {
        $("#checkbox").hide();
        if ($("#basin_populationGridLayer").prop("checked") == true) {
            coal_arealayer.show();
            $("#checkbox").hide();
            $(".ckLegend").show();
            $(".legend_xz").show();
        } else {
            coal_arealayer.hide();
            $("#checkbox").hide();
            $(".ckLegend").hide();
            $(".legend_xz").hide();
        }
    });
    $('#data_class_sunregion').datagrid({
        onClickRow: function (index, row) {
            $.each(CoalFiredProjectArry, function (index, item) {
                if (item.Type == row.Type) {
                    postStationInfo_type_after(item.Type);
                }
            });
        }
    });

    //数据表格
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_list(CoalFiredProjectLayer, row,0, 'Name', 'State');
        }
    });

    $('#tab1').tabs({
        onSelect: function (title, index) {
            if (index == 0) {
                addEchart1(CoalFiredProjectArryRegion);
                addEchart2(CoalFiredProjectArryRegion);
                addEchart3(CoalFiredProjectArryRegion);
            }
            if (index == 1) {
                addEchart1(CoalFiredProjectArryRegion);
                addEchart2(CoalFiredProjectArryRegion);
                addEchart3(CoalFiredProjectArryRegion);
            }
            $("#searchinputbox").val("");
            borderLayer.clear();
        }
    });

});
function infowindow_content(item) {
    var content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
             + "</span></li><li><b>所在地:</b><span>" + item.attributes.Address
             + "</span></li><li><b>投资主体:</b><span>" +  item.attributes.ConstructionUnit
             + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 兆瓦"
             + "</span></li><li><b>上网电压:</b><span>" + item.attributes.InternetVoltage + " 千伏"
             + "</span></li><li><b>二氧化碳排量:</b><span>" + item.attributes.Carbondioxide + " 吨"
             + "</span></li><li><b>氢化物排量:</b><span>" + item.attributes.Hydride + " 吨"
             + "</span></li><li><b>粉尘排量:</b><span>" + item.attributes.Dust + " 吨"
             + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
             + "</span></li></ul>";
    return content;
}
function addEchart1(Arry) {
    var myChart1 = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Address);
        arry2.push(item.InstalledCapacity);
        arry3.push(item.InternetVoltage);
    });
    option = {
        color: ['#4BBC63', '#59C9EF'],
        title: {
            text: '区域年发电量统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['装机容量', '上网电压'],
            right: 0,
            top: 15,
            itemGap: 2,
        },

        calculable: true,
        xAxis: [
        {
            type: 'category',
            data: arry1,
            axisLabel: {
                show: true,
                interval: 0
            }
        }
        ],
        yAxis: [
            {
                type: 'value',
                name: '装机容量:WKW'
            }, , {
                type: 'value',
                name: '上网电压：kV',
                splitLine: {
                    splitLine: false
                }
            }
        ],
        series: [
            {
                name: '装机容量',
                type: 'bar',
                data: arry2
            }, {
                name: '上网电压',
                type: 'line',
                yAxisIndex: 1,
                data: arry3
            }
        ]
    };

    myChart1.setOption(option);
    myChart1.on("click", function(params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_basin_after(item.Name);
                addBorder(item.Name, ArryCity);
            }
        });
    });
}

function addEchart2(Arry) {
    var myChart2 = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [], arry3 = [],arry4=[];
    $.each(Arry, function (index, item) {
        arry1.push(item.Address);
        arry2.push(item.Carbondioxide);
        arry3.push(item.Hydride);
        arry4.push(item.Dust);
    });
    option = {
        color: ['#FF855F', '#67D6C1', '#9966CC'],
        title: {
            text: '废气排放统计图',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['二氧化碳排量', '氢化物排量', '粉尘排量'],
            right: 0,
            top: 15,
            itemGap: 2,
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: arry1,
                axisLabel: {
                    show: true,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位：WKW'
            }
        ],
        series: [
            {
                name: '二氧化碳排量',
                type: 'bar',
                data: arry2
            }, {
                name: '氢化物排量',
                type: 'bar',
                data: arry3
            }, {
                name: '粉尘排量',
                type: 'bar',
                data: arry4
            }
        ]
    };

    myChart2.setOption(option);
    myChart2.on("click", function (params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_basin_after(item.Name);
                addBorder(item.Name, ArryCity);
            }
        });
    });
}

function addEchart3(Arry) {
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Address);
        arry2.push(item.Number);
        arry3.push(item.InstalledCapacity);
    });
    option = {
        color: ['#6699FF', '#F7C263'],
        title: {
            text: '区域电站个数统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['电站个数','装机容量'],
            right: 0,
            top: 15,
            itemGap: 2,
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: arry1,
                axisLabel: {
                    show: true,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位：个'
            }, {
                type: 'value',
                name: '装机容量：MW',
                splitLine: {
                    splitLine: false
                }
            }
        ],
        series: [
            {
                name: '电站个数',
                type: 'bar',
                data: arry2
            }, {
                name: '装机容量',
                type: 'line',
                yAxisIndex: 1,
                data: arry3
            }
        ]
    };

    myChart3.setOption(option);
    myChart3.on("click", function (params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_basin_after(item.Name);
                addBorder(item.Name, ArryCity);
            }
        });
    });
}


$(function () {
    //设置图表的CSS
    var winW = $("#divMain").width() - 20;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    var mychart3 = $('#mychart3');
    mychart1.css('width', winW / 3 + 'px');
    mychart2.css('width', winW / 3 + 'px');
    mychart3.css('width', winW / 3 + 'px');

    $(".state_huise").hide();
    //0表示选中，1表示未选
    localStorage.setItem("c_state1", 0);
    localStorage.setItem("c_state2", 0);
    localStorage.setItem("c_state3", 0);

    $(".legendImg").click(function () {
        var id = $(this)[0].id;
        $(".legendImg").each(function (index, item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (ex.test(num)) {
                    $("#state" + index).hide();
                    $("#state" + (index + 1)).show();
                    localStorage.setItem("c_state" + (num + 1), 1);
                } else {
                    $("#state" + index).hide();
                    $("#state" + (index - 1)).show();
                    localStorage.setItem("c_state" + (parseInt(num) + 1), 0);
                }
                $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
                State_Situation(CoalFiredProjectArry);
            }
        });
    });
});
//分析状态可能出现的组合情况
//列举可能出现的选择情况
function State_Situation(AtationArray) {
    var state1 = localStorage.getItem("c_state1");
    var state2 = localStorage.getItem("c_state2");
    var state3 = localStorage.getItem("c_state3");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    addpointtomap(SelectByArbitrarily('State', AtationArray, array1, array2), 'CoalFiredProjectLayer', 'Shape',0,'State',0);
}
