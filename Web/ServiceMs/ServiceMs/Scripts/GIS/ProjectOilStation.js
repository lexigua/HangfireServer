var gasnowlayer;
var gasfuturelayer;
var powerlinenowlayer;
var powerlinefuturelayer;

var layerid = [gasnowlayer, gasfuturelayer, powerlinenowlayer, powerlinefuturelayer];
var layeridforId = ['gasnowlayer', 'gasfuturelayer', 'powerlinenowlayer', 'powerlinefuturelayer'];
var LoadMark = [0, 0, 0, 0];
var legendbox = ['plangasbox', 'planlinebox'];
var isverticalswipe = false;
var tempindex = 1;
var maptoplayerdiv = null;
var ishorizontalswipe = false;
var gasfeaturelayer;
var powerlinelayer;
var mygraphiclayer = [gasfeaturelayer, powerlinelayer];
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
dojo.require("esri.renderers.ClassBreaksRenderer");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.InfoTemplate");
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

    //设置地图的中心点和缩放层级
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    map.centerAndZoom(pt, 7);



    map.on('mouse-move', function (e) {
        maptoplayerdiv = maptoplayerdiv ? maptoplayerdiv : document.getElementById(map.id + '_'+layeridforId[2*tempindex+1]);
        if (maptoplayerdiv) {
            var offsetX = e.screenPoint.x;
            var offsetY = e.screenPoint.y;
            var mapheightpx = maptoplayerdiv.style.height;
            var mapwidthpx = maptoplayerdiv.style.width;
            var mapheight = parseInt(mapheightpx.substring(0, mapheightpx.lastIndexOf('px')));//去掉单位px 取出数值
            var mapwidth = parseInt(mapwidthpx.substring(0, mapwidthpx.lastIndexOf('px')));
            var origin = getLayerTransform(maptoplayerdiv);
            var cliptop = -origin.y + "px";
            var clipleft = -origin.x + "px";
            var clipbottom = ishorizontalswipe ? (offsetY - origin.y) + 'px' : (mapheight - origin.y) + 'px';
            var clipright = isverticalswipe ? (offsetX - origin.x) + "px" : (mapwidth - origin.x) + "px";
            maptoplayerdiv.style.clip = 'rect(' + cliptop + ',' + clipright + ',' + clipbottom + ',' + clipleft + ')';
        }
    });
});
var layerbox = ['天然气规划', '输电线路规划'];
$(function () {
    $("#plangasbox").hide();
    $("#planlinebox").hide();
    $('#tt').tree({
        data: treeList,
        checkbox: true, //使节点增加选择框
        onClick: function (node) {
            if (node.checked == false) {
                $("#tt").tree('check', node.target);
            } else {
                $("#tt").tree('uncheck', node.target);
            }
        },
        onBeforeCheck: function (node, checked) {
            if (checked) {
                var nodes = $('#tt').tree('getChecked');
                if (nodes.length > 0) {
                    for (var i = 0; i < nodes.length; i++) {
                        $("#tt").tree('uncheck', nodes[i].target);
                    }
                    $("#tt").tree('check', node.target);
                }
            }
        },
        onCheck: function (node, checked) {
            maptoplayerdiv = null;
            ishorizontalswipe = false;
            var text = node.text;
            $.each(layerbox, function (index, item) {
                if (item == text) {
                    tempindex = index;
                    if (node.checked == false) {
                        if (LoadMark[index * 2] == 0) {
                            addResourceLayer(2 * index);
                            addResourceLayer(2 * index + 1);
                            if (index == 0) {
                                PostData(index);
                            }
                        } else {
                            layerid[2 * index].show();
                            layerid[2 * index + 1].show();
                            if (index == 0) {
                                mygraphiclayer[index].show();
                            }
                        }
                        $("#" + legendbox[index]).show();
                    } else {
                        layerid[2 * index].hide();
                        layerid[2 * index + 1].hide();
                        if (index == 0) {
                            mygraphiclayer[index].hide();
                        }
                        $("#" + legendbox[index]).hide();
                    }
                }
            });
        }
    });
});

//项目数据来源（路径）
var LoadPath = ["/GIS/ProjectGasPipeline/GetBasinOne", "/GIS/ProjectGasPipeline/GetBasinOne"];
//返回数据
var returnData;
//请求数据
function PostData(index) {
    $.post(LoadPath[index], function (result) {
        var tempArray = eval(result);
        returnData = FormatJsonDefault(tempArray);
        AddProjectGraphics(returnData, index);
    });
}
//添加要素到图层
function AddProjectGraphics(data, number) {
    mygraphiclayer[number] = new esri.layers.GraphicsLayer();
    map.addLayer(mygraphiclayer[number]);
    $.each(data, function (index, obj) {
        var wkt = new Wkt.Wkt();
        wkt.read(obj.Shape);
        var config = {
            spatialReference: {
                wkid: 4326
            },
            editable: false
        };
        var polygon = wkt.toObject(config);
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = polygon;
        graphicWeb.attributes = obj;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0,0.001]), 6);
        graphicWeb.setSymbol(lineSymbol);
        mygraphiclayer[number].add(graphicWeb);
    });
    if (number == 0) {
        //鼠标经过事件
        mygraphiclayer[number].on('click', function (event) {
            map.infoWindow.hide();
            var content = content_infowindow(event.graphic);
            map.infoWindow.setContent(content);
            map.infoWindow.setTitle("详情");
            map.infoWindow.show(event.mapPoint);
        });
        //鼠标移除事件
        mygraphiclayer[number].on('mouse-out', function (event) {
            map.infoWindow.hide();
        });
    }
    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(mygraphiclayer[number].graphics);
        map.setExtent(myExtent.expand(1.5));
    });
    LoadMark[number] = 1;
}


function content_infowindow(item) {
    var content = '';
    content = "<ul><li><b>管道名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>管道类型:</b><span>规划</span></li>"
                 + "<li><b>管道走向:</b><span>" + item.attributes.PipelineMoveTowards + "</span></li>"
                + "<li><b>管径:</b><span>" + item.attributes.PipeDiameter + "</span></li>"
                + "<li><b>设计压力:</b><span>" + item.attributes.Pressure + "MPa" + "</span></li>"
                 + "<li><b>年输气能力:</b><span>" + item.attributes.YeargasTransportationCapacity + "亿方" + "</span></li>"
                    + "<li><b>全长:</b><span>" + item.attributes.Length + "公里" + "</span></li>"
                + "</ul>";
    return content;
}

$(function() {
    //卷帘对比
    //var changeNum = 1;
    //$(".changeBtn").click(function () {
    //    if (changeNum == 1) {
    //        $(this).addClass("changColorr");

    //        isverticalswipe = !isverticalswipe;
    //        changeNum = 0;
    //    } else {
    //        $(this).removeClass("changColorr");
    //        isverticalswipe = !isverticalswipe;
    //        changeNum = 1;
    //    }
    //});
});
//能源规划——获取图层右上角的坐标
function getLayerTransform(layer) {
    var xorigin, yorigin, layerstyle = layer.style;
    if (layerstyle['-webkit-transform']) {
        var s = layerstyle['-webkit-transform'];//格式为"translate(0px, 0px)"
        var xyarray = s.replace(/translate\(|px|\s|\)/, '').split(',');
        xorigin = parseInt(xyarray[0]);
        yorigin = parseInt(xyarray[1]);
    }
    else if (layerstyle['transform']) {
        var layertransforstring = layerstyle['transform'];
        var xyz = layertransforstring.replace(/px|\s|translate3d\(|px|\)/g, '').split(',');
        xorigin = parseInt(xyz[0]);
        yorigin = parseInt(xyz[1]);
    }
    else {
        xorigin = parseInt(layer.style.left.replace('px', ''));
        yorigin = parseInt(layer.style.top.replace('px', ''));
    }
    return {
        x: xorigin,
        y: yorigin
    }
}
//添加资源专题图
function addResourceLayer(index) {
    require([
        "esri/map", "extras/ThematicLayer", "dojo/domReady!"
    ], function (Map, ThematicLayer) {
        var identifier = resourceJson[index].identifier;
        var tileMatrixSet = resourceJson[index].tileMatrixSet;
        var extent = new esri.geometry.Extent(parseFloat(resourceJson[index].minx), parseFloat(resourceJson[index].miny), parseFloat(resourceJson[index].maxx), parseFloat(resourceJson[index].maxy), new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = resourceJson[index].url;
        var origin = { "x": parseFloat(resourceJson[index].originx), "y": parseFloat(resourceJson[index].originy) };
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        layerid[index] = new ThematicLayer(extent, url, origin);
        layerid[index].id = layeridforId[index];
        map.addLayer(layerid[index]);
        LoadMark[index] = 1;
    });
}
//天然气现状图层
var resourceJson = [{
    "identifier": "Gas Current Situation_SiChuan",
    "tileMatrixSet": "Custom_Gas Current Situation_SiChuan",
    "minx": "97.35097729486642",
    "miny": "26.049047744957647",
    "maxx": "109.53082999606099",
    "maxy": "34.31453675476757",
    "url": "http://112.74.101.152:8090/iserver/services/map-ZTZT_GAS/wmts_tianditu",
    "originx": "97.35097729486642",
    "originy": "34.31453675476757 "
}, {
    "identifier": "guandao@guandao",//天然气规划图层
    "tileMatrixSet": "Custom_guandao@guandao",
    "minx": "97.35097729486642",
    "miny": "26.049047744957647",
    "maxx": "109.53082999606099",
    "maxy": "34.31453675476757",
    "url": "http://112.74.101.152:8090/iserver/services/map-supermapsuper/wmts_tianditu",
    "originx": "97.35097729486642",
    "originy": "34.31453675476757 "
}, {
    "identifier": "2015",//区划蕴藏量
    "tileMatrixSet": "Custom_2015",
    "minx": "97.34967842925383",
    "miny": "26.049047744957647",
    "maxx": "108.54095798941984",
    "maxy": "34.31453675476757",
    "url": "http://112.74.101.152:8090/iserver/services/map-power/wmts_tianditu",
    "originx": "97.34967842925383",
    "originy": "34.31453675476757"
}, {
    "identifier": "2016",
    "tileMatrixSet": "Custom_2016",
    "minx": "97.34967842925383",
    "miny": "26.049047744957647",
    "maxx": "108.54095798941984",
    "maxy": "34.31453675476757",
    "url": "http://112.74.101.152:8090/iserver/services/map-power/wmts_tianditu",
    "originx": "97.34967842925383",
    "originy": "34.31453675476757"
}];
//树
var treeList = [
    {
        "id": 1,
        "text": "天然气规划",
        "children": []
    }, {
        "id": 2,
        "text": "输电线路规划",
        "children": []
    }
];