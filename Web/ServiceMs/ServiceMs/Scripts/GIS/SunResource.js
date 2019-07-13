//设置图表宽度
$(function () {
    var winW = $(window).width()-10;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    mychart1.css('width', winW / 3 * 2 + 'px');
    mychart2.css('width', winW / 3 + 'px');
    $(".legend_xz").hide();
});
var fieldarray = ['Name', 'AverageAnnualSunshineHours', 'AverageAnnualTotalRadiationAmount', 'AverageAnnual', 'InstalledCapacityHadBuilt', 'InstalledCapacityInConstruction', 'AverageAnnualHours', 'ResourcesLevel', 'All'];
var typearray = ['2', '1', '1', '1', '1', '1', '1', '2', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        $('#data_list').datagrid({
            data: sunRegionArry
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
        var array = ConditionQuery(sunRegionArry, condition, minvalue, maxvalue, type);
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




var sunRegionArry;//所有的太阳能资源分区的数据
var sunClassArry;
var sunData;
var sunRegionLayer;
var yearsuntime_layer;//年均日照时间
var yearradio_layer;//年均辐射强度
var sundata;//处理后的数据
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

    sunRegionLayer = new GraphicsLayer();
    map.addLayer(sunRegionLayer);

    //鼠标移动事件，将graphic的样式换为另外一个
    sunRegionLayer.on('mouse-move', function (event) {
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
    sunRegionLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 37, 37]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.01]));
        event.graphic.setSymbol(polySymbol);
        map.infoWindow.hide();
    });

    //弹窗隐藏事件
    map.infoWindow.on('hide', function (event) {
        $.each(sunRegionLayer.graphics, function (index, item) {
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
    pt = esri.geometry.geographicToWebMercator(pt);
    map.centerAndZoom(pt, 5);

    //年均辐射量
    var Identifier = "NJFS2";
    var tileMatrixSet = "Custom_NJFS2";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 109.53082999606099, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_solar/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    yearradio_layer = new ThematicLayer(extent, url, origin);
    map.addLayer(yearradio_layer);

    //年均日照时间
    var Identifier = "NJFS";
    var tileMatrixSet = "Custom_NJFS";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 109.53082999606099, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_solar/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    yearsuntime_layer = new ThematicLayer(extent, url, origin);
    map.addLayer(yearsuntime_layer);
    //隐藏年均日照时间图层
    yearsuntime_layer.hide();

    postSunRegion();
});

//请求太阳能资源分区数据
function postSunRegion() {
    $.post("/GIS/ResourceSolarEnergyResource/GetAllData", function (result) {
        var tempArray = FormatJsonDefault(JSON.parse(result));
        sunRegionArry = tempArray;
        sunClassArry = tempArray;
        sundata = tempArray;
        addSunLayer(sunRegionArry);
        addTable_sun1(sundata);
        addTable_sun2(sunClassArry);
        addTable_sun3(sunRegionArry);
        addChart(sunRegionArry);
        addChart2(sunRegionArry);
    });
}
//addSunLayer添加图层内容
function addSunLayer(sunRegionArry) {
    sunRegionLayer.clear();
    $.each(sunRegionArry, function (index, item) {
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

        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.01]));
        graphicWeb.setSymbol(polySymbol);
        sunRegionLayer.add(graphicWeb);
    });
    //设置范围
    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(sunRegionLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });
}

//绑定数据——年均辐射量
function addTable_sun1(sundata) {
    $('#data_class').datagrid({
        data: sundata
    });
}

//绑定数据——年均日照时间
function addTable_sun2(sundata) {
    $('#data_class_sunregion').datagrid({
        data: sundata
    });
}
//绑定数据——数据
function addTable_sun3(sundata) {
    $('#data_list').datagrid({
        data: sundata

    });
}

//增加图表
function addChart(Arry) {
    var myChart = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);
        arry2.push(item.InstalledCapacityHadBuilt);//在建
        arry3.push(item.InstalledCapacityHadBuilt);//已建
        arry4.push(item.RecoverableReserves);//总容量
    });
    option = {
        title: {
            text: '可开发总容量',
            subtext: '',
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
            data: ['在建装机容量', '已建装机容量', '可开发总容量']
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
                name: '单位：兆瓦',
                type: 'value'
            },
             {
                 name: '可开发总容量：兆瓦',
                 type: 'value'
             }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        color: [
                               '#87CEFA','#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                              '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        series: [
            {
                name: '在建装机容量',
                type: 'bar',
                data: arry2
              
            },
             {
                 name: '已建装机容量',
                 type: 'bar',
                 data: arry3
             },
              {
                  name: '可开发总容量',
                  type: 'bar',
                  yAxisIndex: 1,
                  data: arry4
              }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(sunRegionLayer, params);
    });
}
function addChart2(Arry) {
    var myChart = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [], arry3 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);
        arry2.push(item.AverageAnnualRadiation);
        arry3.push(item.AverageAnnualHours);
    });
    option = {
        title: {
            text: '年均辐射统计',
            subtext: '',
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
            data: ['年均总辐射量', '年利用小时数']
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
                name: '单位：兆瓦',
                type: 'value'
            }, {
                name: '年利用小时：小时',
                type: 'value'
            }
        ],
        color: [
                              '#87CEFA', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                             '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [
             {
                 name: '年均总辐射量',
                 type: 'bar',
                 data: arry2
             },
              {
                  name: '年利用小时数',
                  type: 'line',
                  yAxisIndex: 1,
                  data: arry3
              }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(sunRegionLayer, params);
    });
}
function addChart1(Arry) {
    var myChart = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry4 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);
        arry4.push(item.AverageAnnual);
    });
    option = {
        title: {
            text: '年均等效利用小时数',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            //trigger: 'axis'
        },
        legend: {
            x: 'right',
            y: 'top',
            data: ['年均等效利用小时数']
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
                name: '单位：h',
                type: 'value'
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
                 name: '年均等效利用小时数',
                 type: 'bar',
                 data: arry4

             }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(sunRegionLayer, params);
    });
}

$(function () {
    //数据表格点击事件
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(sunRegionLayer, row);
        }
    });

    //年均辐射量表格点击事件
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(sunRegionLayer, row);

        }
    });

    //年均日照时间
    $('#data_class_sunregion').datagrid({
        onClickRow: function (index, row) {  //
            datagrid_click(sunRegionLayer, row);
        }
    });

    //流域水系和行政区划tab的切换控制
    $('#tab1').tabs({
        onSelect: function (title, index) {
            console.log(title);
            console.log(index);
            if (index == 0) {
                $('#layer_select').combobox('setValue', '太阳能总辐射分布图');
                //专题图切换为流域蕴含量专题图
                selectLayer("太阳能总辐射分布图");
                $('#checkbox').hide();
                $("#sun_scslopeareaLayer").prop("checked", false);
                $("#sun_populationGridLayer").prop("checked", true);
            }
            if (index == 1) {
                $('#layer_select').combobox('setValue', '太阳能资源分区');
                //专题图切换为区划蕴含量专题图
                selectLayer("太阳能资源分区");
                $('#checkbox').hide();
                $("#sun_scslopeareaLayer").prop("checked", true);
                $("#sun_populationGridLayer").prop("checked", false);
            }
        }
    });

    //太阳能辐射复选框事件
    $("#sun_populationGridLayer").click(function () {
        if ($("#sun_populationGridLayer").prop("checked") == true) {
            selectLayer("太阳能总辐射分布图");
            $("#sun_scslopeareaLayer").prop("checked", false);
        } else {

            $("#sun_scslopeareaLayer").prop("checked", true);
        }
    });

    //太阳能资源风区复选框事件
    $("#sun_scslopeareaLayer").click(function () {
        if ($("#sun_scslopeareaLayer").prop("checked") == true) {
            selectLayer("太阳能资源分区");
            $("#sun_populationGridLayer").prop("checked", false);
        } else {
            $("#sun_populationGridLayer").prop("checked", true);
        }
    });
});

//专题图隐藏切换
function selectLayer(layer) {
    if (layer == "太阳能资源分区") {
        $(".legend").hide();
        $(".legend_xz").show();
        yearsuntime_layer.show();
        yearradio_layer.hide();
        $('#tab1').tabs("select", 1);
    }
    if (layer == "太阳能总辐射分布图") {
        $(".legend_xz").hide();
        $(".legend").show();
        yearsuntime_layer.hide();
        yearradio_layer.show();
        $('#tab1').tabs("select", 0);
    }
}
//判断infowindow使用什么内容，整个页面的infowindow只有两种情况，抽出来减少代码量
function content_infowindow(item, type) {//item当前显示具体对应的graphic
    var content = "<ul><li><b>分区名称:</b><span>" + item.attributes.Name
               + "</span></li><li><b>年均日照时数:</b><span>" + item.attributes.AverageAnnualSunshineHours+ " 小时"
               + "</span></li><li><b>年均总辐射量:</b><span>" + item.attributes.AverageAnnualTotalRadiationAmount + " 兆瓦"
               + "</span></li><li><b>可开发总容量:</b><span>" + item.attributes.RecoverableReserves + " 兆瓦"
               + "</span></li><li><b>已建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦"
               + "</span></li><li><b>年利用小时数:</b><span>" + item.attributes.AverageAnnualHours + " 小时"
               + "</span></li><li><b>资源等级:</b><span>" + item.attributes.ResourcesLevel
               + "</span></li><li><b>年平均辐射:</b><span>" + item.attributes.AverageAnnualRadiation + " 兆瓦"
            + "</span></li></ul>";
    return content;

}