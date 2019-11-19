//为图表设置宽度
$(function () {
    var winW = $(window).width()-5;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    mychart1.css('width', winW / 3*2 + 'px');
    mychart2.css('width', winW / 3 + 'px');
    $(".legend").hide();
});
var fieldarray = ['Name', 'InstalledCapacityToTheory', 'InstalledCapacityHadBuilt', 'InstalledCapacityInConstruction', 'AverageWindspeed', 'AverageWindpowerDensity', 'AverageAnnualHours', 'All'];
var typearray = ['2', '1', '1', '1', '1', '1', '1',  '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        $('#data_list').datagrid({
            data: ArryWindRegion
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
        var array = ConditionQuery(ArryWindRegion, condition, minvalue, maxvalue, type);
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

//定义三个变量存放相同的数据是为了表格排序的时候不引起其他表格数据的混乱
var ArryWindRegion;
var ArryWindClassRegion;
var ArryWindClass;
var windRegionLayer;
var windpower_layer;//风功率
var windspeed_layer;//风速
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
dojo.require("extras.ThematicLayer");
require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer",
    "extras/ThematicLayer", "extras/TDTAnnoLayer",
    "extras/TDTImageLayer", "esri/layers/GraphicsLayer"],
    function (Map, InfoWindow, TDTRoadLayer, ThematicLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer) {
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
        //设置地图的中心点和缩放层级
        var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
        pt = esri.geometry.geographicToWebMercator(pt);
        map.centerAndZoom(pt, 7);

        //风速图层
        var Identifier = "四川省风速分布";
        var tileMatrixSet = "Custom_四川省风速分布";
        var extent = new esri.geometry.Extent(96.55788242507582, 25.772947683720858, 108.92485867198486 ,34.55894793743847, new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = "http://112.74.101.152:8090/iserver/services/map-FZY---FuBen/wmts_tianditu";
        var origin = { "x": 96.55788242507582, "y": 34.55894793743847 }; //x:100.96736581498045     y:32.53580121915098 
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        windspeed_layer = new ThematicLayer(extent, url, origin);
        map.addLayer(windspeed_layer);
        
        //风功率图层
        var Identifier = "四川省风能密度分布";
        var tileMatrixSet = "Custom_四川省风能密度分布";
        var extent = new esri.geometry.Extent(97.34166666665574 ,26.040833329996037, 108.5499999999846 ,34.315833329992714, new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = "http://112.74.101.152:8090/iserver/services/map-FZY---FuBen/wmts_tianditu";
        var origin = { "x": 97.34166666665574, "y": 34.315833329992714 }; //x:100.96736581498045     y:32.53580121915098 
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        windpower_layer = new ThematicLayer(extent, url, origin);
         map.addLayer(windpower_layer);
        //风功率图层隐藏
        windpower_layer.hide();

        windRegionLayer = new GraphicsLayer();
        map.addLayer(windRegionLayer);

        //鼠标移动事件，将graphic的样式换为另外一个
        windRegionLayer.on('mouse-move', function (event) {
            //console.log('你经过了一个graphic');
            //ipos = event.graphic.attributes.ProductionTime.indexOf("T");
            var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 1);
            var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 255, 255, 0.8]));
            event.graphic.setSymbol(polySymbol);
            var content=content_infowindow(event.graphic);
            map.infoWindow.setContent(content);
            map.infoWindow.setTitle("详情");
            map.infoWindow.show(event.mapPoint);
        });
        //鼠标离开事件，将graphic的symbol还原
        windRegionLayer.on('mouse-out', function (event) {
            //console.log('你离开了一个graphic');
            var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 0.01);
            var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.01]));
            event.graphic.setSymbol(polySymbol);
            map.infoWindow.hide();
        });
        //弹窗隐藏事件
        map.infoWindow.on('hide', function (event) {
            $.each(windRegionLayer.graphics, function (index, item) {
                if (event.target._contentPane.childNodes[0].childNodes[0].children[1].innerHTML == item.attributes.Name) {
                    var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
                    var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.1]));
                    item.setSymbol(polySymbol);
                    return;
                }
            });
        });
        postWindRegionInfo();
        //addSiChuanShengBorder();
    });
//初始化加载风速数据
function postWindRegionInfo() {
    $.post("/GIS/ResourceWindResource/GetBasinOne", function (result) {
        var tempArray = FormatJsonDefault(eval(result));
        ArryWindRegion = tempArray;
        ArryWindClass = tempArray;
        ArryWindClassRegion = tempArray;
        $('#data_class_windregion').datagrid({
            data: ArryWindClassRegion
        });
        $('#data_class').datagrid({
            data: ArryWindClass
        });
        $('#data_list').datagrid({
            data: ArryWindRegion
        });
        
        addWindLayer(ArryWindRegion);
        addChart1(ArryWindRegion);
        addChart2(ArryWindRegion);
    });
}

//地图上添加数据
function addWindLayer(coalRegionArry) {
    windRegionLayer.clear();
    $.each(coalRegionArry, function (index, item) {
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
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.01]));
        graphicWeb.setSymbol(polySymbol);
        windRegionLayer.add(graphicWeb);
    });
    //设置范围
    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(windRegionLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });
}

//增加图表预计可开发容量
function addChart1(Arry) {
    var myChart = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [], arry5 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);
        arry2.push(item.InstalledCapacityToTheory);
        arry3.push(item.InstalledCapacityHadBuilt);
        arry4.push(item.InstalledCapacityInConstruction);
        arry5.push(item.AverageWindpowerDensity);
    });
    option = {
        title: {
            text: '可开发容量统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize:16
            }
        },
        tooltip: {

        },
        legend: {
            x: 'right',
            y: 'top',
            top: 15,
            itemGap:2,
            data: ['预计可开发容量', '已建成装机容量', '在建装机容量', '平均风功率密度']
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
                name: '单位:万千瓦',
                type: 'value'
            },
            {
                type: 'value',
                name: '单位：万瓦/平方千米',
                // interval: 1
                splitLine: {
                    splitLine: false
                }
            }
        ],
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        color: [
                         '#87CEFA', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        series: [
            {
                name: '预计可开发容量',
                type: 'bar',
                data: arry2
            },
            {
                name: '已建成装机容量',
                type: 'bar',
                data: arry3
            },
            {
                name: '在建装机容量',
                type: 'bar',
                data: arry4
            },
        {
            name: '平均风功率密度',
            type: 'line',
            yAxisIndex: 1,
            data: arry5
        }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(windRegionLayer, params);
    });
}

//平均风速统计图表
function addChart2(Arry) {
    var myChart = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);
        arry2.push(item.AverageWindspeed);
        arry3.push(item.AverageAnnualHours);
    });
    option = {
        title: {
            text: '平均风速统计',
            subtext: '',
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
            data: ['平均风速', '年平均等效满负荷小时数']
        },
        xAxis: [
            {
                type: 'category',
                data: arry1
            }
        ],
        yAxis: [
            {
                name: '单位:千米/小时',
                type: 'value'
            },
            {
                type: 'value',
                name: '单位：小时',
                // interval: 1
                splitLine: {
                    splitLine: false
                }
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        color: [
                         '#87CEFA', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        series: [
            {
                name: '平均风速',
                type: 'bar',
                data: arry2
            },
        {
            name: '年平均等效满负荷小时数',
            type: 'bar',
            yAxisIndex: 1,
            data: arry3
        }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(windRegionLayer, params);
    });
}
//专题图隐藏切换
function selectLayer(layer) {
    map.infoWindow.hide();
    if (layer == "风速分布专题图") {
        $(".legend").hide();
        $(".legend_xz").show();
        $('#tab1').tabs("select", 0);
        windpower_layer.hide();
        windspeed_layer.show();
    }
    if (layer == "风功率密度专题图") {
        $(".legend_xz").hide();
        $(".legend").show();
        $('#tab1').tabs("select", 1);
        windpower_layer.show();
        windspeed_layer.hide();
    }
}

$(function () {
    //风速面板的表格单击事件
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(windRegionLayer, row);
        }
    });

    //风功率面板的表格单击事件
    $('#data_class_windregion').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(windRegionLayer, row);
        }
    });

    //数据面板表格的单击事件
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(windRegionLayer, row);
        }
    });

    //风功率复选框事件
    $("#wind_density").click(function () {
        console.log($("#wind_density").prop("checked"));
        if ($("#wind_density").prop("checked") == true) {
            selectLayer("风功率密度专题图");
            $("#wind_speed").prop("checked", false);
        } else {
            $("#wind_density").prop("checked", true);
        }
    });

    //风速复选框事件
    $("#wind_speed").click(function () {
        if ($("#wind_speed").prop("checked") == true) {
            selectLayer("风速分布专题图");
            $('#data_list').datagrid('reload');
            $('#data_list').datagrid({
                data: ArryCity
            });
            addEchart1(ArryCity); //图表切换
            addBasinInfo(ArryCity, 2);
            layerClassCode = 1;
            $("#wind_density").prop("checked", false);
        } else {
            $("#wind_density").prop("checked", true);
        }
    });

    //tab的切换控制
    $('#tab1').tabs({
        onSelect: function (index) { 
            if (index == "风速") {
                $("#wind_density").prop("checked", false);
                $("#wind_speed").prop("checked", true);
                selectLayer("风速分布专题图");
                $('#checkbox').hide();
               
            }
            if (index == "风功率密度") {
                $("#wind_density").prop("checked", true);
                $("#wind_speed").prop("checked", false);
                selectLayer("风功率密度专题图");
                $('#checkbox').hide();
                
            }
        }
    });
});


//判断infowindow使用什么内容，整个页面的infowindow只有两种情况，抽出来减少代码量
function content_infowindow(item, type) {//item当前显示具体对应的graphic
    var content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>预计可开发容量:</b><span>" +item.attributes.InstalledCapacityToTheory + " 兆瓦"
                + "</span></li><li><b>已建成装机容量:</b><span>" +item.attributes.InstalledCapacityHadBuilt + " 兆瓦"
                + "</span></li><li><b>在建装机容量:</b><span>" +item.attributes.InstalledCapacityInConstruction + " 兆瓦"
                + "</span></li><li><b>平均风速:</b><span>" + item.attributes.AverageWindspeed + " 千米/小时"
                + "</span></li><li><b>平均风功率密度:</b><span>" + item.attributes.AverageWindpowerDensity + " 兆瓦/平方千米"
                + "</span></li><li><b>年平均等效满负荷小时数:</b><span>" + item.attributes.AverageAnnualHours + " 小时"
                + "</span></li></ul>";
    return content;
    
}