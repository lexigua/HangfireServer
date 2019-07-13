$(function () {
    var winW = $(window).width()-5;
    var mychart1 = $('#mychart1');
    mychart1.css("width", winW + "px");
});


var fieldarray = ['Name', 'Address', 'Area', 'AnnualYield', 'MainCoalSpecies', 'CoalSeamStructure', 'CalorificValue', 'DataSource','All'];
var typearray = ['2', '2', '1', '1', '2', '2', '1', '2','0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function() {
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        $('#data_list').datagrid({
            data: coalRegionArry
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
        var array = ConditionQuery(coalRegionArry, condition, minvalue, maxvalue, type);
        $('#data_list').datagrid({
            data: array
        });
    }
});
$(function() {
    document.onkeydown = function(e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $('#searchbutton').click();
        }
    }
}); 


var coalRegionArry;//矿区数据
var coalRegionLayer;//矿区图层
var coal_layer;
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
    coalRegionLayer = new GraphicsLayer();
    map.addLayer(coalRegionLayer);
    

    //鼠标移动事件，将graphic的样式换为另外一个
    coalRegionLayer.on('mouse-move', function (event) {
        //console.log('你经过了一个graphic');
        //ipos = event.graphic.attributes.ProductionTime.indexOf("T");
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 1);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 255, 255, 0.8]));
        event.graphic.setSymbol(polySymbol);
        var content = content_infowindow(event.graphic);
        map.infoWindow.setContent(content);
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    coalRegionLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.01]));
        event.graphic.setSymbol(polySymbol);
        map.infoWindow.hide();
    });

    //弹窗隐藏事件
    map.infoWindow.on('hide', function (event) {
        $.each(coalRegionLayer.graphics, function (index, item) {
            if (event.target._contentPane.childNodes[0].childNodes[0].children[1].innerHTML == item.attributes.Name) {
                var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
                var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.1]));
                item.setSymbol(polySymbol);
                return;
            }
        });
    });
    //设置地图的中心点和缩放层级
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    //pt = esri.geometry.geographicToWebMercator(pt);
    map.centerAndZoom(pt, 5);

    //煤炭资源图层
    var Identifier = "MTCS";
    var tileMatrixSet = "Custom_MTCS";
    var extent = new esri.geometry.Extent(100.96736581498045,26.42466067804793,108.29276455344144,32.53580121915098, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-MTCS/wmts_tianditu";
    var origin = { "x": 100.96736581498045, "y": 32.53580121915098 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    coal_layer = new ThematicLayer(extent, url, origin);
    map.addLayer(coal_layer);

    
    //请求矿区数据
    postCoalRegion();
    //添加四川省边界
    addSiChuanShengBorder();
});

//请求矿区数据
function postCoalRegion() {
    $.post("/GIS/ResourceCoalResource/GetCoalResource", function (result) {   //GetCoalProject
        var tempArray = JSON.parse(result);
        coalRegionArry = FormatJsonDefault(tempArray);
        addcoal_layer(coalRegionArry);
        addTable_coal(coalRegionArry);
        addTable_coalList(coalRegionArry);
        addChart(coalRegionArry);
    });
}

//图层添加内容
function addcoal_layer(coalRegionArry) {
    coalRegionLayer.clear();
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
            coalRegionLayer.add(graphicWeb);
    });
    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(coalRegionLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });
}

//煤炭矿区绑定数据
function addTable_coal(coalProjectArry) {
    $('#data_class').datagrid({
        data: coalProjectArry
    });
}

//绑定数据
function addTable_coalList(coalProjectArry) {
    $('#data_list').datagrid({
        data: coalProjectArry
    });
}
//增加图表
function addChart(Arry) {
    var myChart = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [],arry4=[];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);
        arry2.push(item.Reserves);
        arry3.push(item.AnnualYield *1000);
        arry4.push(item.CalorificValue);
    });
    option = {
        title: {
            text: '矿区可采储量统计',
            x: 'center',
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
            data: ['探明储量','年产量','发热量']
        },
        grid: {

            left: '3%',
            right: '3%',
            bottom: '6%',
            containLabel: true
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
                name: '单位：吨',
                type: 'value'
            },
             {
                 name: '发热量：卡/克',
                 type: 'value'
             }
        ],
        color: [
                         '#87CEFA', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        series: [
            {
                name: '探明储量',
                type: 'bar',
                data: arry2
            }, {
                name: '年产量',
                type: 'bar',
                data: arry3
            }, {
                name: '发热量',
                type: 'bar',
                yAxisIndex:1,
                data: arry4
            }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(coalRegionLayer, params);
    });
}

$(function () {
    //分页
    $('#data_list').datagrid({ loadFilter: pagerFilter });
    //数据表格点击事件
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(coalRegionLayer, row);
        }
    });
    //煤矿矿区表格点击事件
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(coalRegionLayer, row);

        }
    });
    //加载表格数据
    $('#data_class_coalregion').datagrid({
        data:[
        { 'Name': '川东北高含硫气','Reserves': '5000000', 'StatisticTime': '2013-07-05'},
        { 'Name': '龙岗气', 'Reserves': '4500000', 'StatisticTime': '2014-03-25'},
        { 'Name': '川中、川西须家河组气', 'Reserves': '710000', 'StatisticTime': '2010-08-08' },
        { 'Name': '中石油川西、川南老气田开发', 'Reserves': '730000', 'StatisticTime': '2014-08-08' }
           ]
    });
});

//判断infowindow使用什么内容，整个页面的infowindow只有两种情况，抽出来减少代码量
function content_infowindow(item, type) {//item当前显示具体对应的graphic
    var content = "<ul><li><b>矿区名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>所在地:</b>" + item.attributes.Address
                + "</span></li><li><b>煤层结构:</b>" +  item.attributes.CoalSeamStructure
                + "</span></li><li><b>年产量:</b>" +item.attributes.AnnualYield + " 万吨"
                + "</span></li><li><b>主要煤类:</b>" + item.attributes.MainCoalSpecies
                + "</span></li><li><b>面积:</b>" + item.attributes.Area + " 平方千米"
                + "</span></li><li><b>探明储量:</b>" + item.attributes.Reserves+ " 万吨" + "</span></li></ul>";

    return content;

}

