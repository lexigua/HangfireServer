var fieldarray = ['Name', 'Reserves', 'Runoff', 'DevelopByTechNum', 'DevelopByEcNum', 'InstalledCapacityInConstruction', 'InstalledCapacityToBeDeveloped', 'Flow', 'All'];
var typearray = ['2', '1', '1', '1', '1', '1', '1', '1', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    var type = 0;
    var tempArray;
    //判断右侧tab
    if (layerClassCode == 0) {
        tempArray = ArryBasin;
    } else if (layerClassCode == 1) {
        tempArray = ArryCity;
    }
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        $('#data_list').datagrid({
            data: tempArray
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
        var array = ConditionQuery(tempArray, condition, minvalue, maxvalue, type);
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


var basin1Layer;//一级流域图层
var division_layer;//区划专题图图层
var basin_layer;//流域专题图图层
var ArryBasin;  //流域数据
var ArryCity;//行政区划数据
var layerClassCode = 0;//确定当前显示的是流域还是区划图层；0表示流域；1表示区划
var contentBasin;   //显示的是流域时，系统需要显示的infowindow内容
var contentRegion; //显示的是区域时，系统需要显示的infowindow内容
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
dojo.require("esri.renderers.ClassBreaksRenderer");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.InfoTemplate");
dojo.require("extras.ThematicLayer");

require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer",
    "extras/ThematicLayer", "extras/TDTAnnoLayer",
    "extras/TDTImageLayer", "esri/layers/GraphicsLayer"],
    function (Map, InfoWindow, TDTRoadLayer, ThematicLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer) {

        map = new Map("map",
        {
            logo: false,
            minZoom: 6,
            center: [104.0706, 30.164789]
    });

        baseMap_roadLayer = new TDTRoadLayer();
        map.addLayer(baseMap_roadLayer);
        baseMap_annoLayer = new TDTAnnoLayer();
        map.addLayer(baseMap_annoLayer);
        baseMap_imageLayer = new TDTImageLayer();
        map.addLayer(baseMap_imageLayer);
        baseMap_imageLayer.hide();

        //设置地图的中心点和缩放层级
        map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } }), 7);

        //流域水系专题图图层
        var Identifier = "Water_Basin";
        var tileMatrixSet = "Custom_Water_Basin";
        var extent = new esri.geometry.Extent(96.811324046 ,24.470114679000066, 109.27840940900006 ,34.52871874900006, new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_Water/wmts_tianditu";
        var origin = { "x": 96.811324046, "y": 34.52871874900006 }; //x:100.96736581498045     y:32.53580121915098 
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        basin_layer = new ThematicLayer(extent, url, origin);
        map.addLayer(basin_layer);

        //行政区划专题图图层
        var Identifier = "Water_Division";
        var tileMatrixSet = "Custom_Water_Division";
        var extent = new esri.geometry.Extent(97.35105544600003 ,26.049023511000033, 108.54135189000003 ,34.31474036800006, new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_Water/wmts_tianditu";
        var origin = { "x": 97.35105544600003, "y": 34.31474036800006 }; //x:100.96736581498045     y:32.53580121915098 
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        division_layer = new ThematicLayer(extent, url, origin);
        map.addLayer(division_layer);
        //隐藏行政区划专题图
        division_layer.hide();

        basin1Layer = new GraphicsLayer();
        map.addLayer(basin1Layer);

        //鼠标移动事件，将graphic的样式换为另外一个
        basin1Layer.on('mouse-move', function (event) {
            //console.log('你经过了一个graphic');
            //ipos = event.graphic.attributes.ProductionTime.indexOf("T");
            map.infoWindow.hide();
            var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255,0.5]), 3);
            var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 0, 0, 0,0.1]));
            event.graphic.setSymbol(polySymbol);
            if (layerClassCode == 0) {
                content = content_infowindow(event.graphic, 0);
            }
            if (layerClassCode == 1) {
                content = content_infowindow(event.graphic, 1);
            }
            map.infoWindow.setContent(content);
            map.infoWindow.setTitle("详情");
            map.infoWindow.show(event.mapPoint);
        });
        //鼠标离开事件，将graphic的symbol还原
        basin1Layer.on('mouse-out', function (event) {
            //console.log('你离开了一个graphic');
            var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
            var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.1]));
            event.graphic.setSymbol(polySymbol);
            map.infoWindow.hide();
        });

        //隐藏行政区划图例
        $(".legend_xz").hide();
        //弹窗隐藏事件
        map.infoWindow.on('hide', function (event) {
            $.each(basin1Layer.graphics, function (index, item) {
                if (event.target._contentPane.childNodes[0].childNodes[0].children[1].innerHTML == item.attributes.Name) {
                    var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
                    var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.1]));
                    item.setSymbol(polySymbol);
                    return;
                }
            });
        });

        //地图点击事件
        map.on('click', function (event) {
            if (event.graphic == undefined) {
                map.infoWindow.hide();
            }
        });

        //初始化加载流域水系数据
        $.post("/GIS/BasinOne/GetBasinOne", function (result) {
            var temparr = eval(result);
            //var temparray = [];
            //$.each(temparr, function (index, item) {
            //    temparray.push({ Code: item.Code, Name: item.Name, DevelopByTechNum: item.DevelopByTechNum.toFixed(2), DevelopByEcNum: item.DevelopByEcNum.toFixed(2), Area: item.Area, StationNum: item.StationNum, Version: item.Version, CreateTime: item.CreateTime, Shape: item.Shape, Reserves: item.Reserves.toFixed(2), Runoff: item.Runoff, InstalledCapacityHadBuilt: item.InstalledCapacityHadBuilt, InstalledCapacityInConstruction: item.InstalledCapacityInConstruction, InstalledCapacityToBeDeveloped: item.InstalledCapacityToBeDeveloped, Flow: item.Flow });
            //});
            ArryBasin = FormatJsonDefault(temparr);
            $('#data_class').datagrid({
                data: ArryBasin
            });
            $('#data_list').datagrid({
                fitColumns: true,
                data: ArryBasin
            });
            addBasinInfo(ArryBasin);
            addEchart2(ArryBasin);
            //初始化加载行政区划数据
            $.post("/GIS/City/GetCity", function (result) {
                var cityarr = eval(result);
                ArryCity = FormatJsonDefault(cityarr);
                $('#data_class_region').datagrid({
                    data: ArryCity
                });
            });
        });


    });
//添加流域水系面图层
function addBasinInfo(res) {
    basin1Layer.clear();//隐藏图层
    map.infoWindow.hide();
    $.each(res, function (idx, obj) {
        //清除上一次加载的区域
        var wkt = new Wkt.Wkt();
        wkt.read(obj.Shape);
        //wkt.read(obj.WKT);
        var config = {
            spatialReference: {
                wkid: 4490 // WGS84 unprojected
            },
            editable: false
        };
        var polygon = wkt.toObject(config);
        graphicWeb = new esri.Graphic();
        graphicWeb.geometry = polygon;
        graphicWeb.attributes = obj;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.1]));
        graphicWeb.setSymbol(polySymbol);
        //把图像添加到刚才创建的图层上
        basin1Layer.add(graphicWeb);
    });
}

//流域柱状图
function addEchart2(Arry) {
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [], arry5 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);//名称
        arry2.push(item.Reserves);//理论蕴藏量
        arry3.push(item.DevelopByEcNum);//经济可开发量
        arry4.push(item.DevelopByTechNum);//已开发装机容量
        arry5.push(item.StationNum);//电站个数
    });
    option = {
        title: {
            text: '流域蕴含量统计图',
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
            data: ['理论蕴藏量', '经济可开发量', '已开发装机容量', '电站个数']
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
                name: '单位：万千瓦'
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
        color: [
                           '#87CEFA', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                          '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        series: [
            {
                name: '理论蕴藏量',
                type: 'bar',
                data: arry2
            },
               {
                   name: '经济可开发量',
                   type: 'bar',
                   data: arry3
               },
            {
                name: '已开发装机容量',
                type: 'bar',
                data: arry4
            },
        {
            name: '电站个数',
            type: 'line',
            yAxisIndex: 1,
            data: arry5
        }
        ]
    };
    myChart3.setOption(option);
    myChart3.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(basin1Layer, params);
    });
    //myChart3.on('mouseover', function (params) {
    //    params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
    //    datagrid_click(basin1Layer, params);
    //}); 
    //myChart3.on('mouseout', function (params) {
    //    map.infoWindow.hide();
    //});
}
//区划柱状图
function addEchart1(Arry) {
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [], arry5 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.Name);//名称
        arry2.push(item.Reserves);//理论蕴藏量
        arry3.push(item.DevelopByEcNum);//经济可开发量
        arry4.push(item.DevelopByTechNum);//已开发装机容量
        arry5.push(item.StationNum);//电站个数
    });
    option = {
        title: {
            text: '区划蕴含量专题图',
            subtext: '',
            x: 'center',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            x: 'right',
            y: 'top',
            top: 15,
            itemGap: 2,
            data: ['理论蕴藏量', '经济可开发量', '已开发装机容量', '电站个数']
        },
        grid: {

            left: '3%',
            right: '3%',
            bottom: '6%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
            }
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
                name: '单位：万千瓦',
                type: 'value'
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
        color: [
                           '#87CEFA', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                          '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        series: [
            {
                name: '理论蕴藏量',
                type: 'bar',
                data: arry2
            },
               {
                   name: '经济可开发量',
                   type: 'bar',
                   data: arry3
               },
            {
                name: '已开发装机容量',
                type: 'bar',
                data: arry4
            },
        {
            name: '电站个数',
            type: 'line',
            yAxisIndex: 1,
            data: arry5
        }
        ]
    };
    myChart3.setOption(option);
    myChart3.on('click', function (params) {
        params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
        datagrid_click(basin1Layer, params);
    });
    //myChart3.on('mouseover', function (params) {
    //    params.Name = params.name;//表格单击获取对应区域名称的参数为Name，echart的参数名称为name。
    //    datagrid_click(basin1Layer, params);
    //});
    //myChart3.on('mouseout', function (params) {
    //    map.infoWindow.hide();
    //});
}
//专题图隐藏切换
function selectLayer(layer) {
    if (layer == "区划蕴含量专题图") {
        $(".legend").hide();
        $(".legend_xz").show();
        division_layer.show();
        basin_layer.hide();
        $('#tab1').tabs("select", 1);
    }
    if (layer == "流域蕴含量专题图") {
        $(".legend_xz").hide();
        $(".legend").show();
        division_layer.hide();
        basin_layer.show();
        $('#tab1').tabs("select", 0);
    }
}


//判断infowindow使用什么内容，整个页面的infowindow只有两种情况，抽出来减少代码量
function content_infowindow(item, type) {//type=0  当前显示的是流域   1 区划     ,item当前显示具体对应的graphic
    if (type == 0) {
        //显示的是流域时，系统需要显示的infowindow内容
        contentBasin = "<ul><li><b>流域名称:</b><span>" + item.attributes.Name +
                     "</span></li><li><b>流域面积:</b><span>" + item.attributes.Area + "平方千米" +
                     "</span></li><li><b>电站个数:</b><span>" +item.attributes.StationNum + " 个"+
                     "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 万平方米"+
                      "</span></li><li><b>经济开发量:</b><span>" +item.attributes.DevelopByEcNum + " 兆瓦·时"+
                     "</span></li><li><b>理论蕴藏量:</b><span>" + item.attributes.Reserves + " 万立方千米" +
                     "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦" + "</span></li></ul>";
        return contentBasin;
    }
    if (type == 1) {
        //显示的是区域时，系统需要显示的infowindow内容
        contentRegion = "<ul><li><b>区划名称:</b><span>" +item.attributes.Name +
                  "</span></li><li><b>区划面积:</b><span>" + item.attributes.Area + " 平方千米" +
                  "</span></li><li><b>电站个数:</b><span>" + item.attributes.StationNum + " 个" +
                   "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 万平方米" +
                   "</span></li><li><b>经济开发量:</b><span>" + item.attributes.DevelopByEcNum + " 兆瓦·时" +
                  "</span></li><li><b>理论蕴藏量:</b><span>" +item.attributes.Reserves + " 万立方千米" +
                  "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦" + "</span></li></ul>";
        return contentRegion;
    }
}

$(function () {
    //为图表设置宽度
    var winW = $("#divMain").width() - 20;
    var mychart1 = $('#mychart3');
    mychart1.css('width', winW + 'px');

    //分页
    $('#data_list').datagrid({ loadFilter: pagerFilter });

    //流域水系面板的表格单击事件
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(basin1Layer, row,0);
        }
    });

    //行政区划面板的表格单击事件
    $('#data_class_region').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(basin1Layer, row,0);
        }
    });

    //数据面板表格的单击事件
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_click(basin1Layer, row,0);
        }
    });

    //流域水系和行政区划tab的切换控制
    $('#tab1').tabs({
        onSelect: function (title, index) {
            if (index == 0) {
                $('#layer_select').combobox('setValue', '流域蕴含量专题图');
                //专题图切换为流域蕴含量专题图
                selectLayer("流域蕴含量专题图");
                //数据表格内容切换
                $('#data_list').datagrid('reload');
                $('#data_list').datagrid({
                    data: ArryBasin
                });
                addEchart2(ArryBasin);  //图表切换
                addBasinInfo(ArryBasin);
                layerClassCode = 0;
                $("#basin_populationGridLayer").prop("checked", true);
                $("#basin_scslopeareaLayer").prop("checked", false);
            }
            if (index == 1) {
                $('#layer_select').combobox('setValue', '区划蕴含量专题图');
                //专题图切换为区划蕴含量专题图
                selectLayer("区划蕴含量专题图");
                //数据表格内容切换
                $('#data_list').datagrid('reload');
                $('#data_list').datagrid({
                    data: ArryCity
                });
                addEchart1(ArryCity); //图表切换
                addBasinInfo(ArryCity);
                layerClassCode = 1;
                $("#basin_populationGridLayer").prop("checked", false);
                $("#basin_scslopeareaLayer").prop("checked", true);
            }
            $('#checkbox').hide();
        }
    });

    //专题图切换点击事件
    $('#layer_select').combobox({
        onSelect: function (record) {
            selectLayer(record.value);
            if (record.value == "区划蕴含量专题图") {
                $('#data_list').datagrid('reload');
                $('#data_list').datagrid({
                    data: ArryCity
                });
                addEchart1(ArryCity); //图表切换
                addBasinInfo(ArryCity);
                layerClassCode = 1;
            }
            if (record.value == "流域蕴含量专题图") {
                $('#data_list').datagrid('reload');
                $('#data_list').datagrid({
                    data: ArryBasin
                });
                addEchart2(ArryBasin);  //图表切换
                addBasinInfo(ArryBasin);
                layerClassCode = 0;
            }
        }
    });

    //流域水系复选框点击事件
    $("#basin_populationGridLayer").click(function () {
        if ($("#basin_populationGridLayer").prop("checked") == true) {
            selectLayer("流域蕴含量专题图");
            $("#basin_scslopeareaLayer").prop("checked", false);
        } else {
            $("#basin_populationGridLayer").prop("checked", true);
        }
    });

    //行政区划复选框点击事件
    $("#basin_scslopeareaLayer").click(function () {
        if ($("#basin_scslopeareaLayer").prop("checked") == true) {
            selectLayer("区划蕴含量专题图");
            $("#basin_populationGridLayer").prop("checked", false);
        } else {
            $("#basin_scslopeareaLayer").prop("checked", true);
        }
    });
});
