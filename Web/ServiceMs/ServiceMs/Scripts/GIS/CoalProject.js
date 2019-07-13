$(function () {
    var winW = $("#divMain").width() - 50;
    var mychart3 = $('#mychart3');
    mychart3.css('width', winW + 'px');
});
var fieldarray = ['Name', 'OwnedEnterprises', 'BelongToCity', 'MainCoalSpecies', 'RecoverableReserves', 'ExploreMode', 'LiftingMode', 'BacktoCollectionRate', 'All'];
var typearray = ['2', '2', '2', '2', '1', '2', '2', '1', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        addCoalProject(coalProjectArry);
        $('#data_list').datagrid({
            data: coalProjectArry
        });
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
        var array = ConditionQuery(coalProjectArry, condition, minvalue, maxvalue, type);
        addCoalProject(array);
        $('#data_list').datagrid({
            data: array
        });
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



var coalProjectArry;  //煤矿的数据
var coalProjectLayer;//煤矿图层
var coalRegionArry;//矿区数据
var regionLayer;//区域边界和矿区边界图层
var coal_regionNum;//每个区域有多少个煤矿。生产能力.区域可采储量
var coal_coalregionNum;//每个矿区有多少个煤矿。生产能力。区域可采储量
var ArryCity;//城市数据
var borderLayer;//城市边界图层
var cityarr = [];//存放城市名称数组
var wmtsLayer_region;
var Coal_ProjectLayer;
var coallayer;
var symbol;//定义符号变量
var tar = [];//用于存储智能提示词条
var gra;//用于存储表格点击时获取的graphic
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

    //加载风区边界
    borderLayer = new GraphicsLayer();
    map.addLayer(borderLayer);

    regionLayer = new GraphicsLayer();
    map.addLayer(regionLayer);

    coalProjectLayer = new GraphicsLayer();
    map.addLayer(coalProjectLayer);

    //鼠标移动事件，将graphic的样式换为另外一个
    coalProjectLayer.on('mouse-move', function (event) {
        //console.log('你经过了一个graphic');
        //ipos = event.graphic.attributes.ProductionTime.indexOf("T");
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 1);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 255, 255, 1]));
        event.graphic.setSymbol(polySymbol)
        var content = "<ul><li><b>煤矿名称:</b><span>" + event.graphic.attributes.Name
                           + "</span></li><li><b>所属区域:</b><span>" + event.graphic.attributes.Name
                           + "</span></li><li><b>生产能力:</b><span>" + event.graphic.attributes.AnnualManufacturability + " 万吨"
                           + "</span></li><li><b>主要煤种:</b><span>" + event.graphic.attributes.MainCoalSpecies
                           + "</span></li><li><b>可采储量:</b><span>" + event.graphic.attributes.RecoverableReserves + " 万吨"
                           + "</span></li><li><b>开拓方式:</b><span>" +event.graphic.attributes.ExploreMode
                           + "</span></li><li><b>运输方式:</b><span>" +event.graphic.attributes.VentilationMode
                           + "</span></li><li><b>详细地址:</b><span>" +event.graphic.attributes.Address
                           + "</span></li></ul>";
        map.infoWindow.setContent(content);
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    coalProjectLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([128, 0, 0]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([219, 238, 243, 0.00000001]));
        event.graphic.setSymbol(polySymbol);
        map.infoWindow.hide();
    });

    //设置地图的中心点和缩放层级
    //map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4326 } }), 5);
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    //pt = esri.geometry.geographicToWebMercator(pt);
    map.centerAndZoom(pt, 6);
    //默认图层
    var Identifier = "Coal Project";
    var tileMatrixSet = "Custom_Coal Project";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 108.54095798941984, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-coal-project/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    var defaultlayer = new ThematicLayer(extent, url, origin);
    map.addLayer(defaultlayer);
    //defaultlayer.hide();
    //煤炭资源图层
    var Identifier = "MTCS";
    var tileMatrixSet = "Custom_MTCS";
    var extent = new esri.geometry.Extent(100.96736581498045, 26.42466067804793, 108.29276455344144, 32.53580121915098, new esri.SpatialReference({ wkid: 4326 }));
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-MTCS/wmts_tianditu";
    var origin = { "x": 100.96736581498045, "y": 32.53580121915098 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    coallayer = new ThematicLayer(extent, url, origin);
    map.addLayer(coallayer);
    coallayer.hide();
    
    addSiChuanShengBorder();
    postCoalProject();//请求所有的煤矿数据
    postCoalProjectByRegion();
    postCoalProjectByCoalRegion();
    postCoalRegion();
    postCityBorder();
});

function postCoalProject() {
    $.post("/GIS/ProjectCoalProject/GetCoalProject", function (result) {   //GetCoalProject
        var tempArray = JSON.parse(result);
        coalProjectArry = FormatJsonDefault(tempArray);
        addCoalProject(coalProjectArry);
        $.each(coalProjectArry, function(index, item) {
            tar.push(item.Name);
        });
        addTable_coalList();
    });
}
//加载区域数据
function postCityBorder() {
    $.post("/GIS/City/GetCity", function (result) {
        ArryCity = FormatJsonDefault(eval(result));
        $.each(ArryCity, function (index, item) {
            cityarr.push(item.Name);
        });
    });
}

//请求数据，某地区有多少个煤矿
function postCoalProjectByRegion() {
    $.post("/GIS/ProjectCoalProject/GetCoalProjectByRegion", function (result) {   //GetCoalProject
        var tempArray = JSON.parse(JSON.parse(result));
        coal_regionNum = FormatJsonDefault(tempArray);
        $('#data_class').datagrid({
            data: coal_regionNum
        });
        addEchart(coal_regionNum, 0);
    });
}

//请求数据，某矿区有多少个煤矿
function postCoalProjectByCoalRegion() {
    $.post("/GIS/ProjectCoalProject/GetCoalProjectByCoalRegion", function (result) {   //GetCoalProject
        coal_coalregionNum = FormatJsonDefault(JSON.parse(JSON.parse(result)));
        $('#data_list_coalregion').datagrid({
            data: coal_coalregionNum
        });
        $.each(coal_coalregionNum, function (index, item) {
            cityarr.push(item.BelongToCoalRegion.replace(/(^\s*)|(\s*$)/g, ''));
        });
    });
}

//请求矿区数据
function postCoalRegion() {
    
    $.post("/GIS/ResourceCoalResource/GetCoalResource", function (result) {   //GetCoalProject
        coalRegionArry = JSON.parse(result);
    });
}

//加载煤炭项目
function addCoalProject(res) {
    coalProjectLayer.clear();
    map.infoWindow.hide();
    $.each(res, function (index, obj) {
        var wkt = new Wkt.Wkt();
        wkt.read(obj.Shape);
        var config = {
            spatialReference: {
                wkid: 4490 
            },
            editable: false
        };

        var polygon = wkt.toObject(config);
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = polygon;
        graphicWeb.attributes = obj;

        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([128, 0, 0]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([128, 0,0, 0.01]));
        graphicWeb.setSymbol(polySymbol);
        coalProjectLayer.add(graphicWeb);
    });

    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(coalProjectLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });
}

//绑定数据——煤矿数据list
function addTable_coalList() {
    $('#data_list').datagrid({
        data: coalProjectArry
    });
}

//流域柱状图
function addEchart(Arry,type) {
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [];
    $.each(Arry, function (index, item) {
        if (type == 0) {
            arry1.push(item.BelongToCity);
        }
        if (type == 1) {
            arry1.push(item.BelongToCoalRegion);
        }
        arry2.push(item.AnnualManufacturability);//矿区可开采量统计
        arry3.push(item.RecoverableReserves);//煤矿生产能力统计
        arry4.push(item.Number);//煤矿个数
    });
    option = {
        color: ['#4BBC63', '#59C9EF', '#FF855F'],
        title: {
            text: '煤矿蕴含量统计图',
            x: 'center',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {

        },
        grid: {

            left: '3%',
            right: '3%',
            bottom: '6%',
            containLabel: true
        },
        legend: {
            x: 'right',
            y: 'top',
            top: 15,
            itemGap: 2,
            data: ['矿区可开采量', '煤矿生产能力', '煤矿个数']
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
                name: '单位：吨'
            },

        {
            type: 'value',
            name: '电站个数：个',
            // interval: 1
            splitLine: {
                splitLine: false
            }
        }
        ],
        series: [
            {
                name: '矿区可开采量',
                type: 'bar',
                data: arry2,
                barWidth: 30
            },
               {
                   name: '煤矿生产能力',
                   type: 'bar',
                   data: arry3,
                   barWidth: 30
               },
        {
            name: '煤矿个数',
            type: 'line',
            yAxisIndex: 1,
            data: arry4
        }
        ]
    };
    myChart3.setOption(option);
    myChart3.on("click", function (params) {
        var temparray = [];
        $.each(coalProjectArry, function(index, item) {
            if (item.BelongToCity== params.name) {
                temparray.push(item);
            }
        });
        addCoalProject(temparray);
    });
}

$(function () {
    //点击tab重新加载全部数据
    $('#tab1 .tabs li a').click(function () {
        $('#data_list').datagrid({
            data: coalProjectArry
        });
        addCoalProject(coalProjectArry);
            borderLayer.clear();
        }
    );
    //数据表格分页
    $('#data_list').datagrid({ loadFilter: pagerFilter });

    //煤矿区域表格点击事件
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            if (ArryCity == undefined) {
                alert("正在请求区域数据，请稍后再试！");
                return;
            } else {
                borderLayer.clear();
                coalProjectLayer.clear();
                regionLayer.clear();
                //regionLayer.clear();
                $.each(ArryCity, function (index, item) {
                    if (item.Name == row.BelongToCity) {
                        var wkt = new Wkt.Wkt();
                        wkt.read(item.Shape);
                        var config = {
                            spatialReference: {
                                wkid: 4490
                            },
                            editable: false
                        };
                        var polygon = wkt.toObject(config);
                        var graphicWeb = new esri.Graphic();
                        graphicWeb.geometry = polygon;
                        graphicWeb.attributes = item;
                        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]),2 );
                        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.5]));
                        graphicWeb.setSymbol(polySymbol);
                        borderLayer.add(graphicWeb);
                    }
                });
                $.each(coalProjectArry, function (index, item) {
                    if (item.BelongToCity == row.BelongToCity) {
                        var wkt = new Wkt.Wkt();
                        wkt.read(item.Shape);
                        var config = {
                            spatialReference: {
                                wkid: 4490
                            },
                            editable: false
                        };
                        var polygon = wkt.toObject(config);
                        var graphicWeb = new esri.Graphic();
                        graphicWeb.geometry = polygon;
                        graphicWeb.attributes = item;

                        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([128, 0, 0]), 0.01);
                        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([219, 238, 243, 0.00000001]));
                        graphicWeb.setSymbol(polySymbol);
                        coalProjectLayer.add(graphicWeb);
                    }
                });
                require(["esri/graphicsUtils"], function (graphicsUtils) {
                    var myExtent = graphicsUtils.graphicsExtent(coalProjectLayer.graphics);
                    map.setExtent(myExtent.expand(1.5));
                });
                //联动表格
                var sunArryRegion = [];
                $.each(coalProjectArry, function (index, item) {
                    if (item.BelongToCity == row.BelongToCity) {
                        sunArryRegion.push(item);
                    }
                });
                $('#data_list').datagrid({
                    data: sunArryRegion
                });
            }
        }
    });

    //煤矿矿区表格点击事件coalRegionArry
    $('#data_class_coalregion').datagrid({

        onClickRow: function (index, row) {

            console.log("你点击了" + row.BelongToCoalRegion);
            if (coalRegionArry == undefined) {
                alert("正在请求区域数据，请稍后再试！");
                return;
            } else {
                borderLayer.clear();
                coalProjectLayer.clear();
                $.each(coalProjectArry, function (index, item) {
                    if (item.BelongToCoalRegion.replace(/(^\s*)|(\s*$)/g, "") == row.BelongToCoalRegion.replace(/(^\s*)|(\s*$)/g, "")) {
                        //
                        var wkt = new Wkt.Wkt();
                        wkt.read(item.Shape);
                        var config = {
                            spatialReference: {
                                wkid: 4490
                            },
                            editable: false
                        };

                        var polygon = wkt.toObject(config);
                        var graphicWeb = new esri.Graphic();
                        graphicWeb.geometry = polygon;
                        graphicWeb.attributes = item;

                        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([128, 0, 0]), 0.01);
                        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([219, 238, 243, 0.01]));
                        graphicWeb.setSymbol(polySymbol);
                        coalProjectLayer.add(graphicWeb);


                    }
                });
                regionLayer.clear();
                $.each(coalRegionArry, function (index, item) {
                    if (item.Name == row.BelongToCoalRegion.replace(/(^\s*)|(\s*$)/g, "")) {
                        //
                        var wkt = new Wkt.Wkt();
                        wkt.read(item.Shap);
                        var config = {
                            spatialReference: {
                                wkid: 4490
                            },
                            editable: false
                        };

                        var polygon = wkt.toObject(config);
                        var graphicWeb = new esri.Graphic();
                        graphicWeb.geometry = polygon;
                        graphicWeb.attributes = item;

                        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 2);
                        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.5]));
                        graphicWeb.setSymbol(polySymbol);
                        regionLayer.add(graphicWeb);
                    }
                });
                require(["esri/graphicsUtils"], function (graphicsUtils) {
                    var myExtent = graphicsUtils.graphicsExtent(regionLayer.graphics);
                    map.setExtent(myExtent.expand(1.5));
                });
                //联动表格
                var arrycoal = [];
                $.each(coalProjectArry, function (index, item) {
                    if (item.BelongToCoalRegion == row.BelongToCoalRegion) {
                        arrycoal.push(item);
                    }
                });
                $('#data_list').datagrid({
                    data: arrycoal
                });
            }
        }
    });

    //数据表格行点击
    $("#data_list").datagrid({
        onClickRow: function (index, row) {
            if (gra != null) {
                var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([128, 0, 0]), 0.01);
                var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([128, 0, 0, 0.01]));
                gra.setSymbol(polySymbol);
            }
            map.graphics.clear();
            $.each(coalProjectLayer.graphics, function (index, item) {
                if (item.attributes.Name == row.Name) {
                    
                    var myExtent = item._extent;
                    var pt = myExtent.getCenter();
                    var content = "<ul><li><b>煤矿名称:</b><span>" +  item.attributes.Name
                            + "</span></li><li><b>所属区域:</b><span>" +  item.attributes.Name
                            + "</span></li><li><b>生产能力:</b><span>" + item.attributes.AnnualManufacturability + " 万吨"
                            + "</span></li><li><b>主要煤种:</b><span>" + item.attributes.MainCoalSpecies
                            + "</span></li><li><b>可采储量:</b><span>" + item.attributes.RecoverableReserves + " 万吨"
                            + "</span></li><li><b>开拓方式:</b><span>" + item.attributes.ExploreMode
                            + "</span></li><li><b>运输方式:</b><span>" + item.attributes.VentilationMode
                            + "</span></li><li><b>详细地址:</b><span>" + item.attributes.Address
                            + "</span></li></ul>";
                    map.infoWindow.setContent(content);
                    map.infoWindow.setTitle(item.attributes.Name);
                    var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 1);
                    var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 255, 255, 0.8]));
                    item.setSymbol(polySymbol);
                    gra = item;
                    map.infoWindow.show(pt);
                    map.centerAndZoom(pt, 10);
                }
            });
        }
    });

    //右上角信息框切换
    $('#tab1').tabs({
        onSelect: function(title, index) {
            console.log(title);
            console.log(index);
            if (index == 0) {
                addEchart(coal_regionNum, 0);
                $('#data_class').datagrid({
                    data: coal_regionNum
                });
                $('#data_list').datagrid({
                    data: coalProjectArry
                });
                $(".searchDiv").show();
                $("#searchinputbox").val("");
            }
            if (index == 1) {
                addEchart(coal_coalregionNum, 1);
                $('#data_class_coalregion').datagrid({
                    data: coal_coalregionNum
                });
                $('#data_list').datagrid({
                    data: coalProjectArry
                });
                $(".searchDiv").hide();
            }
            borderLayer.clear();
            regionLayer.clear();
            addCoalProject(coalProjectArry);
            $('#checkbox').hide();
        }
    });

    //显示与隐藏煤炭资源专题图
    $("#basin_populationGridLayer").click(function () {
        $("#checkbox").hide();
        if ($("#basin_populationGridLayer").prop("checked") == true) {
            coallayer.show();
            $("#aui-panel .layerlegend").show();

        } else {
            coallayer.hide();
            $("#aui-panel .layerlegend").hide();
        }
    });

    //$("#searchbutton").click(function () {
    //    var temptext = $("#o").val();
    //    var TempArray = [];
    //    TempArray = LikeQuery(coalProjectArry, temptext);
    //    console.log(TempArray);
    //    $('#data_list').datagrid({
    //        data: TempArray
    //    });
    //    T("auto").className = "auto_hidden";//点击按钮，隐藏下拉面板，T为自定义获取ID选择器
    //});
});

//专题图隐藏切换
function selectLayer(layer) {
    if (layer == "煤炭区域分布") {
        map.getLayer("coallayer_id").show();//隐藏煤矿矿区分布专题图
        $('#tab1').tabs("select", 1);
    }
    if (layer == "煤矿矿区分布") {
        map.getLayer("coallayer_id").hide();
        $('#tab1').tabs("select", 0);
    }
}

