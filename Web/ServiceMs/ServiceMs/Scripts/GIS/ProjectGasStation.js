$(function () {
    $("#divMain .panel.window").hide();
});
//地图
var map;
//工具
var tb;
//标识当前执行空间查询或缓冲区分析
var queryorbuffer = 2;
//水电站分布专题图图层索引（大于等于10级为0，小于10级为1）
var tempwaterindex = 0;
//当前执行查询图层的索引，取消复选框选中事件，清除地图要素
var nowquerylayerindex = null;
//表示当前为绘制状态
var drawstate = 0;
//切片地址
var tiledip = "http://182.140.197.158:8080";
//服务地址
var serverip = "http://182.140.197.158:8081";

//切片地址
//var tiledip = "http://120.25.78.82:6081";
//服务地址
//var serverip = "http://120.25.78.82:6080";

require(["dojo/parser", "esri/map", "esri/dijit/InfoWindow", "esri/dijit/Scalebar", "extras/ESRICacheLayer","extras/LYYHLTiledLayer","extras/TDTRoadLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "extras/TDTImgAnnoLayer", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer","esri/dijit/Measurement", "esri/Color", "esri/tasks/query", "dijit/TitlePane", "esri/toolbars/draw", "esri/graphic", "esri/tasks/GeometryService", "esri/tasks/BufferParameters","esri/layers/ArcGISTiledMapServiceLayer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "dojo/_base/array"],
    function (parser, Map, InfoWindow, Scalebar, ESRICacheLayer, LYYHLTiledLayer,TDTRoadLayer, TDTAnnoLayer, TDTImageLayer, TDTImgAnnoLayer, FeatureLayer, GraphicsLayer, Measurement, Color, Query, Draw, Graphic, GeometryService, BufferParameters, ArcGISTiledMapServiceLayer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, arrayUtils) {
        parser.parse();//解析页面，如测量工具组件
        map = new Map("map",
        {
            logo: false,
            center: [104.0706, 30.164789],
            minZoom: 6,
            maxZoom: 12
        });

        //加载天地图基础底图
        baseMap_roadLayer = new TDTRoadLayer();
        map.addLayer(baseMap_roadLayer);
        baseMap_roadLayer.hide();
        baseMap_annoLayer = new TDTAnnoLayer();
        map.addLayer(baseMap_annoLayer);
        baseMap_annoLayer.hide();
        baseMap_imageLayer = new TDTImageLayer();
        map.addLayer(baseMap_imageLayer);
        baseMap_imageLayer.hide();
        baseMap_imgannoLayer = new TDTImgAnnoLayer();
        map.addLayer(baseMap_imgannoLayer);
        baseMap_imgannoLayer.hide();
        baseMap_border = new ESRICacheLayer(tiledip + "/sc_sj/_alllayers/");//省界缓冲
        map.addLayer(baseMap_border);
        baseMap_border.hide();
        //比例尺
        var scalebar = new Scalebar({
            map: map,
            scalebarUnit: "dual"
        });

        //设置地图的中心点和缩放层级
        var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
        map.centerAndZoom(pt, 5);

        //水电站图例和绑定信息框
        map.on("zoom-end", function () {
            dynamicGraphicLayer();
        });

        //清除要素
        function cleargraphics() {
            map.infoWindow.hide();
            if (tb) {
                tb.deactivate();
                drawstate = 0;
            }
            map.graphics.clear();
            $("#divMain .panel.window").hide();
        }

        //通过注销测量工具，再实例化一个工具（测量工具不存在取消激活状态，这里采用销毁、再生的方式）
        $("#measurementbar").on("click", function () {
            cleargraphics();
        });
        //空间查询
        $("#selectbar").on("click", function () {
            cleargraphics();
            queryorbuffer = 0;
        });
        //空间查询清除
        $("#cleardraw1").on("click", function () {
            cleargraphics();
        });
        //缓冲区分析清除
        $("#cleardraw2").on("click", function () {
            cleargraphics();
        });
        //激活工具，绘制图形
        var tb = new esri.toolbars.Draw(map);
        tb.on("draw-end", doqueryorbuffer);

        //空间查询——选择
        $("#querytask").on("click", function () {
            drawstate = 1;
            map.graphics.clear();
            map.infoWindow.hide();
            if (tb) {
                tb.deactivate();
                var selectedlayer = $("#selectedlayer1").val();
                if (selectedlayer == null) {
                    $.easyui.topShow("未选中图层");
                } else {
                    tb.activate($("#querytool").val());//激活相应功能
                    map.setMapCursor("pointer");
                }
            }
        });

        //绘图结束后执行事件
        function doqueryorbuffer(result) {
            drawstate = 0;
            map.setMapCursor("default");
            if (queryorbuffer == 0) {
                doquery(result, 0);
            } else if (queryorbuffer == 1) {
                dobuffer(result, 1);
            }
        }
        //查询结果显示到datagrid
        function deleterepeat(data) {
            $("#wtable").datagrid({
                data: data
            });
            $("#divMain .panel.window").show();
        }
        //datagrid行点击事件
        $("#wtable").datagrid({
            onClickRow: function (index, row) {
                var tempindex = row.INDEX;
                var piid = row.Piid;
                showinfowindow(tempindex, piid);
            }
        });
        //要素点击事件查询数据接口
        var queryByPiidPath = [
            '',
            "/GIS/EnergyResourceWebApi/GetBasinDataByPiid", //流域蕴含量
            '/GIS/EnergyResourceWebApi/GetCityDataByPiid', //区域蕴含量
            '', '', '', '', '', '', '',
            '/GIS/EnergyResourceWebApi/GetCoalbedDataByPiid', //煤层气
            '/GIS/EnergyResourceWebApi/GetCoalDataByPiid', //煤炭资源
            '',
            '', //天然气
            '',
            '/GIS/EnergyProjectWebApi/GetFiredatabypiid', //火电站
            '/GIS/EnergyProjectWebApi/GetFiredatabypiid', //燃煤电站
            '/GIS/EnergyProjectWebApi/GetFiredatabypiid', //燃气电站
            '', '',
            '/GIS/EnergyProjectWebApi/GetWaterdatabypiid', //水电站
            '', '',
            "/GIS/EnergyProjectWebApi/GetWindDataByPiid", //风电站
            '', '',
            '/GIS/EnergyProjectWebApi/GetSolardatabypiid', //太阳能电站
            '/GIS/EnergyProjectWebApi/GetBiomassDataByPiid', //生物质电站
            '', '', '', '', '', '', '', '',
            '/GIS/EnergyProjectWebApi/GetCoalDataByPiid', //煤炭项目
            '/GIS/EnergyProjectWebApi/GetPowerLinedatabypiid', //输电线路
            '/GIS/EnergyProjectWebApi/GetSubDataByPiid', //变电站
            '', '', '', '', '', '', '', '', '',
            '/GIS/EnergyResourceWebApi/GetCoalDataByPiid'//低热值煤资源
        ];
        //daragrid行点击显示信息框
        function showinfowindow(index, code) {
            $.post(queryByPiidPath[index], { piid: code }, function (result) {
                var dataobj = FormatJsonDefault(JSON.parse(result))[0];
                var obj = {
                    attributes: dataobj
                }
                map.infoWindow.hide();
                var content = content_infowindow(obj, index);
                map.infoWindow.setContent(content);
                map.infoWindow.setTitle("详情");
                var wkt = new Wkt.Wkt();
                wkt.read(dataobj.Shape);
                var config = {
                    spatialReference: {
                        wkid: 4490
                    },
                    editable: false
                };
                var point = wkt.toObject(config);
                var locationpoint = null;
                var graphic = new esri.Graphic();
                graphic.geometry = point;
                if (point.type == 'polygon') {
                    var maxxpoint = getmaxxpoint(point.rings[0]);
                    locationpoint = new esri.geometry.Point(maxxpoint[0], maxxpoint[1]);
                    fullextent(graphic);
                    setTimeout(function () { map.infoWindow.show(locationpoint); }, 500);
                } else if (point.type == 'polyline') {
                    var maxxpoint = getmaxxpoint(point.paths[0]);
                    locationpoint = new esri.geometry.Point(maxxpoint[0], maxxpoint[1]);
                    fullextent(graphic);
                    setTimeout(function () { map.infoWindow.show(locationpoint); }, 500);
                } else {
                    locationpoint = point;
                    map.centerAndZoom(locationpoint, map.getZoom());
                    setTimeout(function () { map.infoWindow.show(locationpoint); }, 500);
                }
            });
        }
        //线面要素缩放到当前
        function fullextent(graphic) {
            require(["esri/graphicsUtils"], function (graphicsUtils) {
                var myExtent = graphicsUtils.graphicsExtent([graphic]);
                map.setExtent(myExtent.expand(3));
            });
        }
        //获取的x最大点(信息框显示在线或面的右侧)
        function getmaxxpoint(data) {
            var returnpoint = null;
            var array = [];
            $.each(data, function (index, item) {
                array.push(item[0]);
            });
            array.sort();
            array.reverse();
            $.each(data, function (index, item) {
                if (item[0] == array[0]) {
                    returnpoint = item;
                    return false;
                }
            });
            return returnpoint;
        }
        //缓冲区分析
        $("#bufferbar").on("click", function () {
            cleargraphics();
            queryorbuffer = 1;
        });
        //点击绘制
        $("#drawtool").on("click", function () {
            drawstate = 1;
            map.graphics.clear();
            map.infoWindow.hide();
            if (tb) {
                var selectedlayer = $("#selectedlayer2").val();
                if (selectedlayer == null) {
                    $.easyui.topShow("未选中图层");
                } else {
                    tb.deactivate();
                    tb.activate($("#tooltype").val());//激活相应功能
                }
            }
        });
        var clicktimes = 0;
        //平移
        $("#panbar").on("click", function () {
            if (clicktimes == 0) {
                map.enablePan();
                map.setMapCursor("url(/Css/images/GIS/pan.cur),auto");
                if (tb) {
                    tb.deactivate();
                }
                clicktimes++;
                return;
            }
            if ($(this).css("border-color") == "rgb(52, 186, 246)") {
                map.setMapCursor("default");
            } else {
                map.enablePan();
                map.setMapCursor("url(/Css/images/GIS/pan.cur),auto");
            }
            if (tb) {
                tb.deactivate();
            }
        });
        //地图拖拽
        map.on('mouse-drag', function () {
            if ($("#panbar").css("border-color") == "rgb(52, 186, 246)") {
                map.setMapCursor("url(/Css/images/GIS/pan.cur),auto");
            } else {
                map.setMapCursor("default");
            }
        });

        //全图
        $("#fullextentbar").on("click", function () {
            var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
            map.centerAndZoom(pt, 5);
        });
        //工具栏按钮控制
        $(".btn-toolbar").on("click", function () {
            if ($(this).attr('id') != 'panbar') {
                map.setMapCursor("default");
            }
            controlbar(this);
        });
        //工具按钮事件
        var toolManages = 0;
        $("#toolManages").click(function () {
            if (toolManages == 0) {
                $("#toolbarbutton").animate({ width: "344px" }, 900);
                $("#toolManages").css("background-color", "#34baf6").css("color", "#fff");
                $("#toolbarbox").css("display", "inline-block");
                toolManages = 1;
            } else {
                cleargraphics();
                closebarbox();
                map.setMapCursor("default");
                $("#toolbarbutton").animate({ width: "0px" }, 900);
                $("#toolManages").css("background-color", "#fff").css("color", "#000");
                $("#toolbarbox").css("display", "none");
                toolManages = 0;
            }
        });
        //执行缓冲区
        function dobuffer(eventobj) {
            var geometry = eventobj.geometry;
            var symbol;
            if (geometry.type == 'point') {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([47, 79, 79]), 1), new dojo.Color([175, 238, 238, 0.25]));
            } else if (geometry.type == 'polyline') {
                symbol = new esri.symbol.SimpleLineSymbol();
            } else {
                symbol = new esri.symbol.SimpleFillSymbol();
            }
            var graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            $.easyui.showLoadingByStr("正在生成缓冲区，请稍候...");
            var geometryService = new esri.tasks.GeometryService(serverip + "/ArcGIS/rest/services/Geometry/GeometryServer");
            var params = new esri.tasks.BufferParameters();//初始化缓冲区参数对象
            params.distances = [$("#distance").val()];//缓存距离
            params.bufferSpatialReference = new esri.SpatialReference({ 'wkid': 102100 }); //若地图空间参考不是该值，设置缓冲空间参考（必填项）
            params.outSpatialReference = map.spatialReference; //设置输出空间参考（为当前地图空间参考）
            params.unit = $("#unittype").val();//单位
            if (geometry.type === "polygon" || geometry.type === "extent") {
                geometryService.simplify([geometry], function (geometries) {
                    params.geometries = geometries;
                    geometryService.buffer(params, showBuffer, function (error) {
                        $.easyui.removeLoading(); //移除提示框
                        $.easyui.topShow("缓冲区生成失败!");
                    });//执行缓冲
                });
            } else {
                params.geometries = [geometry];
                geometryService.buffer(params, showBuffer, function (error) {
                    $.easyui.removeLoading(); //移除提示框
                    $.easyui.topShow("缓冲区生成失败!");
                });//执行缓冲
            }
        }
        //添加缓冲区生成的面要素
        function showBuffer(bufferedGeometries) {
            $.easyui.removeLoading(); //移除提示框
            var symbol = new esri.symbol.SimpleFillSymbol(
              esri.symbol.SimpleFillSymbol.STYLE_SOLID,
              new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([47, 79, 79, 0.65]), 2
              ),
              new dojo.Color([175, 238, 238, 0.35])
            );
            $.each(bufferedGeometries, function (index, geometry) {
                var graphic = new esri.Graphic(geometry, symbol);
                map.graphics.add(graphic);
                doquery(graphic, 1);
            });
        }

        //表征要素图层要素唯一性字段['', 'OBJECTID_1', 'OBJECTID', '', '', '', '', '', '', 'FID']
        var graphicsLayerId = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'FID', 'FID', 'FID', '', '', 'FID', '', '', 'FID', '', '', 'FID', 'FID', '', '', '', '', '', '', '', '', 'FID', 'OBJECTID', 'OBJECTID', '', 'FID', 'FID', '', 'FID', 'FID', '', 'FID', 'FID', ''];
        //表征当前要素名称['', 'Name', '分区名', '', '', '', '', '', '', '分区名称']
        var graphicsName = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '项目名称', '项目名称', '项目名称', '', '', '项目名称', '', '', '项目名称', '', '', 'wpName', 'wpName', '', '', '', '', '', '', '', '', 'Name', '名称', '项目名称', '', 'name', 'Name', '', 'class', 'TYPE', '', 'Name', 'Name', ''];
        //表征当前要素类型['', '水资源', '水资源', '', '', '', '', '', '', '煤炭资源']
        var graphicsType = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '火电站', '燃煤电站', '燃气电站', '', '', '水电站', '', '', '风电场', '', '', '太阳能电站', '生物质电站', '', '', '', '', '', '', '', '', '煤炭项目', '输电线路', '变电站', '', '电网站点', '电网站点', '', '电网线路', '电网线路', '', '天然气管道', '天然气管道', ''];


        //执行空间查询
        function doquery(eventobj, tabtip) {
            var geometry = eventobj.geometry;
            var symbol;
            if (geometry.type == 'point') {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([47, 79, 79]), 1), new dojo.Color([175, 238, 238, 0.25]));
            } else {
                symbol = new esri.symbol.SimpleFillSymbol();
            }
            var graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            $.easyui.showLoadingByStr("正在执行空间查询，请稍候...");
            var query = new esri.tasks.Query();
            query.geometry = geometry;
            var layer;
            if (tabtip == 0) {
                layer = $('#selectedlayer1').val();
            } else if (tabtip == 1) {
                layer = $('#selectedlayer2').val();
            }
            $.each(layerBox, function (index, item) {
                if (item == layer) {
                    nowquerylayerindex = index;
                    var zoom = map.getZoom();
                    if (index == 20) {
                        if (zoom < 10) {
                            featureLayers[index] = new esri.layers.FeatureLayer(mapServicePath[index] + "/1", {
                                mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
                                outFields: ["*"]
                            });
                        } else {
                            featureLayers[index] = new esri.layers.FeatureLayer(mapServicePath[index] + "/0", {
                                mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
                                outFields: ["*"]
                            });
                        }
                    } else {
                        featureLayers[index] = new esri.layers.FeatureLayer(mapServicePath[index] + "/0", {
                            mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
                            outFields: ["*"]
                        });
                    }
                    featureLayers[index].selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (results) {
                        $.easyui.removeLoading(); //移除提示框
                        var computeddata = [];
                        for (var i = 0; i < results.length; i++) {
                            computeddata.push({
                                Number: i + 1,
                                ID: eval('results[i].attributes.' + graphicsLayerId[index]),
                                INDEX: index,
                                Name: eval('results[i].attributes.' + graphicsName[index]),
                                Type: graphicsType[index],
                                Piid: results[i].attributes.guid
                            });
                        }
                        deleterepeat(computeddata);
                    }, function (error) {
                        $.easyui.removeLoading(); //移除提示框
                        $.easyui.topShow("空间查询失败!");
                    });
                }
            });
            tb.deactivate();
        }
        //能源分类，点击不执行事件
        var fathernode = ['GisInfor_EnergyResource', 'GisInfor_EnergyProject', 'GisInfor_EnergyPlan'];
        $.post("/Common/CommonSystemDictionary/QueryGisJson", function (treeListData) {
            //树
            $('#tt').tree({
                data: treeListData,
                checkbox: true, //使节点增加选择框
                onClick: function (node) {//点击树节点所在行，触发checkbox的check事件
                    if ($.inArray(node.id, fathernode) >= 0) {
                        return;
                    }
                    if (node.checked == false) {
                        $("#tt").tree('check', node.target);
                    } else {
                        $("#tt").tree('uncheck', node.target);
                    }
                },
                onCheck: function (node, checked) {//checkbox选中事件
                    var layer = node.id;//获取当前节点id
                    $.each(layerBox, function (index, item) {//遍历数组，定位到当前点击id索引
                        if (map != undefined) {
                            map.infoWindow.hide();
                        }
                        if (layer == item) {//获取当前索引
                            if (node.checked == false) {//选中
                                checkedevent(node, index);
                            } else {//取消选中
                                uncheckedevent(node, index);
                            }
                        }
                    });
                }
            });
        }, "json");

        //存储树id，只要树id不变，无论树的顺序以及显示效果都不影响程序运行，通过id获取数组索引，对图层和图例进行操作
        var layerBox = ["GisInfor_WaterResource", "GisInfor_WaterBasinMapResource", "GisInfor_WaterRegionMapResource", "GisInfor_WindResource", "GisInfor_WindRateMapResource", "GisInfor_WindPowerMapResource", "GisInfor_SolarResource", "GisInfor_SolarRadiationMapResource", "GisInfor_SolarEnergyMapResource","GisInfor_CoalResource", "GisInfor_CoalGasMapResource", "GisInfor_CoalResourceMapResource", "GisInfor_OilResource", "GisInfor_NatureGasResource", "GisInfor_PowerStationProject", "GisInfor_FireStation", "GisInfor_CoalStationDis", "GisInfor_GasStationDis", "GisInfor_WaterStation", "GisInfor_WaterHotMap","GisInfor_WaterStationDis", "GisInfor_WindStation", "GisInfor_WindHotMap", "GisInfor_WindStationDis", "GisInfor_SolarStation", "GisInfor_SolarHotMap", "GisInfor_SolarStationDis", "GisInfor_BiomassStation", "GisInfor_NatureGasProject", "GisInfor_GasStation", "GisInfor_GasCompany", "GisInfor_GasPieline", "GisInfor_OilProject", "GisInfor_OilStorage", "GisInfor_OilPieline", "GisInfor_OilStation", "GisInfor_CoalProject", "GisInfor_TranLineProject","GisInfor_SubStation", "GisInfor_PowerStationPlan", "GisInfor_2015PowerSiteStation", "GisInfor_2020PowerSitePlanStation", "GisInfor_PowerPieLinePlan", "GisInfor_2015PowerSitePieLine", "GisInfor_2020PowerSitePieLine", "GisInfor_GasPieLinePlan", "GisInfor_2015GasPieLine", "GisInfor_2020GasPieLine", "GisInfor_LowerPowerResource"];
        //图例
        var legendBox = ['', 'waterbasionbox', 'waterregionbox ', '', 'windspeedbox', 'windpowerbox', '', 'solarradiobox', 'solarpowerbox', '', 'coalgasbox', 'coalbox', 'oilfieldbox', 'gasfieldbox', '', 'firedbox', 'firedcoalbox', 'firedgasbox', '', 'waterheatbox', 'waterstationbox', '', 'windheatbox', 'windstationbox', '', 'solarheatbox', 'solarstationbox', 'bioenergybox', '', '', '', '', '', '', 'oilpipeline', '', 'coalprobox', 'linepowerbox', 'substationbox', '', 'stationnowbox', 'stationfuturebox', '', 'linenowbox', 'linefuturebox', '', 'gasnowbox', 'gasfuturebox', 'lowerpowerbox'];

        //切片地图服务路径字典
        var mapServicePath = [ '', "","", '', "", "", '',"","","", "", "", '','', '', serverip + '/arcgis/rest/services/scny/sc_hdz/MapServer',serverip + '/arcgis/rest/services/scny/sc_rmdz/MapServer', serverip + '/arcgis/rest/services/scny/sc_rqdz/MapServer','', '', serverip + '/arcgis/rest/services/scny/sc_sdzfb1/MapServer', '','',serverip + '/arcgis/rest/services/scny/sc_fdc/MapServer', '', '',serverip + '/arcgis/rest/services/scny/sc_tyndz/MapServer', serverip + '/arcgis/rest/services/scny/sc_swzdz/MapServer', '', '', '', '', '', '', '', '', serverip + '/arcgis/rest/services/scny/sc_mtxm/MapServer',serverip + '/arcgis/rest/services/scny/sc_sdxl/MapServer',serverip + '/arcgis/rest/services/scny/sc_bdz/MapServer', '', serverip + '/arcgis/rest/services/scny/sc_2015dwzd/MapServer',serverip + '/arcgis/rest/services/scny/sc_2020dwzd/MapServer', '', serverip + '/arcgis/rest/services/scny/sc_2015dwxl/MapServer', serverip + '/arcgis/rest/services/scny/sc_2020dwxl/MapServer', '', serverip + '/arcgis/rest/services/scny/sc_trqgdxz/MapServer',serverip + '/arcgis/rest/services/scny/sc_trqgdgh/MapServer','' ];
       
        //能源项目、规划矢量数据图层索引集合（据此判断是否可执行空间查询）
        var havefeaturelayer = ["GisInfor_FireStation", "GisInfor_CoalStationDis", "GisInfor_GasStationDis", "GisInfor_WaterStationDis", "GisInfor_WindStationDis", "GisInfor_SolarStationDis", "GisInfor_BiomassStation", "GisInfor_CoalProject", "GisInfor_TranLineProject", "GisInfor_SubStation", "GisInfor_2015PowerSiteStation", "GisInfor_2020PowerSitePlanStation", "GisInfor_2015PowerSitePieLine", "GisInfor_2020PowerSitePieLine", "GisInfor_2015GasPieLine", "GisInfor_2020GasPieLine"];

        //是否有渲染//热度图地市区县标注
        var ifimg = [19,22,25];///////////////////////////////
        //是否有四川省界缓冲//热度图、点位图省界缓冲
        var ifborder = [15, 16, 17, 19,20, 22,23, 25,26, 27, 34,36, 37, 38, 40, 41, 43, 44, 46, 47];///////////////////////////////
        //是否有区县地市//点位图地市区县
        var ifcityborder = [15, 16, 17, 20, 23, 26, 27, 34,36, 37, 38, 40, 41, 43, 44, 46, 47];///////////////////////////////
        //热点图边界用sj2，点位用sj
        var ifscborder = [19, 22, 25];
        //对象图层类型，即相关图层,0为空；1代表只有渲染图层和专题图；2代表只有地区区县和专题图；3代表有渲染、专题图和地市区县；4代表有省界缓冲、 地市区县和专题图；5代表只有专题图（注意叠加顺序）
        //0为空，1代表只有专题图；2代表专题图、省边界、地市区县（热度图）；3代表地市区县（点位）、省边界、专题图
        var layernumber = [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 3, 3, 3, 0, 2,3, 0, 2, 3, 0, 2, 3, 3, 0, 0, 0, 0, 0, 0, 3, 0, 3, 3, 3, 0,3, 3, 0, 3, 3, 0, 3, 3, 1];///////////////////////////////

        //存储所有要素图层
        var featureLayers = [];
        //切片地图服务集合
        var titlelayer = [];
        //渲染
        var renderlayers = [];
        //四川省界缓存
        var borderlayers = [];
        //地市区县
        var cityborderlayers = [];
        //矢量数据对应graphic图层
        var newgraphiclayer = [];
        //隐藏四川省界缓冲
        function hideborderlayer(index) {
            if (borderlayers[index]) {
                map.removeLayer(borderlayers[index]);
                borderlayers[index] = null;
            }
        }
        //隐藏渲染
        function hiderenderlayer(index) {
            if (renderlayers[index]) {
                map.removeLayer(renderlayers[index]);
                renderlayers[index] = null;
            }
        }
        //隐藏区县地市
        function hidecityborder(index) {
            if (cityborderlayers[index]) {
                map.removeLayer(cityborderlayers[index]);
                cityborderlayers[index] = null;
            }
        }

        //隐藏图例
        function hidelegend(index) {
            $("#" + legendBox[index]).remove();
        }
        //移除节点
        function removeulli(obj) {
            if ($.inArray(obj.id, havefeaturelayer) < 0) {
                return;
            }
            $("#selectedlayer1 option[value=" + obj.id + "]").remove();
            $("#selectedlayer2 option[value=" + obj.id + "]").remove();
        }

        //添加节点
        function addulli(obj) {
            //是否包含矢量图层
            if ($.inArray(obj.id, havefeaturelayer) < 0) {
                return;
            }
            var selectedlayer1 = $("#selectedlayer1");
            var selectedlayer2 = $("#selectedlayer2");
            if (!$("#selectedlayer1 option[value=" + obj.id + "]") || $("#selectedlayer1 option[value=" + obj.id + "]").length == 0) {
                selectedlayer1.append("<option value='" + obj.id + "'>" + obj.text + "</option>");
            }
            if (!$("#selectedlayer2 option[value=" + obj.id + "]") || $("#selectedlayer2 option[value=" + obj.id + "]").length == 0) {
                selectedlayer2.append("<option value='" + obj.id + "'>" + obj.text + "</option>");
            }
        }
        //加载图例
        function showlegend(index) {
            $("#legenddiv").prepend(legendhtml[index]);//添加图例到最上面
        }
        //加载区县地市
        function addcityborder(index, number) {
            if ($.inArray(index, ifcityborder) >= 0) {
                cityborderlayers[index] = new ESRICacheLayer(tiledip + "/sc_ds2/_alllayers/");
                cityborderlayers[index].id = "cityborderlayers" + index;
                map.addLayer(cityborderlayers[index], number);
            }
        }
        //加载四川省界缓冲
        function addborder(index, number) {
            if ($.inArray(index, ifborder) >= 0) {
                if ($.inArray(index, ifscborder) >= 0) {
                    borderlayers[index] = new ESRICacheLayer(tiledip + "/sc_sj2/_alllayers/");
                } else {
                    borderlayers[index] = new ESRICacheLayer(tiledip + "/sc_sj/_alllayers/");
                }
                borderlayers[index].id = "borderlayers" + index;
                map.addLayer(borderlayers[index], number);
            }
        }
        //加载渲染
        function addrender(index, number) {
            if ($.inArray(index, ifimg) >= 0) {
                renderlayers[index] = new ESRICacheLayer(tiledip + "/sc_ds2/_alllayers/");
                renderlayers[index].id = "renderlayers" + index;
                map.addLayer(renderlayers[index], number);
            }
        }
        //var temptip = [];
        var timer = [];
        //加载专题图
        function speciallayer(obj, index) {
            if (mapServicePath[index] == '') {
                $.easyui.removeLoading(); //移除提示框
                return;
            }
            titlelayer[index] = new esri.layers.ArcGISTiledMapServiceLayer(mapServicePath[index]);
            //设置超时，默认和arcgis server服务客户端获取服务将等待的最长时间相等
            timer[index] = setTimeout(function () {
                $.easyui.removeLoading();
                $.easyui.topShow("请求" + obj.text + "失败!");
            }, 60000);
            titlelayer[index].on('load', function (event) {
                var loadstate = event.layer.loaded;
                if (loadstate == true) {
                    postServerData(obj, index);
                    clearTimeout(timer[index]);
                    timer[index] = null;
                }
            });
        }
        //IIS切片索引(面图层)
        var iisTiledLayerIndex = [1, 2, 4, 5, 7, 8, 10, 11, 12,13, 19, 22, 25, 48];///////////////////////////////
        //IIS切片索引(图层)
        var iisTiledLineLayerIndex = [1, 2, 4, 5, 7, 8, 10, 11, 12,13, 19, 22, 25, 34, 48];///////////////////////////////
        //加载所有图层
        function showalllayer(obj, index) {
            titlelayer[index].id = "titlelayer" + index;
            if ($.inArray(index, iisTiledLayerIndex) >= 0) {
                var maplayerids = map.layerIds.slice(0);
                var layerids = ['titlelayer', 'cityborderlayers', 'borderlayers', 'renderlayers'];
                var biaoji = 5;
                $.each(iisTiledLayerIndex, function (ind, ite) {
                    $.each(layerids, function (number, obj) {
                        var tempid = maplayerids.indexOf(obj + ite) + 1;
                        if (tempid >= biaoji) {
                            biaoji = tempid;
                        }
                    });
                });
                if (layernumber[index] == 1) { //只有专题图
                    map.addLayer(titlelayer[index], biaoji);
                } else if (layernumber[index] == 2) { //专题图、省边界、地市区县（热度图）
                    addborder(index, biaoji);
                    map.addLayer(titlelayer[index], biaoji + 1);
                    addrender(index, biaoji + 2);
                } else if (layernumber[index] == 3) { //地市区县（点位）、省边界、专题图
                    addcityborder(index, biaoji);
                    addborder(index, biaoji + 1);
                    map.addLayer(titlelayer[index], biaoji + 2);
                } else if (layernumber[index] == 4) { //省界缓冲、 地市区县、专题图
                    addborder(index, biaoji);
                    addcityborder(index, biaoji + 1);
                    map.addLayer(titlelayer[index], biaoji + 2);
                }
            } else {
                if (layernumber[index] == 1) {//只有专题图
                    map.addLayer(titlelayer[index]);
                } else if (layernumber[index] == 2) {//专题图、省边界、地市区县（热度图）
                    addborder(index);
                    map.addLayer(titlelayer[index]);
                    addrender(index);
                } else if (layernumber[index] == 3) {//地市区县（点位）、省边界、专题图
                    addcityborder(index);
                    addborder(index);
                    map.addLayer(titlelayer[index]);
                } else if (layernumber[index] == 4) {//省界缓冲、 地市区县、专题图
                    addborder(index);
                    addcityborder(index);
                    map.addLayer(titlelayer[index]);
                }
            }
            showlegend(index);//加载图例
            addulli(obj);//为select添加option
            $.easyui.removeLoading(); //移除提示框
        }

        //隐藏专题图(一起隐藏渲染图层或四川省界缓冲图层)
        function hidespeciallayer(node, index) {
            if (titlelayer[index]) {
                map.removeLayer(titlelayer[index]);
                titlelayer[index] = null;
                hideborderlayer(index);
                hiderenderlayer(index);
                hidecityborder(index);
                hidegraphiclayer(index);
                hidelegend(index);
                removeulli(node);
            }
        }

        //请求切片地图服务
        function addIIStiledlayer(obj, index) {
            if (index == 1) {
                titlelayer[index] = new LYYHLTiledLayer(tiledip + "/sc_lyyhl/_alllayers/");
            } else if (index == 2) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_qyyhl/_alllayers/");
            } else if (index == 4) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_fsfb/_alllayers/");
            } else if (index == 5) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_fnmd/_alllayers/");
            } else if (index == 7) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_tyspfs/_alllayers/");
            } else if (index == 8) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_tynzyfq/_alllayers/");
            } else if (index == 10) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_mcq/_alllayers/");
            } else if (index == 11) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_mtzy/_alllayers/");
            } else if (index == 12) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_syzy/_alllayers/");
            } else if (index == 13) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_trqzy/_alllayers/");
            } else if (index == 19) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_sdzrd/_alllayers/");
            } else if (index == 22) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_fdcrd/_alllayers/");
            } else if (index == 25) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_tyndzrd/_alllayers/");
            } else if (index == 34) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_sygw/_alllayers/");
            } else if (index == 48) {
                titlelayer[index] = new ESRICacheLayer(tiledip + "/sc_mtzy/_alllayers/");
            }
            var loadstate = titlelayer[index].loaded;
            if (loadstate) {
                postServerData(obj, index);
            } else {
                $.easyui.removeLoading(); //移除提示框
                $.easyui.topShow("请求" + obj.text + "失败!");
            }
        }

        //选中复选框事件
        function checkedevent(node, index) {
            if (node.children.length > 0) {
                $.each(node.children, function (num, obj) {
                    var sonnode = 0;
                    $.each(layerBox, function (number, item) {
                        if (obj.id == item) {
                            sonnode = number;
                        }
                    });
                    if (obj.children.length > 0) {
                        $.each(obj.children, function (number, item) {
                            addrelationlayer(item, sonnode + number + 1);
                        });
                    } else {
                        addrelationlayer(obj, sonnode);
                    }
                });
            } else {
                addrelationlayer(node, index);
            }
        }
        //选中复选框,加载相关图层
        function addrelationlayer(node, index) {
            $.easyui.showLoadingByStr("正在加载" + node.text + "，请稍候...");
            if (index == 20) {//如果选择水电站，设置tempwaterindex为1
                tempwaterindex = 1;
            }
            //选中子节点再选中父节点
            if (titlelayer[index]) {
                hiderelationlayer(node, index);
            }
            //如果是切片地图，加载切片
            if ($.inArray(index, iisTiledLineLayerIndex) >= 0) {
                addIIStiledlayer(node, index);
            } else {
                speciallayer(node, index);
            }
        }


        //取消选中复选框事件
        function uncheckedevent(node, index) {
            if (node.children.length > 0) {
                $.each(node.children, function (num, obj) {
                    var sonnode = 0;
                    $.each(layerBox, function (number, item) {
                        if (obj.id == item) {
                            sonnode = number;
                        }
                    });
                    if (obj.children.length > 0) {
                        $.each(obj.children, function (number, item) {
                            hiderelationlayer(item, sonnode + number + 1);
                        });
                    } else {
                        hiderelationlayer(obj, sonnode);
                    }
                });
            } else {
                hiderelationlayer(node, index);
            }
        }
        //取消选中复选框事件
        function hiderelationlayer(node, index) {
            if (index == 20) {
                tempwaterindex = 0;
            }
            hidespeciallayer(node, index);
            if (nowquerylayerindex == index) {
                cleargraphics();
            }
        }

        var measurement = null;
        //工具按钮事件
        function closebarbox() {
            var barbutton = ['measurementbar', 'selectbar', 'bufferbar', 'panbar', 'fullextentbar'];
            var barbox = ['measurementbox', 'selectbox', 'bufferbox'];
            $.each(barbox, function (index, item) {
                if (item == 'measurementbox') {
                    if (measurement != null) {
                        measurement.destroy();
                        $("#measurementbox").remove();
                        measurement = null;
                    }
                } else if (!$("#" + item).is(":hidden")) {
                    $("#" + item).hide();
                }
            });
            $.each(barbutton, function (index, item) {
                if ($("#" + item).css("border-color") == "rgb(52, 186, 246)") {
                    $("#" + item).css({ "border-color": "#DCDCDC" });
                }
            });
        }
        //存储工具选中状态
        var clickedbox = [0, 0, 0, 0, 0];
        //控制工具栏
        function controlbar(bar) {
            var barbutton = ['measurementbar', 'selectbar', 'bufferbar', 'panbar', 'fullextentbar'];
            var barbox = ['measurementbox', 'selectbox', 'bufferbox'];
            var barindex = null;
            $.each(barbutton, function (index, item) {
                if (item != bar.id) {
                    $("#" + item).css({ "border-color": "#DCDCDC" });
                    clickedbox[index] = 0;
                } else {
                    if (index == 4) {
                        $("#" + item).css({ "border-color": "#34baf6" });
                        setTimeout(function () {
                            if ($("#fullextentbar").css("border-color") == "rgb(52, 186, 246)") {
                                $("#fullextentbar").css({ "border-color": "#DCDCDC" });
                            }
                        }, 300);
                    } else {
                        barindex = index;
                        clickedbox[index] = 1 - clickedbox[index];
                        if (clickedbox[index] == 0) {
                            $("#" + item).css({ "border-color": "#DCDCDC" });
                        } else {
                            $("#" + item).css({ "border-color": "#34baf6" });
                        }
                    }
                }
            });
            if (barindex > barbox.length - 1) {
                $.each(barbox, function (index, item) {
                    if (index == 0) {
                        if (measurement != null) {
                            measurement.destroy();
                            $("#measurementbox").remove();
                            measurement = null;
                        }
                    } else {
                        if (!$("#" + item).is(":hidden")) {
                            $("#" + item).hide();
                        }
                    }
                });
            } else {
                $.each(barbox, function (index, item) {
                    if (index == 0) {
                        if (barindex == 0) {
                            if (measurement == null) {
                                $("#selectbox").before("<div id=\"titlePane\"><div id=\"measurementbox\"></div></div>");
                                measurement = new esri.dijit.Measurement({
                                    map: map
                                }, document.getElementById("measurementbox"));
                                measurement.startup();
                                measurement.on("tool-change", function () {
                                    if (!measurement) {
                                        return;
                                    }
                                    $('.esriMeasurementTableCell').eq(0).text('--');
                                    $('.esriMeasurementTableCell').eq(1).text('--');
                                    $('.esriMeasurementTableCell').eq(2).text('--');
                                    $('.esriMeasurementTableCell').eq(3).text('--');
                                });
                                map.on("mouse-move", function (event) {
                                    if (!measurement) {
                                        return;
                                    }
                                    var point = event.mapPoint;
                                    $('.esriMeasurementTableCell').eq(0).text(point.x.toFixed(6));
                                    $('.esriMeasurementTableCell').eq(1).text(point.y.toFixed(6));
                                });
                                map.on("click", function (event) {
                                    if (!measurement) {
                                        return;
                                    }
                                    var point = event.mapPoint;
                                    $('.esriMeasurementTableCell').eq(0).text(point.x.toFixed(6));
                                    $('.esriMeasurementTableCell').eq(1).text(point.y.toFixed(6));
                                    $('.esriMeasurementTableCell').eq(2).text(point.x.toFixed(6));
                                    $('.esriMeasurementTableCell').eq(3).text(point.y.toFixed(6));
                                });
                            } else {
                                measurement.destroy();
                                $("#measurementbox").remove();
                                measurement = null;
                            }
                        } else {
                            if (measurement != null) {
                                measurement.destroy();
                                $("#measurementbox").remove();
                                measurement = null;
                            }
                        }
                    } else {
                        if (index == barindex) {
                            if ($("#" + item).is(":hidden")) {
                                $("#" + item).show();
                            } else {
                                $("#" + item).hide();
                            }
                        } else {
                            if (!$("#" + item).is(":hidden")) {
                                $("#" + item).hide();
                            }
                        }
                    }
                });
            }
        }
        //设置单一选中状态符号
        function setsymbol(geometry) {
            var symbol = null;
            switch (geometry.type) {
                case "point":
                    symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([0, 255, 0]));
                    break;
                case "multipoint":
                    symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([0, 255, 0]));
                    break;
                case "polyline":
                    symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255, 0.5]), 3);
                    break;
                case "polygon":
                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255, 0.5]), 3), new dojo.Color([153, 102, 51, 1]));
                    break;
                case "extent":
                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255, 0.5]), 3), new dojo.Color([153, 102, 51, 1]));
                    break;
            }
            return symbol;
        }
        //设置选择结果要素符号
        function returnsymbol(geometry) {
            var symbol = null;
            switch (geometry.type) {
                case "point":
                    symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([47, 79, 79]), 1), new dojo.Color([175, 238, 238, 0.25]));
                    break;
                case "multipoint":
                    symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([47, 79, 79]), 1), new dojo.Color([175, 238, 238, 0.25]));
                    break;
                case "polyline":
                    symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([225, 255, 255]), 1);
                    break;
                case "polygon":
                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([225, 255, 255]), 2), new dojo.Color([225, 255, 255, 0.25]));
                    break;
                case "extent":
                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([225, 255, 255]), 2), new dojo.Color([225, 255, 255, 0.25]));
                    break;
            }
            return symbol;
        }
        //设置一个样式，表示当前选中元素
        function setnewsymbol(tempindex, tempid) {
            var thissymbol;
            var graphicindex;
            $.each(map.graphics.graphics, function (number, item) {
                if (item.attributes == undefined) {
                    return true;
                }
                if (!item.attributes.hasOwnProperty(graphicsLayerId[tempindex])) {
                    return true;
                } else if (eval('item.attributes.' + graphicsLayerId[tempindex]) == tempid) {
                    thissymbol = item.symbol;
                    graphicindex = number;
                    var symbol = setsymbol(item.geometry);
                    map.graphics.graphics[number].setSymbol(symbol);
                }
            });
            return {
                symbol: thissymbol,
                index: graphicindex
            }
        }
        //设回原样
        function setoldsymbol(tempindex, tempid, symbol) {
            map.graphics.graphics[tempid].setSymbol(symbol);
        }
        //专题图Shape数据接口
        var dataurl = ['',
            "/GIS/EnergyResourceWebApi/GetBasinAllData",
            '/GIS/EnergyResourceWebApi/GetCityAllData',
            '', '', '', '', '', '', '',
            '/GIS/EnergyResourceWebApi/GetCoalbedAllData',//煤层气
            '/GIS/EnergyResourceWebApi/GetCoalAllData',//煤炭资源
            '',
            '',//天然气
            '',
            '/GIS/EnergyProjectWebApi/QueryFireAllData',
            '/GIS/EnergyProjectWebApi/QueryFireAllData',//燃煤电站
            '/GIS/EnergyProjectWebApi/QueryFireAllData',//燃气电站
            '', '',
            '/GIS/EnergyProjectWebApi/QueryOverFiveWaterData',//水电站
            '', '',
            "/GIS/EnergyProjectWebApi/GetWindAllData",//风电站
            '', '',
            '/GIS/EnergyProjectWebApi/QuerySolarAllData',//太阳能电站
            '/GIS/EnergyProjectWebApi/QueryBiomassAllData',//生物质电站
            '', '', '', '', '', '', '', '',
            '/GIS/EnergyProjectWebApi/GetCoalAllData',//煤炭项目
            '/GIS/EnergyProjectWebApi/QueryPowerLineAllData',//输电线路
            '/GIS/EnergyProjectWebApi/QuerySubAllData',//变电站
            '', '', '', '', '', '', '', '', '',
             '/GIS/EnergyResourceWebApi/GetCoalAllData'//低热值煤资源
        ];
        //大于5w以上水电站
        var fiveupwaterdata = null;
        //全部水电站
        var allwaterdata = null;
        //将数据库请求数据存放到本地，再次请求就在本地获取
        var storagedata = [];
        //请求数据库数据
        function postServerData(obj, index) {
            if (!storagedata[index]) {
                if (dataurl[index] == '') {
                    noGraphicLayer(obj, index);
                } else {
                    $.post(dataurl[index], function (result) {
                        storagedata[index] = result;
                        constructLayer(obj, index, result);
                    });
                }
            } else {
                constructLayer(obj, index, storagedata[index]);
            }
        }
        //无graphiclayer
        function noGraphicLayer(obj, index) {
            showalllayer(obj, index);
        }

        //构造graphiclayer
        function constructLayer(obj, index, result) {
            if (result == null) {
                return;
            }
            var tempArray = JSON.parse(result);
            var jsondata = FormatJsonDefault(tempArray);//格式化数据
            fiveupwaterdata = jsondata;
            showalllayer(obj, index);
            var maplayerids = map.graphicsLayerIds.slice(0);
            var biaoji = 0;//获取当前面graphiclayer的最大索引，新的面graphiclayer将添加到此处
            $.each(plygonlayer, function (ind, ite) {
                var tempid = maplayerids.indexOf("newgraphiclayer" + ite) + 1;
                if (tempid >= biaoji) {
                    biaoji = tempid;
                }
            });
            addGraphicLayer(jsondata, index, biaoji);
        }
        //筛选燃煤和燃气
        function findCoalorGas(number, data) {
            var returnarray = [];
            $.each(data, function (index, item) {
                if (number == 16) {
                    if (item.StationType == '燃煤电站') {
                        returnarray.push(item);
                    }
                } else {
                    if (item.StationType == '燃气电站') {
                        returnarray.push(item);
                    }
                }
            });
            return returnarray;
        }
        //水电站动态加载graphiclayer
        function dynamicGraphicLayer() {
            var zoom = map.getZoom();
            if (tempwaterindex == 1) {
                if (zoom >= 10) {
                    if (allwaterdata == null) {
                        $.post('/GIS/EnergyProjectWebApi/QueryWaterAllData', function (result) {
                            if (result == null) {
                                return;
                            }
                            var tempArray = JSON.parse(result);
                            allwaterdata = FormatJsonDefault(tempArray); //格式化数据
                            addGraphicLayer(allwaterdata, 20);
                        });
                    } else {
                        addGraphicLayer(allwaterdata, 20);
                    }
                    $("#waterimg").attr("src", "/Css/images/GIS/legend/水电站分布_水电站信息.png");
                } else if (zoom <= 9) {
                    addGraphicLayer(fiveupwaterdata, 20);
                    $("#waterimg").attr("src", "/Css/images/GIS/legend/水电站分布_水电站信息5W以上.png");
                }
            }
        }
        //隐藏graphiclayer
        function hidegraphiclayer(index) {
            if (newgraphiclayer[index]) {
                map.removeLayer(newgraphiclayer[index]);
                newgraphiclayer[index] = null;
            }
        }
        var plygonlayer = [1, 2, 10, 11, 36,48];//graphiclayer面
        //加载透明GraphicLayer
        function addGraphicLayer(data, number, index) {
            if (number == 20) {
                if (newgraphiclayer[number]) {
                    map.removeLayer(newgraphiclayer[number]);
                    newgraphiclayer[number] = null;
                }
            }
            newgraphiclayer[number] = new esri.layers.GraphicsLayer();
            newgraphiclayer[number].id = 'newgraphiclayer' + number;
            if ($.inArray(number, plygonlayer) >= 0) {
                map.addLayer(newgraphiclayer[number], index);
            } else {
                map.addLayer(newgraphiclayer[number]);
            }
            
            $.each(data, function (index, item) {
                var shape = item.Shape;
                if (shape == '--') {
                    return true;
                }
                var wkt = new Wkt.Wkt();
                wkt.read(shape);
                var config = {
                    spatialReference: {
                        wkid: 4490
                    },
                    editable: false
                };
                var polygon = wkt.toObject(config);
                var geometrytype = polygon.type;
                var symbol = null;
                if (geometrytype == 'point') {//图形越简单，渲染越快
                    symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255, 0.0001]), 1), new dojo.Color([255, 255, 255, 0.0001]));
                } else if (geometrytype == 'polyline') {
                    symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255, 0.0001]), 3);
                } else if (geometrytype == 'polygon') {
                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255, 0.0001]), 3), new dojo.Color([255, 255, 255, 0.0001]));
                }
                var graphicWeb = new esri.Graphic();
                graphicWeb.geometry = polygon;
                graphicWeb.attributes = item;
                graphicWeb.setSymbol(symbol);
                newgraphiclayer[number].add(graphicWeb);
            });
            newgraphiclayer[number].on("click", function (event) {
                //var maplayerids = map.graphicsLayerIds.slice(0);
                //var biaoji = 0;
                //$.each(plygonlayer, function (ind, ite) {
                //    var tempid = maplayerids.indexOf("newgraphiclayer" + ite) + 1;
                //    if (tempid >= biaoji) {
                //        biaoji = ite;
                //    }
                //});
                var lmaplayerids = map.layerIds.slice(0);
                var layerids = ['titlelayer', 'cityborderlayers', 'borderlayers', 'renderlayers'];
                var lbiaoji = 5;
                var tempindex = 0;
                $.each(iisTiledLayerIndex, function (ind, ite) {
                    $.each(layerids, function (number, obj) {
                        var tempid = lmaplayerids.indexOf(obj + ite) + 1;
                        if (tempid >= lbiaoji) {
                            lbiaoji = tempid;
                            tempindex = ite;
                        }
                    });
                });
                if ($.inArray(number, plygonlayer) >= 0) {
                    if (number != tempindex) {//判断最上层面最上层graphiclayer
                        return;
                    }
                }
                if (drawstate == 1) {//当初是否处于绘图状态
                    return;
                }
                map.infoWindow.hide();
                if (event.graphic.attributes.Piid && event.graphic.attributes.Piid != "--") {
                    $.post(queryByPiidPath[number], { piid: event.graphic.attributes.Piid }, function (result) {
                        var dataobj = FormatJsonDefault(JSON.parse(result))[0];
                        var obj = {
                            attributes: dataobj
                        }
                        var content = content_infowindow(obj, number);
                        map.infoWindow.setContent(content);
                        map.infoWindow.setTitle("详情");
                        map.infoWindow.show(event.mapPoint);
                    });
                }
            });
        }
    });
//设置infowindow窗体信息
function content_infowindow(item, type) {
    var content = '';
    if (type == 1) {
        content = "<ul><li><b>流域名称:</b><span>" + item.attributes.Name +
                     "</span></li><li><b>流域面积:</b><span>" + item.attributes.Area + "平方千米" +
                     "</span></li><li><b>电站个数:</b><span>" + item.attributes.StationNum + " 个" +
                     "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 兆瓦" +
                     "</span></li><li><b>理论可开发量:</b><span>" + item.attributes.DevelopByEcNum + " 兆瓦" +
                     "</span></li><li><b>已建成装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 万千瓦" +
                     "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityInConstruction + " 万千瓦" +
                     "</span></li><li><b>可开发装机容量:</b><span>" + item.attributes.InstalledCapacityToBeDeveloped + " 万千瓦" +
                     "</span></li></ul>";
    }
    else if (type == 2) {
        content = "<ul><li><b>流域名称:</b><span>" + item.attributes.Name +
                     "</span></li><li><b>流域面积:</b><span>" + item.attributes.Area + "平方千米" +
                     "</span></li><li><b>电站个数:</b><span>" + item.attributes.StationNum + " 个" +
                     "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 兆瓦" +
                     "</span></li><li><b>理论可开发量:</b><span>" + item.attributes.DevelopByEcNum + " 兆瓦" +
                     "</span></li><li><b>已建成装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 万千瓦" +
                     "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityInConstruction + " 万千瓦" +
                     "</span></li><li><b>可开发装机容量:</b><span>" + item.attributes.InstalledCapacityToBeDeveloped + " 万千瓦" +
                     "</span></li></ul>";
    } else if (type == 4 || type == 5) {
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>预计可开发容量:</b><span>" + item.attributes.InstalledCapacityToTheory + " 兆瓦"
                + "</span></li><li><b>已建成装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 万千瓦"
                + "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityInConstruction + " 万千瓦"
                + "</span></li><li><b>平均风速:</b><span>" + item.attributes.AverageWindspeed + " 千米/小时"
                + "</span></li><li><b>平均风功率密度:</b><span>" + item.attributes.AverageWindpowerDensity + " 兆瓦/平方千米"
                + "</span></li><li><b>年平均等效满负荷小时数:</b><span>" + item.attributes.AverageAnnualHours + " 小时"
                + "</span></li></ul>";
    } else if (type == 7 || type == 8) {
        content = "<ul><li><b>分区名称:</b><span>" + item.attributes.Name
               + "</span></li><li><b>年均日照时数:</b><span>" + item.attributes.AverageAnnualSunshineHours + " 小时"
               + "</span></li><li><b>年均总辐射量:</b><span>" + item.attributes.AverageAnnualTotalRadiationAmount + " 兆焦/平方千米·年"
               + "</span></li><li><b>可开发总容量:</b><span>" + item.attributes.RecoverableReserves + " 兆瓦"
               + "</span></li><li><b>已建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦"
               + "</span></li><li><b>年利用小时数:</b><span>" + item.attributes.AverageAnnualHours + " 小时"
               + "</span></li><li><b>资源等级:</b><span>" + item.attributes.ResourcesLevel
               + "</span></li><li><b>年平均辐射量:</b><span>" + item.attributes.AverageAnnualRadiation + " 兆焦/平方千米·天"
            + "</span></li></ul>";
    } else if (type == 9) {
        content = "<ul><li><b>矿区名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>所在地:</b><span>" + item.attributes.AddressName
                + "</span></li><li><b>煤层结构:</b><span>" + item.attributes.CoalSeamStructure
                + "</span></li><li><b>年产量:</b><span>" + item.attributes.AnnualYield + " 万吨"
                + "</span></li><li><b>主要煤类:</b><span>" + item.attributes.MainCoalSpecies
                + "</span></li><li><b>面积:</b><span>" + item.attributes.Area + " 平方千米"
                + "</span></li><li><b>探明储量:</b><span>" + item.attributes.Reserves + " 万吨" + "</span></li></ul>";
    }
    else if (type == 36) {//煤炭项目
        content = "<ul><li><b>煤矿名称:</b><span>" + item.attributes.Name
                           + "</span></li><li><b>所属区域:</b><span>" + item.attributes.BelongToCoalRegion
                           + "</span></li><li><b>生产能力:</b><span>" + item.attributes.AnnualManufacturability + " 万吨"
                           + "</span></li><li><b>主要煤种:</b><span>" + item.attributes.MainCoalSpecies
                           + "</span></li><li><b>可采储量:</b><span>" + item.attributes.RecoverableReserves + " 万吨"
                           + "</span></li><li><b>开拓方式:</b><span>" + item.attributes.ExploreMode
                           + "</span></li><li><b>运输方式:</b><span>" + item.attributes.VentilationMode
                           + "</span></li><li><b>详细地址:</b><span>" + item.attributes.Address
                           + "</span></li></ul>";
    } else if (type == 15 || type == 16 || type == 17) {//火电站
        content = "<ul><li><b>项目名称:</b><span>" + item.attributes.FrieStationName
             + "</span></li><li><b>状态:</b><span>" + item.attributes.State
             + "</span></li><li><b>所在区县:</b><span>" + item.attributes.BelongToCountryName
             + "</span></li><li><b>业主单位:</b><span>" + item.attributes.OwnerUnitName
             + "</span></li><li><b>建设单位:</b><span>" + item.attributes.ConstructionUnitNames
             + "</span></li><li><b>投资集团:</b><span>" + item.attributes.InvestorUnitNames
             + "</span></li></ul>";
    } else if (type == 20) {//水电站
        content =
             "<ul><li><b>电站名称:</b><span>" + item.attributes.WaterStationName
             + "</span></li><li><b>电站类型:</b><span>" + item.attributes.WaterStationType
             + "</span></li><li><b>建设状态:</b><span>" + item.attributes.State
             + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 万千瓦"
             + "</span></li><li><b>机组台数:</b><span>" + item.attributes.AlternatorQuantity + " 台"
             + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 万千瓦"
             + "</span></li><li><b>所属流域:</b><span>" + item.attributes.BelongToBasin
             + "</span></li><li><b>所在区县:</b><span>" + item.attributes.BelongToCountryName
             + "</span></li><li><b>业主单位:</b><span>" + item.attributes.OwnerUnitName
             + "</span></li><li><b>建设单位:</b><span>" + item.attributes.ConstructionUnitNames
             + "</span></li><li><b>投资集团:</b><span>" + item.attributes.InvestorUnitNames
             + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
             + "</span></li></ul>";
    } else if (type == 27) {//生物质
        content = "<ul><li><b>电站名称:</b><span>" + item.attributes.BiomassStationName
                        + "</span></li><li><b>建设状态:</b><span>" + item.attributes.State
                        + "</span></li><li><b>机组台数:</b><span>" + item.attributes.UnitsAmount + " 台"
                        + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 万千瓦"
                        + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 万千瓦"
                        + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 万千瓦"
                        + "</span></li><li><b>业主单位:</b><span>" + item.attributes.OwnerUnitName
                        + "</span></li><li><b>投资集团:</b><span>" + item.attributes.InvestorUnitNames
                        + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnitNames
                        + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                        + "</span></li></ul>";
    } else if (type == 23) {//风电站
        content = "<ul><li><b>风电场名称:</b><span>" + item.attributes.WindStationName
                        + "</span></li><li><b>建设状态:</b><span>" + item.attributes.State
                        + "</span></li><li><b>所在区县:</b><span>" + item.attributes.BelongToCountryName
                        + "</span></li><li><b>机组台数:</b><span>" + item.attributes.UnitsAmount + " 台"
                        + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 万千瓦"
                        + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 万千瓦"
                        + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 万千瓦"
                        + "</span></li><li><b>业主单位:</b><span>" + item.attributes.OwnerUnitName
                        + "</span></li><li><b>投资集团:</b><span>" + item.attributes.InvestorUnitNames
                        + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnitNames
                        + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                        + "</span></li></ul>";
    } else if (type == 26) {//光伏
        content = "<ul><li><b>电站名称:</b><span>" + item.attributes.SolarStationName
                        + "</span></li><li><b>建设状态:</b><span>" + item.attributes.State
                        + "</span></li><li><b>机组台数:</b><span>" + item.attributes.UnitsAmount + " 台"
                        + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 万千瓦"
                        + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 万千瓦"
                        + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 万千瓦"
                        + "</span></li><li><b>业主单位:</b><span>" + item.attributes.OwnerUnitName
                        + "</span></li><li><b>投资集团:</b><span>" + item.attributes.InvestorUnitNames
                        + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnitNames
                        + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                        + "</span></li></ul>";
    } else if (type == 37) {//输电线路
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
                   + "</span></li><li><b>类别:</b><span>" + item.attributes.Type
                   + "</span></li><li><b>起点:</b><span>" + item.attributes.StartPoint
                   + "</span></li><li><b>终点:</b><span>" + item.attributes.EndPoint
                   + "</span></li><li><b>长度:</b><span>" + item.attributes.Length + " 千米"
                   + "</span></li><li><b>最大传输功率:</b><span>" + item.attributes.Maxtransmission
                   + "</span></li><li><b>年传送体积:</b><span>" + item.attributes.AnnTransVol
                   + "</span></li><li><b>负载:</b><span>" + item.attributes.LoadRate
                   + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                   + "</span></li></ul>";
    } else if (type == 38) {//变电站
        content = "<ul><li><b>电站名称:</b><span>" + item.attributes.Name
                    + "</span></li><li><b>类别:</b><span>" + item.attributes.Type
                    + "</span></li><li><b>地址:</b><span>" + item.attributes.Address
                    + "</span></li><li><b>电压等级:</b><span>" + item.attributes.VoltageLevel + ' 千伏'
                    + "</span></li><li><b>主变容量:</b><span>" + item.attributes.MainTransformerCapacity + ' 千瓦'
                    + "</span></li><li><b>下网负载:</b><span>" + item.attributes.NetLoad + ' 千瓦'
                    + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                    + "</span></li></ul>";
    } else if (type == 34) {
        content = "<ul><li><b>管道名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>管道类型:</b><span>规划</span></li>"
                + "<li><b>管道走向:</b><span>" + item.attributes.PipelineMoveTowards + "</span></li>"
                + "<li><b>管径:</b><span>" + item.attributes.PipeDiameter + " 米" + "</span></li>"
                + "<li><b>设计压力:</b><span>" + item.attributes.Pressure + " 兆帕" + "</span></li>"
                + "<li><b>年输气能力:</b><span>" + item.attributes.YeargasTransportationCapacity + " 亿方" + "</span></li>"
                + "<li><b>全长:</b><span>" + item.attributes.Length + " 千米" + "</span></li>"
                + "</ul>";
    } else if (type == 10) {
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name +
                     "</span></li><li><b>面积:</b><span>" + item.attributes.Area + " 平方千米" +
                     "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 兆瓦" +
                     "</span></li><li><b>理论可开发量:</b><span>" + item.attributes.DevelopByEcNum + " 兆瓦" + "</span></li></ul>";
    } else if (type == 11||type==48) {
        content = "<ul><li><b>矿区名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>所在地:</b><span>" + item.attributes.AddressName
                + "</span></li><li><b>煤层结构:</b><span>" + item.attributes.CoalSeamStructure
                + "</span></li><li><b>年产量:</b><span>" + item.attributes.AnnualYield + " 万吨"
                + "</span></li><li><b>主要煤类:</b><span>" + item.attributes.MainCoalSpecies
                + "</span></li><li><b>面积:</b><span>" + item.attributes.Area + " 平方千米"
                + "</span></li><li><b>探明储量:</b><span>" + item.attributes.Reserves + " 万吨" + "</span></li></ul>";
    } else if (type == 13) {
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name +
                     "</span></li><li><b>面积:</b><span>" + item.attributes.Area + "平方千米" +
                     "</span></li><li><b>地址:</b><span>" + item.attributes.Address +
                     "</span></li><li><b>探明储量:</b><span>" + item.attributes.ProvedReserves + " 亿立方米" +
                     "</span></li><li><b>控制储量:</b><span>" + item.attributes.ControlledReserves + " 亿立方米" +
                     "</span></li><li><b>预测储量:</b><span>" + item.attributes.EstimatedReserves + " 亿立方米" +
                     "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 千立方米" +
                     "</span></li><li><b>理论可开发量:</b><span>" + item.attributes.DevelopByEcNum + " 千立方米" +
                     "</span></li><li><b>年产量:</b><span>" + item.attributes.AnnualOutput + " 千立方米" + "</span></li></ul>";
    }
    return content;
}
//动态生成图例，最近一次选择，将图例添加到图例div的最上面
var legendhtml = [
    '',
    '<div id="waterbasionbox"><ul><li><div class="legendTitle">流域蕴含量</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/流域蕴含量分布.png" /></li></ul></div>',
    '<div id="waterregionbox"><ul><li><div class="legendTitle">区域蕴含量</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/水资源区划蕴含量.png" /></li></ul></div>',
    '',
    '<div id="windspeedbox"><ul><li><div class="legendTitle">风速分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/四川省风速分布.png" /></li></ul></div>',
    '<div id="windpowerbox"><ul><li><div class="legendTitle">风功率密度</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/四川省风能密度.png" /></li></ul></div>',
    '',
    '<div id="solarradiobox"><ul><li><div class="legendTitle">太阳辐射</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/太阳水平辐射.png" /></li></ul></div>',
    '<div id="solarpowerbox"><ul><li><div class="legendTitle">太阳能资源分区</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/太阳能资源分区.png" /></li></ul></div>',
    '',
    '<div id="coalgasbox"><ul><li><div class="legendTitle">煤层气分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/煤层气.png" /></li></ul></div>',
    '<div id="coalbox"><ul><li><div class="legendTitle">煤炭资源分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/煤炭资源.png" /></li></ul></div>',
    '<div id="oilfieldbox"><ul><li><div class="legendTitle">石油资源分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/石油资源.png" /></li></ul></div>',
    '<div id="gasfieldbox"><ul><li><div class="legendTitle">天然气资源分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/天然气.png" /></li></ul></div>',
    '',
    '<div id="firedbox"><ul><li><div class="legendTitle">火电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/火电站.png" /></li></ul></div>',
    '<div id="firedcoalbox"><ul><li><div class="legendTitle">燃煤电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/燃煤电站.png" /></li></ul></div>',
    '<div id="firedgasbox"><ul><li><div class="legendTitle">燃气电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/燃气电站.png" /></li></ul></div>',
    '',
    '<div id="waterheatbox"><ul><li><div class="legendTitle">水电站热度分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/水电站热度分布.png" /></li></ul></div>',
    '<div id="waterstationbox"><ul><li><div class="legendTitle">水电站</div></li><li><img id="waterimg" class="legendimgBig" onclick="" src="/Css/images/GIS/legend/水电站分布_水电站信息5W以上.png" /></li></ul></div>',
    '',
    '<div id="windheatbox"><ul><li><div class="legendTitle">风电场热度分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/风电场热度分布.png" /></li></ul></div>',
    '<div id="windstationbox"><ul><li><div class="legendTitle">风电场</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/风电场分布.png" /></li></ul></div>',
    '',
    '<div id="solarheatbox"><ul><li><div class="legendTitle">太阳能电站热度分布</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/太阳能热度图.png" /></li></ul></div>',
    '<div id="solarstationbox"><ul><li><div class="legendTitle">太阳能电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/太阳能电站分布.png" /></li></ul></div>',
    '<div id="bioenergybox"><ul><li><div class="legendTitle">生物质电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/生物质电站分布.png" /></li></ul></div>',
    '', '', '', '', '', '',
    '<div id="oilpipeline"><ul><li><div class="legendTitle">输油管网</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/输油管网.png" /></li></ul></div>',
    '',
    '<div id="coalprobox"><ul><li><div class="legendTitle">煤炭项目</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/煤炭项目.png" /></li></ul></div>',
    '<div id="linepowerbox"><ul><li><div class="legendTitle">输电线</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/输电线路.png" /></li></ul></div>',
    '<div id="substationbox"><ul><li><div class="legendTitle">变电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/变电站.png" /></li></ul></div>',
    '',
    '<div id="stationnowbox"><ul><li><div class="legendTitle">2015电网站点</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/2015电网站点.png" /></li></ul></div>',
    '<div id="stationfuturebox"><ul><li><div class="legendTitle">2020电网站点</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/2020电网站点.png" /></li></ul></div>',
    '',
    '<div id="linenowbox"><ul><li><div class="legendTitle">2015电网线路</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/2015电网线路.png" /></li></ul></div>',
    '<div id="linefuturebox"><ul><li><div class="legendTitle">2020电网线路</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/2020电网线路.png" /></li></ul></div>',
    '',
    '<div id="gasnowbox"><ul><li><div class="legendTitle">天然气管道现状</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/天然气管道现状.png" /></li></ul></div>',
    '<div id="gasfuturebox"><ul><li><div class="legendTitle">天然气管道规划</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/天然气管道规划.png" /></li></ul></div>',
    '<div id="lowerpowerbox"><ul><li><div class="legendTitle">低热值煤资源</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/legend/煤炭资源.png" /></li></ul></div>'
];
