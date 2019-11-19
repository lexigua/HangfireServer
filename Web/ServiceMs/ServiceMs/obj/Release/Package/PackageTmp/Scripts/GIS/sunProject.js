var fieldarray = ['Name', 'Address', 'AnnualYield', 'Investment', 'ConstructionUnit', 'ProductionTime', 'GeneratorNum', 'State', 'All'];
var typearray = ['2', '2', '1', '1', '2', '3', '1', '2', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("sun_state1", 0);
    localStorage.setItem("sun_state2", 0);
    localStorage.setItem("sun_state3", 0);
    $("#state0").show();
    $("#state1").hide();
    $("#state2").show();
    $("#state3").hide();
    $("#state4").show();
    $("#state5").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        selectState(sunProjectArry);
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
        var array = ConditionQuery(sunProjectArry, condition, minvalue, maxvalue, type);
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



var sunProjectArry;//太阳能电站数据
var sunProjectLayer;//太阳能图层;
var sunProjectArryRegion;//太阳能区域数据
var ArryCity;
var ArryBasin;
var solar_arealayer;//太阳资源图层
var solar_regionlayer;//专题图图层
var labelPointGraphicLayer;//文本图层
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
    //map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4326 } }), 5);
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    map.centerAndZoom(pt, 5);

    //专题图图层
    var Identifier = "NJFS2";
    var tileMatrixSet = "Custom_NJFS2";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 109.53082999606099, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_solar/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    solar_regionlayer = new ThematicLayer(extent, url, origin);
    map.addLayer(solar_regionlayer);

    //太阳资源图层
    var Identifier = "NJFS";
    var tileMatrixSet = "Custom_NJFS";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 109.53082999606099, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_solar/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    solar_arealayer = new ThematicLayer(extent, url, origin);
    map.addLayer(solar_arealayer);
    solar_regionlayer.hide();
    solar_arealayer.hide();


    borderLayer = new GraphicsLayer();
    map.addLayer(borderLayer);

    sunProjectLayer = new GraphicsLayer();
    map.addLayer(sunProjectLayer);


    //鼠标移动事件，将graphic的样式换为另外一个
    sunProjectLayer.on('mouse-move', function (event) {
        event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 20, 20));
        map.infoWindow.setContent(infowindow_content(event.graphic));
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    sunProjectLayer.on('mouse-out', function (event) {
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

    
    //根据地图等级来设置文本图层的显示与隐藏
    dojo.connect(map, 'onZoomEnd', function () {

        var zoomlevel = map.getZoom();
        if (zoomlevel > 9) {
            labelPointGraphicLayer.show();

        } else {
            labelPointGraphicLayer.hide();
        }
    });
    $.post("/GIS/City/GetCity", function (result) {
        ArryCity = FormatJsonDefault(eval(result));
        $('#data_class_region').datagrid({
            data: ArryCity
        });
    });
    addSiChuanShengBorder();
    postSunProject();
    postSunProjectRegion();
    

});

//请求太阳能点位
function postSunProject() {
    $.post("/GIS/ProjectSolarEnergyStationProject/GetBasinOne", function (result) {   //GetCoalProject
        //var tempArray = JSON.parse(result);
        //console.log(tempArray);
        sunProjectArry = FormatJsonDefault(result);
        //sunProjectArry = JSON.parse(result);
        console.log(sunProjectArry);
          $('#data_list').datagrid({
              data: sunProjectArry
          });
          selectState(sunProjectArry);
    },'json');
}
//请求太阳能行政区域
function postSunProjectRegion() {
    $.post("/GIS/ProjectSolarEnergyStationProject/GetCoalProjectByCoalRegion", function (result) {   //GetCoalProject
        sunProjectArryRegion = FormatJsonDefault(JSON.parse(JSON.parse(result)));
        $('#data_class').datagrid({
            data: sunProjectArryRegion
        });
        addEchart1(sunProjectArryRegion);
        addEchart2(sunProjectArryRegion);
        addEchart3(sunProjectArryRegion);
    });
}

//根据区域筛选太阳能电站数据
function postStationInfo_basin_after(name) {
    if (sunProjectArry.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var sunArryRegion = [];
    $.each(sunProjectArry, function (index, item) {
        if (name == item.Address) {
            sunArryRegion.push(item);
        }
    });
    selectState(sunArryRegion);
}

//根据区域筛选电站数据
function postStationInfo_region_after(code) {
    if (ArryStation.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(arryStation, function (index, item) {
        if (code == item.BelongToRegionCode) {
            arrystation.push(item);
        }
    });
    selectState(arrystation);
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

    //$(".ckLegend").show();
    $(".state_huise").hide();
    ////0表示选中，1表示未选
    localStorage.setItem("sun_state1", 0);
    localStorage.setItem("sun_state2", 0);
    localStorage.setItem("sun_state3", 0);

    $(".legendImg").click(function () {
        var id = $(this)[0].id;
        $(".legendImg").each(function (index, item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (ex.test(num)) {
                    $("#state" + index).hide();
                    $("#state" + (index + 1)).show();
                    localStorage.setItem("sun_state" + (num + 1), 1);
                } else {
                    $("#state" + index).hide();
                    $("#state" + (index - 1)).show();
                    localStorage.setItem("sun_state" + (parseInt(num) + 1), 0);
                }
                $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
                selectState(sunProjectArry);
            }
        });
    });

    //点击tab重新加载全部数据
    $('#tab1 .tabs li a').click(function () {
        $('#data_list').datagrid({
            data: sunProjectArry
        });
        selectState(sunProjectArry);
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
    $("#basin_populationGridLayer").click(function () {
        $("#checkbox").hide();
        if ($("#basin_populationGridLayer").prop("checked") == true) {
            solar_regionlayer.show();
            $("#basin_scslopeareaLayer").prop("checked", false);
            solar_arealayer.hide();
            $(".legend_xz").hide();
            $(".legend_p").show();
            $(".ckLegend").show();
        } else {
            solar_regionlayer.hide();
            $(".legend_p").hide();
        }
    });
    //quyu
    $("#basin_scslopeareaLayer").click(function () {
        $("#checkbox").hide();
        if ($("#basin_scslopeareaLayer").prop("checked") == true) {
            solar_arealayer.show();
            $("#basin_populationGridLayer").prop("checked", false);
            solar_regionlayer.hide();
            $(".legend_p").hide();
            $(".legend_xz").show();
            $(".ckLegend").show();
        } else {
            solar_arealayer.hide();
            $(".legend_xz").hide();
        }
    });

    $('#data_class_region').datagrid({
     
        onClickRow: function (index, row) {
            $.each(ArryCity, function (index, item) {
                if (item.Name == row.Name) {
                    postStationInfo_region_after(item.Code);
                    post(null, item.Code);
                    addBorder(item.Code, 2);
                }
            });
        }
    });

    //数据表格
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_list(sunProjectLayer, row, 0, 'Name', 'State');
            
        }
    });


    $('#tab1').tabs({
        onSelect: function (title, index) {
            console.log(title);
            console.log(index);
            if (index == 0) {
                $('#data_list').datagrid({
                    data: sunProjectArry
                });
                $("#searchinputbox").val("");
            }
            if (index == 1) {
                $('#data_list').datagrid({
                    data: sunProjectArry
                });
                $("#searchinputbox").val("");
            }
            borderLayer.clear();
            selectState(sunProjectArry);
        }
    });

});

function infowindow_content(item) {
    var content = "<ul><li><b>电站名称:</b><span>" + item.attributes.Name
             + "</span></li><li><b>所属区域:</b><span>" + item.attributes.Address
             + "</span></li><li><b>装机数量:</b><span>" + item.attributes.GeneratorNum + " 台"
             + "</span></li><li><b>投资:</b><span>" + item.attributes.Investment + " 万元"
             + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
             + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnit
             + "</span></li><li><b>投产时间:</b><span>" +item.attributes.ProductionTime.substring(0, 10)
             + "</span></li></ul>";
    return content;
}
function addEchart1(Arry) {//
    var myChart1 = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Address);
        arry2.push(item.AnnualYield);
    });
    option = {
        color: ['#4BBC63'],
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
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
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
                name:'单位:WKW'
                
            }
        ],
        series: [
            {
                name: '年发电量',
                type: 'bar',
                data: arry2,
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
function addEchart2(Arry) {//
    var myChart2 = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Address);
        arry2.push(item.Investment);
    });
    option = {
        color: ['#59C9EF'],
        title: {
            text: '投资总额统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
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
                name: '投资额：万元'
            }
        ],
        series: [
            {
                name: '投资额',
                type: 'bar',
                data: arry2
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
function addEchart3(Arry) {//
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Address);
        arry2.push(item.Number);
        arry3.push(item.GeneratorNum);
    });
    option = {
        color: ['#FF855F', '#67D6C1'],
        title: {
            text: '区域电站数量统计',
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
            data: ['电站个数','装机数量'],
            right: 0,
            top: 15,
            itemGap: 2
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
        grid: {
            left: '4%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'value',
                name:'电站个数：个'
            }, , {
                type: 'value',
                name: '装机数量：个',
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
                name: '装机数量',
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
//根据状态图标点击来组合各种显示结果
function selectState(sunProjectArry) {
    var state1 = localStorage.getItem("sun_state1");
    var state2 = localStorage.getItem("sun_state2");
    var state3 = localStorage.getItem("sun_state3");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    //加载图标到地图上
    addpointtomap(SelectByArbitrarily('State', sunProjectArry, array1, array2), 'sunProjectLayer', 'Shape',0,'State',0);
}
