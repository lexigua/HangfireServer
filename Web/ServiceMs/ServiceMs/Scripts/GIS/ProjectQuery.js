var map;
var graphiclayer;//要素图层
require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer", "extras/ThematicLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "extras/TDTImgAnnoLayer", "esri/layers/GraphicsLayer"], function (Map, InfoWindow, TDTRoadLayer, ThematicLayer, TDTAnnoLayer, TDTImageLayer, TDTImgAnnoLayer, GraphicsLayer) {
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
    baseMap_imgannoLayer = new TDTImgAnnoLayer();
    map.addLayer(baseMap_imgannoLayer);
    baseMap_imgannoLayer.hide();
    graphiclayer = new esri.layers.GraphicsLayer();//初始化要素图层
    //设置地图的中心点和缩放层级
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    map.centerAndZoom(pt, 7);
});
function clearmap() {
    graphiclayer.clear();
}


function AddStationToLayer(data) {
    if (map) {
        map.infoWindow.hide();
    }

    map.addLayer(graphiclayer);
    graphiclayer.clear();
    map.graphics.clear();
    $.each(data, function (index, item) {
        var coor = item.Coordinate;//获取Shape
        if (!coor || coor == '--' || coor == '暂无') {
            return true;
        }
        var type = item.Type;//类型，如电站，输电线等
        var wkt = new Wkt.Wkt();
        wkt.read(coor);
        var config = {
            spatialReference: {
                wkid: 4490
            },
            editable: false
        };
        var mygeometry = wkt.toObject(config);
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = mygeometry;
        graphicWeb.attributes = item;
        var geometry = graphicWeb.geometry.type;
        var symbol = SetStationSymbol(geometry, type);
        judgetype(type);//判断类型，控制图例
        graphicWeb.setSymbol(symbol);
        graphiclayer.add(graphicWeb);
    });
    //鼠标点击事件
    graphiclayer.on('click', function (event) {
        map.infoWindow.hide();
        map.graphics.clear();
        var geotype = event.graphic.geometry.type;
        var symbol = event.graphic.symbol;
        var type = event.graphic.attributes.Type;
        if (geotype == 'point') {
            symbol.setWidth(25);
            symbol.setHeight(30);
        } else if (geotype == 'polyline') {
            symbol.setWidth(4);
        } else if (geotype == 'polygon') {
            symbol.outline.setWidth(4);
        }
        event.graphic.setSymbol(symbol);
        var id = event.graphic.attributes.Id;
        var url = event.graphic.attributes.Url;
        var data;
        var newurl = url.substring(0, url.lastIndexOf('/'));
        $.post(newurl + "/DetailData?id=" + id, function (result) {//通过该接口，根据点击graphic的id返回属性数据
            data = JsonObjDefault(JSON.parse(result));

            var content = content_infowindow(type, data);
            map.infoWindow.setContent(content);
            map.infoWindow.setTitle("详情");
            map.infoWindow.show(event.mapPoint);
        });

    });
    //鼠标移除事件
    graphiclayer.on('mouse-out', function (event) {
        var geotype = event.graphic.geometry.type;
        var symbol = event.graphic.symbol;
        if (geotype == 'point') {
            symbol.setWidth(20);
            symbol.setHeight(25);
        } else if (geotype == 'polyline') {
            symbol.setWidth(2);
        } else if (geotype == 'polygon') {
            symbol.outline.setWidth(2);
        }
        event.graphic.setSymbol(symbol);
    });
    setTimeout(function () { setextent() }, 300);
}

function setextent() {
    require(["esri/graphicsUtils"], function (graphicsUtils) {
        if (graphiclayer.graphics.length > 0) {
            var myExtent = graphicsUtils.graphicsExtent(graphiclayer.graphics);
            map.setExtent(myExtent.expand(1.5));
        } else {
            var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
            map.centerAndZoom(pt, 7);
        }
    });
}
var typebox = ['', '', '', '', '', '', '', '']; //目前电站类型
var legendbox = ['firestationbox', 'waterstationbox', 'bioenergybox', 'windstationbox', 'solarstationbox', 'substationbox', 'powerlinebox', 'coalproject'];

//判断查询电站的种类，显示图例
function judgetype(type) {
    if (type == '火电站') {
        if (typebox[0] == '') {
            typebox[0] = type;
        }
    } else if (type == '水电站') {
        if (typebox[1] == '') {
            typebox[1] = type;
        }
    } else if (type == '生物质电站') {
        if (typebox[2] == '') {
            typebox[2] = type;
        }
    } else if (type == '风电场') {
        if (typebox[3] == '') {
            typebox[3] = type;
        }
    } else if (type == '光伏电站') {
        if (typebox[4] == '') {
            typebox[4] = type;
        }
    } else if (type == '变电站') {
        if (typebox[5] == '') {
            typebox[5] = type;
        }
    } else if (type == '输电线路项目') {
        if (typebox[6] == '') {
            typebox[6] = type;
        }
    } else if (type == '煤炭项目') {
        if (typebox[7] == '') {
            typebox[7] = type;
        }
    }
}

//遍历电站类型，显示图例
function showlegend() {
    $("#legendbox").show();
    $.each(typebox, function (index, item) {
        if (item != '') {
            $("#" + legendbox[index]).show();
        }
    });
}

//隐藏所有图例
function hidealllegend() {
    $.each(legendbox, function (index, item) {
        $("#" + legendbox[index]).hide();
        typebox[index] = '';
    });
    $("#legendbox").hide();
}

//信息框内容
function content_infowindow(type, item) {
    var content = '';
    if (type == '火电站') {
        content = "<ul><li><b>电站名称:</b><span>" + item.FrieStationName
         + "</span></li><li><b>电站类型:</b><span>" + item.StationType
         + "</span></li><li><b>装机容量:</b><span>" + item.InstalledCapacity + " 兆瓦"
         + "</span></li><li><b>状态:</b><span>" + item.State
         + "</span></li><li><b>所在区县:</b><span>" + item.BelongToCityName
         + "</span></li><li><b>业主单位:</b><span>" + item.OwnerUnitName
         + "</span></li><li><b>投资集团:</b><span>" + item.InvestorUnitNames
         + "</span></li><li><b>开发建设单位:</b><span>" + item.ConstructionUnitNames
         + "</span></li><li><b>投产时间:</b><span>" + item.ProductionTime.substring(0, 10)
         + "</span></li></ul>";
    } else if (type == '水电站') {
        content =
             "<ul><li><b>电站名称:</b><span>" + item.WaterStationName
             + "</span></li><li><b>电站类型:</b><span>" + item.WaterStationType
             + "</span></li><li><b>建设状态:</b><span>" + item.State
             + "</span></li><li><b>装机容量:</b><span>" + item.InstalledCapacity + " 兆瓦"
             + "</span></li><li><b>年发电量:</b><span>" + item.AnnualYield + " 兆瓦·时"
             + "</span></li><li><b>所属流域:</b><span>" + item.BelongToBasin
             + "</span></li><li><b>建设单位:</b><span>" + item.ConstructionUnitNames
             + "</span></li></ul>";
    } else if (type == '生物质电站') {
        content = "<ul><li><b>电站名称:</b><span>" + item.BiomassStationName
               + "</span></li><li><b>单机容量:</b><span>" + item.SingleCapacity + " 兆瓦"
               + "</span></li><li><b>机组台数:</b><span>" + item.UnitsAmount + " 台"
               + "</span></li><li><b>装机容量:</b><span>" + item.InstalledCapacity + " 兆瓦"
               + "</span></li><li><b>年发电量:</b><span>" + item.AnnualYield + " 兆瓦·时"
               + "</span></li><li><b>建设状态:</b><span>" + item.State
               + "</span></li><li><b>业主单位:</b><span>" + item.OwnerUnitName
               + "</span></li><li><b>投资集团列表:</b><span>" + item.InvestorUnitNames
               + "</span></li><li><b>开发建设单位:</b><span>" + item.ConstructionUnitNames
               + "</span></li><li><b>投产时间:</b><span>" + item.ProductionTime
               + "</span></li></ul>";
    } else if (type == '风电场') {
        content = "<ul><li><b>风电场名称:</b><span>" + item.WindStationName
                        + "</span></li><li><b>所属区域:</b><span>" + item.BelongToCountryName
                        + "</span></li><li><b>机组台数:</b><span>" + item.UnitsAmount + " 台"
                        + "</span></li><li><b>装机容量:</b><span>" + item.InstalledCapacity + " 兆瓦"
                        + "</span></li><li><b>单机容量:</b><span>" + item.SingleCapacity + " 兆瓦"
                        + "</span></li><li><b>年发电量:</b><span>" + item.AnnualYield + " 兆瓦·时"
                        + "</span></li><li><b>业主单位:</b><span>" + item.OwnerUnitName
                        + "</span></li><li><b>投资集团:</b><span>" + item.InvestorUnitNames
                        + "</span></li><li><b>开发建设单位:</b><span>" + item.ConstructionUnitNames
                        + "</span></li><li><b>投产时间:</b><span>" + item.ProductionTime.substring(0, 10)
                        + "</span></li></ul>";
    } else if (type == '光伏电站') {
        content = "<ul><li><b>电站名称:</b><span>" + item.SolarStationName
               + "</span></li><li><b>单机容量:</b><span>" + item.SingleCapacity + " 兆瓦"
               + "</span></li><li><b>机组台数:</b><span>" + item.UnitsAmount + " 台"
               + "</span></li><li><b>装机容量:</b><span>" + item.InstalledCapacity + " 兆瓦"
               + "</span></li><li><b>年发电量:</b><span>" + item.AnnualYield + " 兆瓦·时"
               + "</span></li><li><b>建设状态:</b><span>" + item.State
               + "</span></li><li><b>业主单位:</b><span>" + item.OwnerUnitName
               + "</span></li><li><b>投资集团列表:</b><span>" + item.InvestorUnitNames
               + "</span></li><li><b>开发建设单位:</b><span>" + item.ConstructionUnitNames
               + "</span></li><li><b>投产时间:</b><span>" + item.ProductionTime
               + "</span></li></ul>";
    } else if (type == '输电线路项目') {
        content = "<ul><li><b>名称:</b><span>" + item.Name
                   + "</span></li><li><b>起点:</b><span>" + item.StartPoint
                   + "</span></li><li><b>终点:</b><span>" + item.EndPoint
                   + "</span></li><li><b>长度:</b><span>" + item.Length + " 千米"
                   + "</span></li><li><b>最大传输功率:</b><span>" + item.Maxtransmission
                   + "</span></li><li><b>年传送体积:</b><span>" + item.AnnTransVol
                   + "</span></li><li><b>负载:</b><span>" + item.LoadRate
                   + "</span></li><li><b>类别:</b><span>" + item.Type
                   + "</span></li><li><b>投产时间:</b><span>" + item.ProductionTime.substring(0, 10);
    } else if (type == '变电站') {
        content = "<ul><li><b>电站名称:</b><span>" + item.Name
                    + "</span></li><li><b>项目所在:</b><span>" + item.Address
                    + "</span></li><li><b>电压等级:</b><span>" + item.VoltageLevel + ' 千伏'
                    + "</span></li><li><b>主变容量:</b><span>" + item.MainTransformerCapacity + ' 千瓦'
                    + "</span></li><li><b>下网负载:</b><span>" + item.NetLoad + ' 千瓦'
                    + "</span></li><li><b>类别:</b><span>" + item.Type
                    + "</span></li><li><b>投产时间:</b><span>" + item.ProductionTime.substring(0, 10)
                    + "</span></li></ul>";
    } else if (type == '煤炭项目') {
        content = "<ul><li><b>煤矿名称:</b><span>" + item.Name
                       + "</span></li><li><b>所属区域:</b><span>" + item.BelongToCoalRegion
                       + "</span></li><li><b>生产能力:</b><span>" + item.AnnualManufacturability + " 万吨"
                       + "</span></li><li><b>主要煤种:</b><span>" + item.MainCoalSpecies
                       + "</span></li><li><b>可采储量:</b><span>" + item.RecoverableReserves + " 万吨"
                       + "</span></li><li><b>开拓方式:</b><span>" + item.ExploreMode
                       + "</span></li><li><b>运输方式:</b><span>" + item.VentilationMode
                       + "</span></li><li><b>详细地址:</b><span>" + item.Address
                       + "</span></li></ul>";
    }
    return content;
}

//设置电站样式
function SetStationSymbol(geometry, type) {
    var symbol = null;
    if (geometry == 'point') {
        symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/ICON_09.png", 20, 25);
        if (type == '生物质电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/biostation1.png", 20, 25);
        } else if (type == '风电场') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/windstation3.png", 20, 25);
        } else if (type == '光伏电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/solarenergy2.png", 20, 25);
        } else if (type == '火电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/firestation2.png", 20, 25);
        } else if (type == '水电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/waterstation3.png", 20, 25);
        } else if (type == '变电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/substation3.png", 20, 25);
        }
    } else if (geometry == 'polyline') {
        symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 128, 0]), 2);
        if (type == '输电线路项目') {
            symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 128, 0]), 2);
        }
    } else if (geometry == 'polygon') {
        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([28, 132, 198]), 2), new dojo.Color([28, 132, 198, 0.25]));
        if (type == '煤炭项目') {
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([28, 132, 198]), 2), new dojo.Color([28, 132, 198, 0.25]));
        }
    }
    return symbol;
}
//设置闪亮点
function SetLightSymbol(geometry, type) {
    var symbol = null;
    if (geometry == 'point') {
        symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/ICON_09.png", 24, 30);
        if (type == '生物质电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/biostation1.png", 24, 30);
        } else if (type == '风电场') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/windstation3.png", 24, 30);
        } else if (type == '光伏电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/solarenergy2.png", 24, 30);
        } else if (type == '火电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/firestation2.png", 24, 30);
        } else if (type == '水电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/waterstation3.png", 24, 30);
        } else if (type == '变电站') {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/substation3.png", 24, 30);
        }
    } else if (geometry == 'polyline') {
        symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 128, 0]), 3);
        if (type == '输电线路项目') {
            symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 128, 0]), 3);
        }
    } else if (geometry == 'polygon') {
        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([28, 132, 198]), 4), new dojo.Color([28, 132, 198, 0.25]));
        if (type == '煤炭项目') {
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([28, 132, 198]), 4), new dojo.Color([28, 132, 198, 0.25]));
        }
    }
    return symbol;
}
function DataTypeChange(newValue, oldValue) {
    $("#Type").combobox("reload");
    return true;
}
function setQuery() {
    $("#mapDiv").hide();
    $("#gridpanl .datagrid-view,#gridpanl .datagrid-pager").css("display", "inline-block");
    $("#mapbutton").hide();
    $("#dataShow").css("display", "none");
    $("#mapShow").css("display", "block");
    if (($("#Type").combo("getValue") != "0" && $("#Type").combo("getValue") != "")
        || ($("#Citiy").combo("getValue") != null && $("#Citiy").combo("getValue") != "0" && $("#Citiy").combo("getValue") != "")
        || ($("#Name").val() != null && $("#Name").val() != "")) {
        $("#MarkLoad").val("true");
        $("#QueryButton").click();
    } else {
        $.easyui.topShow("请选择或输入查询条件");
    }
}

$(function () {
    $("#mapDiv").hide();
    $("#mapbutton").hide();
    $("#dataShow").hover(function () {
        $(".icon-dataChange").css("background-image", "url(../../Css/images/dataShow2.png)");

    }, function () {
        $(".icon-dataChange").css("background-image", "url(../../Css/images/dataShow.png)");
    });
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
    //线面要素缩放到当前
    function fullextent(graphic) {
        require(["esri/graphicsUtils"], function (graphicsUtils) {
            var myExtent = graphicsUtils.graphicsExtent([graphic]);
            map.setExtent(myExtent.expand(3));
        });
    }

    $("#gridWithMap").datagrid({
        onClickRow: function (index, row) {
            map.infoWindow.hide();
            map.graphics.clear();
            var coor = row.Coordinate;//获取Shape
            if (coor == '' || coor == null) {
                return;
            }
            var type = row.Type;//类型，如电站，输电线等
            var wkt = new Wkt.Wkt();
            wkt.read(coor);
            var config = {
                spatialReference: {
                    wkid: 4490
                },
                editable: false
            };
            console.log(row);
            var mygeometry = wkt.toObject(config);
            var graphic = new esri.Graphic();
            graphic.geometry = mygeometry;
            var geometrytype = mygeometry.type;
            var symbol = SetStationSymbol(geometrytype, type);
            graphic.setSymbol(symbol);
            map.graphics.add(graphic);
            var id = row.Id;
            var url = row.Url;
            var newurl = url.substring(0, url.lastIndexOf('/'));
            $.post(newurl + "/DetailData?id=" + id, function (result) {//通过该接口，根据点击graphic的id返回属性数据
                var data = JsonObjDefault(JSON.parse(result));
                var content = content_infowindow(type, data);
                map.infoWindow.setContent(content);
                map.infoWindow.setTitle("详情");
                var locationpoint = null;
                var maxxpoint = null;
                if (geometrytype == 'polygon') {
                    maxxpoint = getmaxxpoint(mygeometry.rings[0]);
                    locationpoint = new esri.geometry.Point(maxxpoint[0], maxxpoint[1]);
                    fullextent(graphic);
                    map.graphics.graphics[0].symbol.outline.setWidth(4);
                    setTimeout(function () { map.infoWindow.show(locationpoint); }, 500);
                } else if (geometrytype == 'polyline') {
                    maxxpoint = getmaxxpoint(mygeometry.paths[0]);
                    locationpoint = new esri.geometry.Point(maxxpoint[0], maxxpoint[1]);
                    fullextent(graphic);
                    map.graphics.graphics[0].symbol.setWidth(5);
                    setTimeout(function () { map.infoWindow.show(locationpoint); }, 500);
                } else {
                    locationpoint = mygeometry;
                    map.centerAndZoom(locationpoint, 10);
                    map.graphics.graphics[0].symbol.setWidth(25);
                    map.graphics.graphics[0].symbol.setHeight(30);
                    setTimeout(function () { map.infoWindow.show(locationpoint); }, 500);
                }
            });
        }
    });
});

function SearchData() {
    $("#dataShow").css("display", "block");
    $("#mapShow").css("display", "none");
    if (($("#Type").combo("getValue") != "0" && $("#Type").combo("getValue") != "")
        || ($("#Citiy").combo("getValue") != null && $("#Citiy").combo("getValue") != "0" && $("#Citiy").combo("getValue") != "")
        || ($("#Name").val() != null && $("#Name").val() != "")) {
        var divQuery = $("#divQuery").outerHeight();
        var mapHeight = document.body.clientHeight - divQuery;
        var mapWidth = document.body.clientWidth - 304;
        var mapHeight3 = mapHeight - 35;
        //$("#gridpanl>.datagrid>.datagrid-wrap>.datagrid-view").css("z-index"); 
        //$("#gridpanl>.datagrid>.datagrid-wrap>.datagrid-pager").hide();
        $("#mapDiv").show();
        $("#gridpanl .datagrid-view,#gridpanl .datagrid-pager").css("display", "none");
        //$("#map").attr("width", "100%");
        $("#map").css("height", mapHeight + "px").css("position", "absolute").css("left", "304px").css("z-index", "10").css("width", mapWidth + "px");
        $("#mapDiv").css("position", "absolute").css("top", divQuery + "px").css("z-index", "10").css("width", "100%").css("height", mapHeight + "px");
        $("#mapDiv .datagrid").css("position", "absolute").css("z-index", "10").css("width", "304px").css("height", mapHeight + "px");
        $("#mapDiv .datagrid-view").css("height", mapHeight3 + "px");
        $("#mapDiv .datagrid-view .datagrid-view2").css("height", mapHeight3 + "px");
        $("#mapbutton").show();
        $.easyui.showLoadingByStr("数据加载中，请稍候...");
        $.post("/GIS/ProjectBioenergySation/SearchAllData", { Type: $("#Type").combo("getValue"), Citiy: $("#Citiy").combo("getValue"), Name: $("#Name").val(), MarkLoad: true }, function (data, status) {
            $.easyui.removeLoading();//移除提示框
            if (status == 'success') {
                $("#gridWithMap").datagrid("load", $("#formQuery").serializeJson());
                hidealllegend();
                AddStationToLayer(FormatJsonDefault(JSON.parse(data).rows));
                showlegend();
            }
        });


    } else {
        $("#dataShow").css("display", "none");
        $("#mapShow").css("display", "block");
        $.easyui.topShow("请选择或输入查询条件");
    }
}
function BackData() {
    $("#dataShow").css("display", "none");
    $("#mapShow").css("display", "block");
    $("#mapDiv").hide();
    $("#gridpanl .datagrid-view,#gridpanl .datagrid-pager").css("display", "inline-block");
    $("#mapbutton").hide();
    clearmap();
    hidealllegend();
}
function reset() {
    $("#mapDiv").hide();
    $("#gridpanl .datagrid-view,#gridpanl .datagrid-pager").css("display", "inline-block");
    $("#mapbutton").hide();
    $("#dataShow").css("display", "none");
    $("#mapShow").css("display", "block");
    $("#Type").combo("setText", "-请选择-");
    $("#Type").combo("setValue", "");
    $("#Citiy").combo("setText", "-请选择-");
    $("#Citiy").combo("setValue", "");
    $("#MarkLoad").val("false");
    $("#Name").textbox("setValue", "");
    var jsondata = $("#formQuery").serializeJson();
    $("#grid").datagrid({
        queryParams: jsondata
    });
}
