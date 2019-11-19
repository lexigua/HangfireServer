$(function () {
    //设置图表的CSS
    var winW = $("#divMain").width() - 50;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    var mychart3 = $('#mychart3');
    mychart1.css('width', winW / 3 + 'px');
    mychart2.css('width', winW / 3 + 'px');
    mychart3.css('width', winW / 3 + 'px');
});
var fieldarray = ['Name', 'DesignUnits', 'Type', 'State', 'AnnualYield', 'AccessPower', 'SingleCapacity',  'All'];
var typearray = ['2', '2', '2', '2', '1', '1', '1',  '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("b_state1", 0);
    localStorage.setItem("b_state2", 0);
    localStorage.setItem("b_state3", 0);
    $("#state0").show();
    $("#state1").hide();
    $("#state2").show();
    $("#state3").hide();
    $("#state4").show();
    $("#state5").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        selectState(BioStationArry);
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
        var array = ConditionQuery(BioStationArry, condition, minvalue, maxvalue, type);
        selectState(array);
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




var BioProjectLayer;//生物电场图层
var BioStationArry;//区域数组
var BioStationRegionArry;//风区数组
var borderLayer;//边界图层
var ArryCity;//城市数据
var labelPointGraphicLayer;//文本图层
var gra;//用于存储表格点击时获取到的一个graphic
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

    //加载边界
    borderLayer = new GraphicsLayer();
    map.addLayer(borderLayer);

    //生物质电站要素图层
    BioProjectLayer = new GraphicsLayer();
    map.addLayer(BioProjectLayer);

    //鼠标移动事件，将graphic的样式换为另外一个
    BioProjectLayer.on('mouse-move', function (event) {
        event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 20, 20));
        map.infoWindow.setContent(infowindow_content(event.graphic));
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    BioProjectLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
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

    labelPointGraphicLayer = new GraphicsLayer();
    map.addLayer(labelPointGraphicLayer);
    //设置地图的中心点和缩放层级
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    map.centerAndZoom(pt, 5);

    //根据地图等级来设置文本图层的显示与隐藏
    dojo.connect(map, 'onZoomEnd', function () {
        var zoomlevel = map.getZoom();
        if (zoomlevel > 9) {
            labelPointGraphicLayer.show();
        } else {
            labelPointGraphicLayer.hide();
        }
    });
    //加载四川省边界
    addSiChuanShengBorder();
    postBioStation();
    postBioStationRegion();
    postCityBorder();
});
//根据区域筛选水电站数据
function postStationInfo_wind_after(code) {
    if (BioStationArry.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(BioStationArry, function (index, item) {
        if (code == item.Citiy) {
            arrystation.push(item);
        }
    });
    selectState(arrystation);
}

//根据风区筛选水电站数据
function postStationInfo_region_after(code) {
    if (BioStationArry.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(BioStationArry, function (index, item) {
        if (code == item.Address) {
            arrystation.push(item);
        }
    });
    selectState(arrystation);
}
//加载数据表格
function postBioStation() {
    $.post("/GIS/ProjectBioenergySation/GetAllData", function (result) {
        var tempArray = JSON.parse(result);
        BioStationArry = FormatJsonDefault(tempArray);//格式化数据
        selectState(BioStationArry);
        $('#data_list').datagrid({
            data: BioStationArry
        });
        addEchart1(BioStationArry);
        addEchart2(BioStationArry);
        addEchart3(BioStationArry);
    });
}

//加载区域数据
function postBioStationRegion() {
    $.post("/GIS/ProjectBioenergySation/GetAllDataByRegion", function (result) {
        BioStationRegionArry = FormatJsonDefault(JSON.parse(JSON.parse(result)));
        $('#data_class').datagrid({
            data: BioStationRegionArry
        });
    });

}

//加载城市数据
function postCityBorder() {
    $.post("/GIS/City/GetCity", function (result) {
        ArryCity = FormatJsonDefault(eval(result));
    });
}

function addEchart1(Arry) {
    var myChart1 = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Citiy);
        arry2.push(item.InstalledCapacity);
        arry3.push(item.AccessPower);
    });
    option = {
        color: ['#4BBC63', '#59C9EF'],
        title: {
            text: '区域装机容量统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
        },
        legend: {
            x: 'right',
            y: 'top',
            top: 15,
            itemGap: 2,
            data: ['装机容量', '上网容量统计']
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
                name: '装机容量：MW'
            },
            {
                type: 'value',
                name: '上网容量统计：MW',
                splitLine: {
                    splitLine: false
                }
            }
        ],
        grid: {
            left: '7%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [
            {
                name: '装机容量',
                type: 'bar',
                data: arry2
            },
            {
                name: '上网容量统计',
                type: 'line',
                yAxisIndex: 1,
                data: arry3
            }
        ]
    };
    myChart1.setOption(option);
    myChart1.on("click", function (params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_wind_after(item.Name);
                addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
            }
        });
    });
}
function addEchart2(Arry) {
    var myChart2 = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Citiy);
        arry2.push(item.Investment);
    });
    option = {
        color: ['#FF855F'],
        title: {
            text: '工程投资统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
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
                name: '总投资额：万元'
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
                name: '总投资额',
                type: 'bar',
                data: arry2
            }
        ]
    };
    myChart2.setOption(option);
    myChart2.on("click", function (params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_wind_after(item.Name);
                addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
            }
        });
    });
}
function addEchart3(Arry) {
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry2 = []
    $.each(Arry, function (index, item) {
        arry1.push(item.Citiy);
        arry2.push(item.AnnualYield);
    });
    option = {
        color: ['#67D6C1'],
        title: {
            text: '年发电量统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
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
                name: '年发电量：MW·h'
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
                name: '年发电量',
                type: 'bar',
                data: arry2
            }
        ]
    };
    myChart3.setOption(option);
    myChart3.on("click", function (params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_wind_after(item.Name);
                addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
            }
        });
    });
}

function infowindow_content(item) {
    var content = "<ul><li><b>电站名称:</b><span>" + item.attributes.Name
               + "</span></li><li><b>设计单位:</b><span>" + item.attributes.DesignUnits
               + "</span></li><li><b>燃料类型:</b><span>" + item.attributes.Type
               + "</span></li><li><b>项目进展:</b><span>" + item.attributes.State
               + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 兆瓦"
               + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
               + "</span></li><li><b>上网电量:</b><span>" + item.attributes.AccessPower + " 兆瓦·时"
               + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 兆瓦"
               + "</span></li></ul>";
    return content;

}
//状态按钮点击事件
$(function () {
    //数据表格分页
    $('#data_list').datagrid({ loadFilter: pagerFilter });
    //点击tab重新加载全部数据
    $('#tab1 .tabs li a').click(function () {
        selectState(BioStationArry);
    });
    //数据表格点击
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_list(BioProjectLayer, row, 0, 'Name', 'State');
        }
    });

    //根据区域筛选
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            $.each(ArryCity, function (index, item) {
                if (item.Name == row.Citiy) {
                    postStationInfo_wind_after(item.Name);
                    addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
                }
            });
        }
    });
    //根据生物区筛选
    $('#data_class_region').datagrid({
        onClickRow: function (index, row) {
            $.each(windStationRegionArry, function (index, item) {
                if (item.Address == row.Address) {
                    postStationInfo_region_after(item.Address);
                    addBorder(item.Address, windStationRegionArry);
                }
            });
        }
    });//根据点击TAB联动下方表格
    $('#tab1').tabs({
        onSelect: function (title, index) {
            $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
            if (index == 0) {
                addEchart1(BioStationArry);
                addEchart2(BioStationArry);
                addEchart3(BioStationArry);
            } else if (index == 1) {//切换过程中应该重新绘制图形
                addEchart1(BioStationArry);
                addEchart2(BioStationArry);
                addEchart3(BioStationArry);
            }
            borderLayer.clear();
        }
    });
    $(".state_huise").hide();
    //0表示选中，1表示未选
    localStorage.setItem("b_state1", 0);
    localStorage.setItem("b_state2", 0);
    localStorage.setItem("b_state3", 0);

    $(".legendImg").click(function () {
        var id = $(this)[0].id;
        $(".legendImg").each(function (index, item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (ex.test(num)) {
                    $("#state" + index).hide();
                    $("#state" + (index + 1)).show();
                    localStorage.setItem("b_state" + (num + 1), 1);
                } else {
                    $("#state" + index).hide();
                    $("#state" + (index - 1)).show();
                    localStorage.setItem("b_state" + (parseInt(num) + 1), 0);
                }
                $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
                selectState(BioStationArry);
            }
        });
    });
});
//列举可能出现的选择情况
function selectState(AtationArray) {
    var state1 = localStorage.getItem("b_state1");
    var state2 = localStorage.getItem("b_state2");
    var state3 = localStorage.getItem("b_state3");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    addpointtomap(SelectByArbitrarily('State', AtationArray, array1, array2), 'BioProjectLayer', 'Shape', 0, 'State',0);
}
