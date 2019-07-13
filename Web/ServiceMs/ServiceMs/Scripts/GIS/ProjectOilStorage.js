//资源图层
var waterbasionlayer;//流域
var waterregionlayer;//水资源分区
var windspeedlayer;//风速
var winpowerlayer;//风功率
var solarradionlayer;//太阳能辐射
var solarpowerlayer;//太阳能功率
var coallayer;//煤炭资源
var oillayer;//石油资源
var gaslayer;//天然气资源
var scborder;//四川省边界
var gasnowlayer;//天然气现状
var gasfuturelayer;//天然气规划
var powerlinenowlayer;//输电线路现状
var powerlinefuturelayer;//输电线路规划

//资源要素图层
var waterbasiongraphiclayer;
var waterregiongraphiclayer;
var windspeedgraphiclayer;
var winpowergraphiclayer;
var solarradiongraphiclayer;
var solarpowergraphiclayer;
var coalgraphiclayer;
var gasfeaturelayer;
//项目要素图层
var pro_coallayer;//煤炭项目
var pro_oilstoragelayer;//石油存储库
var pro_oillinelayer;//输油管网
var pro_oilstationlayer;//加油站
var pro_gasstationlayer;//加气站
var pro_gascompanylayer;//燃气公司
var pro_gaslinelayer;//燃气管网
var pro_firelayer;//火电站
var pro_waterlayer;//水电站
var pro_bioenergylayer;//生物质电站
var pro_windlayer;//风电站
var pro_solarlayer;//太阳能电站
var pro_powerlinelayer;//输电线
var pro_substationlayer;//变电站
var labellayer;//水电站标注图层
//地图
var map;
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
dojo.require("esri.renderers.ClassBreaksRenderer");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.InfoTemplate");
dojo.require("extras.ThematicLayer");
require(["dojo/parser", "esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer", "extras/ThematicLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "esri/layers/GraphicsLayer", "esri/symbols/TextSymbol", "esri/dijit/Measurement", "dijit/TitlePane"], function (parser, Map, InfoWindow, TDTRoadLayer, ThematicLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer, Measurement) {
    parser.parse();
    map = new Map("map",
    {
        logo: false,
        center: [104.0706, 30.164789],
        minZoom: 6
    });

    var measurement = new esri.dijit.Measurement({
        map: map
    }, document.getElementById("measurementDiv"));
    measurement.startup();

    baseMap_roadLayer = new TDTRoadLayer();
    map.addLayer(baseMap_roadLayer);
    baseMap_annoLayer = new TDTAnnoLayer();
    map.addLayer(baseMap_annoLayer);
    baseMap_imageLayer = new TDTImageLayer();
    map.addLayer(baseMap_imageLayer);
    baseMap_imageLayer.hide();
    //设置地图的中心点和缩放层级
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    map.centerAndZoom(pt, 5);
});
//存储树id，只有树id不变，无论树的顺序以及显示效果都不影响程序运行，通过id获取数组索引，对图层和图例进行操作
var layerBox = ['node_1', 'node_1_1', 'node_1_2', 'node_2', 'node_2_1', 'node_2_2', 'node_3', 'node_3_1', 'node_3_2', 'node_4', 'node_5', 'node_6', 'node_7', 'node_8', 'node_9', 'node_9_1', 'node_9_2', 'node_9_3', 'node_10', 'node_10_1', 'node_10_2', 'node_10_3', 'node_11', 'node_11_1', 'node_11_2', 'node_11_3', 'node_11_4', 'node_11_5', 'node_12', 'node_13', 'node_14', 'node_14_1', 'node_14_2', 'node_15', 'node_15_1', 'node_15_2'];
//存储所有要素图层
var graphiclayerid = ['', waterbasiongraphiclayer, waterregiongraphiclayer, '', windspeedgraphiclayer, winpowergraphiclayer, '', solarradiongraphiclayer, solarpowergraphiclayer, coalgraphiclayer, '', '', '', pro_coallayer, '', pro_oilstoragelayer, pro_oillinelayer, pro_oilstationlayer, '', pro_gasstationlayer, pro_gascompanylayer, pro_gaslinelayer, '', pro_firelayer, pro_waterlayer, pro_bioenergylayer, pro_windlayer, pro_solarlayer, pro_powerlinelayer, pro_substationlayer, '', gasfeaturelayer, '', '', '', ''];
//存储所有专题图
var layerid = ['', waterbasionlayer, waterregionlayer, '', windspeedlayer, winpowerlayer, '', solarradionlayer, solarpowerlayer, coallayer, oillayer, gaslayer, scborder, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', gasnowlayer, gasfuturelayer, '', powerlinenowlayer, powerlinefuturelayer];
//图例
var legendbox = ['', 'waterbasionbox', 'waterregionbox ', '', 'windspeedbox', 'windpowerbox', '', 'solarradiobox', 'solarpowerbox', 'coalbox', '', '', '', 'coalprojectbox', '', '', '', '', '', '', '', '', '', 'firestationbox', 'waterstationbox', 'bioenergybox', 'windstationbox', 'solarstationbox', 'powerlinebox', 'substationbox', '', 'gasnowbox', 'gasfuturebox', '', 'linenowbox', 'linefuturebox'];
//标识地图是否已经加载过
var LoadMark = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0];
//项目数据来源（路径）
var LoadPath = ['', "/GIS/BasinOne/GetBasinOne", "/GIS/City/GetCity", '', "/GIS/ResourceWindResource/GetBasinOne", "/GIS/ResourceWindResource/GetBasinOne", '', "/GIS/ResourceSolarEnergyResource/GetAllData", "/GIS/ResourceSolarEnergyResource/GetAllData", "/GIS/ResourceCoalResource/GetCoalResource", '', '', '', "/GIS/ProjectCoalProject/GetCoalProject", '', '', '', '', '', '', '', '', '', "/GIS/ProjectCoalFiredStation/GetBasinOne", "/GIS/ProjectHydropowerStationProject/QueryAllData", "/GIS/ProjectBioenergySation/GetAllData", "/GIS/ProjectWindStation/GetBasinOne", "/GIS/ProjectSolarEnergyStationProject/GetBasinOne", "/GIS/ProjectPowerLine/GetAllData", "/GIS/ProjectSubstation/GetBasinOne", '', '', '', '', '', ''];///GIS/ProjectGasPipeline/GetBasinOne
$(function () {
    $('#tt').tree({
        data: treeList,
        checkbox: true, //使节点增加选择框
        onClick: function (node) {//点击树节点所在行，触发checkbox的check事件
            if ($.inArray(node.id, layerBox) >= 0) {
                if (node.checked == false) {
                    $("#tt").tree('check', node.target);
                } else {
                    $("#tt").tree('uncheck', node.target);
                }
            }
        },
        onCheck: function (node, checked) {//checkbox选中事件
            var layer = node.id;//获取当前节点id
            $.each(layerBox, function (index, item) {//遍历数组，定位到当前点击id索引
                if (map != undefined) {
                    map.infoWindow.hide();
                }
                if (layer == item) {//获取当前索引
                    if (node.checked == false) {//点击选中
                        if (node.children.length > 0) { //如果有子节点
                            $.each(node.children, function (num, obj) {
                                if (LoadMark[index + num + 1] == 0) {//判断是否已经加载过
                                    if (index < 13||index>29) {//对于小于13和大于29，需要加载专题图
                                        addResourceLayer(index + num + 1);
                                    }
                                    PostData(index + num + 1);//加载graphicslayer
                                } else if (LoadMark[index + num + 1] == 1) {
                                    if (index < 13||index>29) {
                                        layerid[index + num + 1].show();
                                    }
                                    if (graphiclayerid[index + num + 1]) {
                                        graphiclayerid[index + num + 1].show();
                                    }
                                    if (index+num+1 == 24) {//水电站标注图层
                                        labellayer.show();
                                    }
                                }
                                if ($("#" + legendbox[index + num + 1])) {
                                    $("#" + legendbox[index + num + 1]).remove();
                                }
                                $("#legenddiv").prepend(legendhtml[index + num + 1]);//添加图例到最上面
                            });
                        } else {//如果没有子节点
                            if (LoadMark[index] == 0) {//第一次请求
                                if (index < 13||index>29) {
                                    addResourceLayer(index);//加载专题图
                                }
                                PostData(index);//加载要素图层
                            } else if (LoadMark[index] == 1) {//若已经请求过，则控制显示与隐藏
                                if (index < 13 || index > 29) {
                                    layerid[index].show();
                                }
                                if (graphiclayerid[index]) {
                                    graphiclayerid[index].show();
                                }
                                if (index == 24) {//水电站标注图层
                                    labellayer.show();
                                }
                            }
                            if ($("#" + legendbox[index])) {
                                $("#" + legendbox[index]).remove();
                            }
                            $("#legenddiv").prepend(legendhtml[index]);
                        }
                    } else {
                        if (node.children.length > 0) {
                            $.each(node.children, function (num, obj) {
                                if (index < 13 || index > 29) {
                                    layerid[index + num + 1].hide();
                                } 
                                if (graphiclayerid[index + num + 1]) {
                                    graphiclayerid[index + num + 1].hide();
                                }
                                if (index+num+1 == 24) {//水电站标注图层
                                    labellayer.hide();
                                }
                                $("#" + legendbox[index + num + 1]).remove();
                            });
                        } else {
                            if (index < 13 || index > 29) {
                                layerid[index].hide();
                            }
                            if (graphiclayerid[index]) {
                                graphiclayerid[index].hide();
                            }
                            if (index == 24) {//水电站标注图层
                                labellayer.hide();
                            }
                            $("#" + legendbox[index]).remove();
                        }
                    }
                }
            });
        }
    });
});

//请求数据
function PostData(index) {
    if (LoadPath[index] != '') {
        $.easyui.showLoadingByStr("数据加载中，请稍候...");
        $.post(LoadPath[index], function (result, status) {
            $.easyui.removeLoading(); //移除提示框
            if (status == 'success') {
                var tempArray = eval(result);
                if (tempArray) {
                    var returnData = FormatJsonDefault(tempArray); //对数据库请求数据进行过滤
                    if (index == 24) {
                        graphiclayerid[24] = new esri.layers.GraphicsLayer();//初始化水电站要素图层
                        labellayer = new esri.layers.GraphicsLayer();//初始化水电站标注图层
                        overrideClusterLayer(100, returnData);//初始化加载
                        LoadMark[24] = 1;//第一次请求数据完成，不再向服务器请求数据
                        map.on("zoom-end", function () {//地图放大缩小事件
                            overrideClusterLayer(100, returnData);
                        });
                    } else {
                        AddProjectGraphics(returnData, index); //将要素添加到地图
                    }
                }
            }
        });
    }
}
//添加要素到图层
function AddProjectGraphics(data, number) {
    graphiclayerid[number] = new esri.layers.GraphicsLayer();//初始化
    map.addLayer(graphiclayerid[number]);
    map.infoWindow.hide();
    $.each(data, function (index, obj) {
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
        var pointSymbol = SetPointSymbol(number, obj);
        var lineSymbol;
        var polySymbol;
        if (number < 13) {
            lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.01);
            polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.1]));
        } else {
            lineSymbol = SetLineSymbol(number,obj);
            polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([153, 102, 51, 1]));
        }
        if (number <= 13) {
            graphicWeb.setSymbol(polySymbol);
        }else if (number == 28||number==32) {
            graphicWeb.setSymbol(lineSymbol);
        }else {
            graphicWeb.setSymbol(pointSymbol);
        }
        graphiclayerid[number].add(graphicWeb);
    });
    //鼠标点击事件
    graphiclayerid[number].on('click', function (event) {
        map.infoWindow.hide();
        var geotype = event.graphic.geometry.type;
        var symbol = event.graphic.symbol;
        if (geotype == 'point') {//如果是点，则放大图标
            symbol.setWidth(28);
            symbol.setHeight(36);
        } else if (geotype == 'polyline') {//如果是线，则加宽
            symbol.setWidth(5);
        } else if (geotype == 'polygon') {
            if (number == 13) {//煤炭项目
                var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255, 0.5]), 3);
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([153, 102, 51, 1]));
            } else {//资源
                var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255, 0.5]), 3);
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 0, 0, 0, 0.001]));
            }
        }
        event.graphic.setSymbol(symbol);
        var content = content_infowindow(event.graphic, number);
        map.infoWindow.setContent(content);
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标移除事件
    graphiclayerid[number].on('mouse-out', function (event) {
        var geotype = event.graphic.geometry.type;
        var symbol = event.graphic.symbol;
        if (geotype == 'point') {
            symbol.setWidth(21);
            symbol.setHeight(27);
        } else if (geotype == 'polyline') {
            if (number == 28) {//输电线，如果是规划类，则不改变
                symbol = SetpowerlineSymbol(event.graphic.attributes);
            }
        } else if (geotype == 'polygon') {
            if (number == 13) {
                var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([153, 102, 51]), 1);
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([153, 102, 51, 1]));
            } else {
                var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 255]), 0.001);
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([255, 255, 255, 0.001]));
            }
        }
        event.graphic.setSymbol(symbol);
        //map.infoWindow.hide();
    });
    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(graphiclayerid[number].graphics);
        map.setExtent(myExtent.expand(1.5));
    });
    LoadMark[number] = 1;
}
//设置电站样式
function SetPointSymbol(index, item) {
    var symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/ICON_09.png", 20, 25);
    if (index == 23||index==25||index==26||index==27||index==29) {//数据库中电站状态用State表示
        var state = item.State;
        symbol = SetStationSymbol(state,index);
    }else if (index == 24) {
        var state = item.State;
        var scale = item.StationScale;
        symbol = SetWaterStationSymbol(state,scale);
    }
    return symbol;
}
//设置线样式
function SetLineSymbol(index, item) {
    var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([153, 102, 51]), 1);
    if (index == 28) {
        var symbol=SetpowerlineSymbol(item);
    }else if (index == 32) {
        symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0, 0.001]), 6);
    }
    return symbol;
}
//设置其他电站样式
function SetStationSymbol(state, index) {
    var symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/ICON_09.png", 20, 25);
    if (state == '规划') {
        if (index == 23) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/firestation1.png", 21, 27);
        } else if (index == 25) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/biostation1.png", 21, 27);
        } else if (index == 26) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/windstation1.png", 21, 27);
        } else if (index == 27) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/solarstation1.png", 21, 27);
        }else if (index == 29) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/substation1.png", 21, 27);
        }
    }else if (state == '在建') {
        if (index == 23) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/firestation2.png", 21, 27);
        } else if (index == 25) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/biostation2.png", 21, 27);
        } else if (index == 26) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/windstation2.png", 21, 27);
        } else if (index == 27) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/solarstation2.png", 21, 27);
        } else if (index == 29) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/substation2.png", 21, 27);
        }
    }else if (state == '已建') {
        if (index == 23) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/firestation3.png", 21, 27);
        } else if (index == 25) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/biostation3.png", 21, 27);
        } else if (index == 26) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/windstation3.png", 21, 27);
        } else if (index == 27) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/solarstation3.png", 21, 27);
        } else if (index == 29) {
            symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/substation3.png", 21, 27);
        }
    }
    return symbol;
}
//设置水电站样式
function  SetWaterStationSymbol(state,scale) {
    var array1 = ['大型','中型','小型'];
    var array2 = ['规划', '在建', '已建'];
    var symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/ICON_09.png", 20, 25);
    $.each(array2, function(index, item) {
        if (array2[index] == state) {
            $.each(array1, function(num, obj) {
                if (array1[num] == scale) {
                    symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/waterstation" + (index + 1).toString() + (num + 1).toString() + ".png", 21, 27);
                }
            });
        }
    });
    return symbol;
}
//设置变电站样式（弃用）
function SetSubstationSymbol(state, type) {
    var array1 = ['特高压变电站', '500kV变电站', '220kV变电站', '110kV变电站', '35kV变电站'];
    var array2 = ['规划', '在建', '已建'];
    var symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/ICON_09.png", 20, 25);
    $.each(array2, function (index, item) {
        if (array2[index] == state) {
            $.each(array1, function (num, obj) {
                if (array1[num] == type) {
                    symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/substation" + (index + 1).toString() + (num + 1).toString() + ".png", 21, 27);
                }
            });
        }
    });
    return symbol;
}
//设置输电线样式
function SetpowerlineSymbol(data) {
    var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2.5);
    var state = data.State;
    var array2 = ['规划', '在建', '已建'];
    var array3 = [0,128,0,255,0,0,0,0,255];//存储线的颜色
    $.each(array2, function(index, item) {
        if (state == array2[index]) {
            symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([array3[index * 3], array3[index * 3 + 1], array3[index * 3+2]]), 2.5);
        }
    });
    return symbol;
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
        map.addLayer(layerid[index]);//将专题图添加到地图上
        LoadMark[index] = 1;//第一次加载，将其设为1，后续操作控制显示与隐藏，不再重复加载
    });
}
//设置infowindow窗体信息
function content_infowindow(item, type) {
    var content='';
    if (type == 1) {
        content = "<ul><li><b>流域名称:</b><span>" + item.attributes.Name +
                     "</span></li><li><b>流域面积:</b><span>" + item.attributes.Area + "平方千米" +
                     "</span></li><li><b>电站个数:</b><span>" + item.attributes.StationNum + " 个" +
                     "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 兆瓦·时" +
                      "</span></li><li><b>经济开发量:</b><span>" + item.attributes.DevelopByEcNum + " 兆瓦·时" +
                     "</span></li><li><b>理论蕴藏量:</b><span>" + item.attributes.Reserves + " 兆瓦·时" +
                     "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦" + "</span></li></ul>";
    }
    else if (type == 2) {
        content = "<ul><li><b>区划名称:</b><span>" + item.attributes.Name +
                  "</span></li><li><b>区划面积:</b><span>" + item.attributes.Area + " 平方千米" +
                  "</span></li><li><b>电站个数:</b><span>" + item.attributes.StationNum + " 个" +
                   "</span></li><li><b>技术可开发量:</b><span>" + item.attributes.DevelopByTechNum + " 兆瓦·时" +
                   "</span></li><li><b>经济开发量:</b><span>" + item.attributes.DevelopByEcNum + " 兆瓦·时" +
                  "</span></li><li><b>理论蕴藏量:</b><span>" + item.attributes.Reserves + " 兆瓦·时" +
                  "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦" + "</span></li></ul>";
    }else if (type == 4||type==5) {
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>预计可开发容量:</b><span>" + item.attributes.InstalledCapacityToTheory + " 兆瓦"
                + "</span></li><li><b>已建成装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦"
                + "</span></li><li><b>在建装机容量:</b><span>" + item.attributes.InstalledCapacityInConstruction + " 兆瓦"
                + "</span></li><li><b>平均风速:</b><span>" + item.attributes.AverageWindspeed + " 千米/小时"
                + "</span></li><li><b>平均风功率密度:</b><span>" + item.attributes.AverageWindpowerDensity + " 兆瓦/平方千米"
                + "</span></li><li><b>年平均等效满负荷小时数:</b><span>" + item.attributes.AverageAnnualHours + " 小时"
                + "</span></li></ul>";
    }else if (type == 7||type==8) {
        content = "<ul><li><b>分区名称:</b><span>" + item.attributes.Name
               + "</span></li><li><b>年均日照时数:</b><span>" + item.attributes.AverageAnnualSunshineHours + " 小时"
               + "</span></li><li><b>年均总辐射量:</b><span>" + item.attributes.AverageAnnualTotalRadiationAmount + " 兆焦/平方千米·年"
               + "</span></li><li><b>可开发总容量:</b><span>" + item.attributes.RecoverableReserves + " 兆瓦"
               + "</span></li><li><b>已建装机容量:</b><span>" + item.attributes.InstalledCapacityHadBuilt + " 兆瓦"
               + "</span></li><li><b>年利用小时数:</b><span>" + item.attributes.AverageAnnualHours + " 小时"
               + "</span></li><li><b>资源等级:</b><span>" + item.attributes.ResourcesLevel
               + "</span></li><li><b>年平均辐射量:</b><span>" + item.attributes.AverageAnnualRadiation + " 兆焦/平方千米·天"
            + "</span></li></ul>";
    }else if (type == 9) {
        content = "<ul><li><b>矿区名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>所在地:</b>" + item.attributes.Address
                + "</span></li><li><b>煤层结构:</b>" + item.attributes.CoalSeamStructure
                + "</span></li><li><b>年产量:</b>" + item.attributes.AnnualYield + " 万吨"
                + "</span></li><li><b>主要煤类:</b>" + item.attributes.MainCoalSpecies
                + "</span></li><li><b>面积:</b>" + item.attributes.Area + " 平方千米"
                + "</span></li><li><b>探明储量:</b>" + item.attributes.Reserves + " 万吨" + "</span></li></ul>";
    }
    else if (type == 13) {
        content = "<ul><li><b>煤矿名称:</b><span>" + item.attributes.Name
                           + "</span></li><li><b>所属区域:</b><span>" + item.attributes.Name
                           + "</span></li><li><b>生产能力:</b><span>" + item.attributes.AnnualManufacturability + " 万吨"
                           + "</span></li><li><b>主要煤种:</b><span>" + item.attributes.MainCoalSpecies
                           + "</span></li><li><b>可采储量:</b><span>" + item.attributes.RecoverableReserves + " 万吨"
                           + "</span></li><li><b>开拓方式:</b><span>" + item.attributes.ExploreMode
                           + "</span></li><li><b>运输方式:</b><span>" + item.attributes.VentilationMode
                           + "</span></li><li><b>详细地址:</b><span>" + item.attributes.Address
                           + "</span></li></ul>";
    }else if (type == 23) {
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
             + "</span></li><li><b>所在地:</b><span>" + item.attributes.Address
             + "</span></li><li><b>投资主体:</b><span>" + item.attributes.ConstructionUnit
             + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 兆瓦"
             + "</span></li><li><b>上网电压:</b><span>" + item.attributes.InternetVoltage + " 千伏"
             + "</span></li><li><b>二氧化碳排量:</b><span>" + item.attributes.Carbondioxide + " 吨"
             + "</span></li><li><b>氢化物排量:</b><span>" + item.attributes.Hydride + " 吨"
             + "</span></li><li><b>粉尘排量:</b><span>" + item.attributes.Dust + " 吨"
             + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
             + "</span></li></ul>";
    }else if (type == 24) {
        content =
             "<ul><li><b>电站名称:</b><span>" + item.attributes.HydropowerStationName
             + "</span></li><li><b>电站类型:</b><span>" + item.attributes.HydropowerStationType
             + "</span></li><li><b>建设状态:</b><span>" + item.attributes.State
             + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 兆瓦"
             + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
             + "</span></li><li><b>所属流域:</b><span>" + item.attributes.BelongToBasin
             + "</span></li><li><b>建设单位:</b><span>" + item.attributes.ConstructionUnit
             + "</span></li></ul>";
    }else if (type == 25) {
        content = "<ul><li><b>电站名称:</b><span>" + item.attributes.Name
               + "</span></li><li><b>设计单位:</b><span>" + item.attributes.DesignUnits
               + "</span></li><li><b>燃料类型:</b><span>" + item.attributes.Type
               + "</span></li><li><b>项目进展:</b><span>" + item.attributes.State
               + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 兆瓦"
               + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
               + "</span></li><li><b>上网电量:</b><span>" + item.attributes.AccessPower + " 兆瓦·时"
               + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 兆瓦"
               + "</span></li></ul>";
    }else if (type == 26) {
        content = "<ul><li><b>风电站名称:</b><span>" + item.attributes.Name
                        + "</span></li><li><b>所属区域:</b><span>" + item.attributes.Address
                        + "</span></li><li><b>风机台数:</b><span>" + item.attributes.Amount + " 台"
                        + "</span></li><li><b>装机容量:</b><span>" + item.attributes.Installed + " 兆瓦"
                        + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 兆瓦"
                        + "</span></li><li><b>投资者:</b><span>" + item.attributes.Investor
                        + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
                        + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnit
                        + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                        + "</span></li></ul>";
    }else if (type == 27) {
        content = "<ul><li><b>电站名称:</b><span>" + item.attributes.Name
             + "</span></li><li><b>所属区域:</b><span>" + item.attributes.Address
             + "</span></li><li><b>装机数量:</b><span>" + item.attributes.GeneratorNum + " 台"
             + "</span></li><li><b>投资:</b><span>" + item.attributes.Investment + " 万元"
             + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
             + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnit
             + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
             + "</span></li></ul>";
    }else if (type == 28) {
        content = "<ul><li><b>名称:</b><span>" + item.attributes.Name
                   + "</span></li><li><b>起点:</b><span>" + item.attributes.StartPoint
                   + "</span></li><li><b>终点:</b><span>" + item.attributes.EndPoint
                   + "</span></li><li><b>长度:</b><span>" + item.attributes.Length+" 千米"
                   + "</span></li><li><b>最大传输功率:</b><span>" + item.attributes.Maxtransmission
                   + "</span></li><li><b>年传送体积:</b><span>" + item.attributes.AnnTransVol
                   + "</span></li><li><b>负载:</b><span>" + item.attributes.LoadRate
                   + "</span></li><li><b>类别:</b><span>" + item.attributes.Type
                   + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10);
    }else if (type == 29) {
        content = "<ul><li><b>电站名称:</b><span>" + item.attributes.Name
                    + "</span></li><li><b>项目所在:</b><span>" + item.attributes.Address
                    + "</span></li><li><b>电压等级:</b><span>" + item.attributes.VoltageLevel + ' 千伏'
                    + "</span></li><li><b>主变容量:</b><span>" + item.attributes.MainTransformerCapacity + ' 千瓦'
                    + "</span></li><li><b>下网负载:</b><span>" + item.attributes.NetLoad + ' 千瓦'
                    + "</span></li><li><b>类别:</b><span>" + item.attributes.Type
                    + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                    + "</span></li></ul>";
    }else if (type == 32) {
        content = "<ul><li><b>管道名称:</b><span>" + item.attributes.Name
                + "</span></li><li><b>管道类型:</b><span>规划</span></li>"
                + "<li><b>管道走向:</b><span>" + item.attributes.PipelineMoveTowards + "</span></li>"
                + "<li><b>管径:</b><span>" + item.attributes.PipeDiameter + " 米"+"</span></li>"
                + "<li><b>设计压力:</b><span>" + item.attributes.Pressure + " 兆帕" + "</span></li>"
                + "<li><b>年输气能力:</b><span>" + item.attributes.YeargasTransportationCapacity + " 亿方" + "</span></li>"
                + "<li><b>全长:</b><span>" + item.attributes.Length + " 千米" + "</span></li>"
                + "</ul>";
    }
    return content;
}
//加载资源专题图参数
var resourceJson = [{
        "identifier": "",
        "tileMatrixSet": "",
        "minx": "",
        "miny": "",
        "maxx": "",
        "maxy":"",
        "url": "",
        "originx": "",
        "originy": ""
    },{
         "identifier": "Water_Basin",//流域蕴藏量
         "tileMatrixSet": "Custom_Water_Basin",
         "minx": "96.811324046",
         "miny": "24.470114679000066",
         "maxx": "109.27840940900006",
         "maxy": "34.52871874900006",
         "url": "http://112.74.101.152:8090/iserver/services/map-ZTZT_Water/wmts_tianditu",
         "originx": "96.811324046",
         "originy": "34.52871874900006"
     }, {
         "identifier": "Water_Division",//区划蕴藏量
         "tileMatrixSet": "Custom_Water_Division",
         "minx": "97.35105544600003",
         "miny": "26.049023511000033",
         "maxx": "108.54135189000003",
         "maxy": "34.31474036800006",
         "url": "http://112.74.101.152:8090/iserver/services/map-ZTZT_Water/wmts_tianditu",
         "originx": "97.35105544600003",
         "originy": "34.31474036800006"
     },{
         "identifier": "",
         "tileMatrixSet": "",
         "minx": "",
         "miny": "",
         "maxx": "",
         "maxy": "",
         "url": "",
         "originx": "",
         "originy": ""
     }, {
         "identifier": "四川省风速分布",//风速分布
         "tileMatrixSet": "Custom_四川省风速分布",
         "minx": "96.55788242507582",
         "miny": "25.772947683720858",
         "maxx": "108.92485867198486",
         "maxy": "34.55894793743847",
         "url": "http://112.74.101.152:8090/iserver/services/map-FZY---FuBen/wmts_tianditu",
         "originx": "96.55788242507582",
         "originy": "34.55894793743847"
     }, {
         "identifier": "四川省风能密度分布",//风功率密度
         "tileMatrixSet": "Custom_四川省风能密度分布",
         "minx": "97.2835066774144",
         "miny": "25.993938818998213",
         "maxx": "108.6058762984553",
         "maxy": "34.369299353517135",
         "url": "http://112.74.101.152:8090/iserver/services/map-FZY---FuBen/wmts_tianditu",
         "originx": "97.2835066774144",
         "originy": "34.369299353517135"
     }, {
         "identifier": "",
         "tileMatrixSet": "",
         "minx": "",
         "miny": "",
         "maxx": "",
         "maxy": "",
         "url": "",
         "originx": "",
         "originy": ""
     },{
         "identifier": "NJFS2",//太阳能辐射
         "tileMatrixSet": "Custom_NJFS2",
         "minx": "97.2835066774144",
         "miny": "25.993938818998213",
         "maxx": "108.6058762984553",
         "maxy": "34.369299353517135",
         "url": "http://112.74.101.152:8090/iserver/services/map-ZTZT_solar/wmts_tianditu",
         "originx": "97.2835066774144",
         "originy": "34.369299353517135"
     }, {
         "identifier": "NJFS",
         "tileMatrixSet": "Custom_NJFS",//太阳能资源
         "minx": "97.28688093003431",
         "miny": "25.995013300541657",
         "maxx": "108.60425357273188",
         "maxy": "34.36855814161227",
         "url": "http://112.74.101.152:8090/iserver/services/map-ZTZT_solar/wmts_tianditu",
         "originx": "97.28688093003431",
         "originy": "34.36855814161227"
     }, {
         "identifier": "MTCS",//煤炭资源
         "tileMatrixSet": "Custom_MTCS",
         "minx": "100.96736581498045",
         "miny": "26.42466067804793",
         "maxx": "108.29276455344144",
         "maxy": "32.53580121915098",
         "url": "http://112.74.101.152:8090/iserver/services/map-MTCS/wmts_tianditu",
         "originx": "100.96736581498045",
         "originy": "32.53580121915098"
     }, {
         "identifier": "",
         "tileMatrixSet": "",//石油资源
         "minx": "",
         "miny": "",
         "maxx": "",
         "maxy": "",
         "url": "",
         "originx": "",
         "originy": ""
     }, {
         "identifier": "",//天然气资源
         "tileMatrixSet": "",
         "minx": "",
         "miny": "",
         "maxx": "",
         "maxy": "",
         "url": "",
         "originx": "",
         "originy": ""
     }, {
         "identifier": "SiChuan_Bound",//四川省边界
         "tileMatrixSet": "Custom_SiChuan_Bound",
         "minx": "97.2835066774144",
         "miny": "25.99391962823834",
         "maxx": "108.6058762984553",
         "maxy": "34.36927666226949",
         "url": "http://112.74.101.152:8090/iserver/services/map-SiChuan_Bound/wmts_tianditu",
         "originx": "97.2835066774144",
         "originy": "34.36927666226949"
     }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
     {
         "identifier": "",//天然气规划
         "tileMatrixSet": "",
         "minx": "",
         "miny": "",
         "maxx": "",
         "maxy": "",
         "url": "",
         "originx": "",
         "originy": ""
     },
     {
         "identifier": "Gas Current Situation_SiChuan",//天然气现状图层
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
         "identifier": "",//输电线路规划
         "tileMatrixSet": "",
         "minx": "",
         "miny": "",
         "maxx": "",
         "maxy": "",
         "url": "",
         "originx": "",
         "originy": ""
     }, {
         "identifier": "2015",//现状
         "tileMatrixSet": "Custom_2015",
         "minx": "97.28688093003431",
         "miny": "25.99499410922003",
         "maxx": "108.60425357273188",
         "maxy": "34.36853545059228",
         "url": "http://112.74.101.152:8090/iserver/services/map-power/wmts_tianditu",
         "originx": "97.28688093003431",
         "originy": "34.36853545059228"
     }, {
         "identifier": "2016",//规划
         "tileMatrixSet": "Custom_2016",
         "minx": "97.28688093003431",
         "miny": "25.995013300541657",
         "maxx": "108.60425357273188",
         "maxy": "34.36855814161227",
         "url": "http://112.74.101.152:8090/iserver/services/map-power/wmts_tianditu",
         "originx": "97.28688093003431",
         "originy": "34.36855814161227"
     }
];

//树
var treeList = [
    {
        "id": "node_1",
        "text": "水资源",
        "children": [
            {
                "id": "node_1_1",
                "text": "流域蕴含量专题图",
                "pid": "node_1",
                "children": []
            }, {
                "id": "node_1_2",
                "text": "区划蕴含量专题图",
                "pid": "node_1",
                "children": []
            }
        ]
    }, {
        "id": "node_2",
        "text": "风资源",
        "children": [
            {
                "id": "node_2_1",
                "text": "风速分布专题图",
                "pid": "node_2",
                "children": []
            }, {
                "id": "node_2_2",
                "text": "风功率密度专题图",
                "pid": "node_2",
                "children": []
            }
        ]
    }, {
        "id": "node_3",
        "text": "太阳能资源",
        "children": [
            {
                "id": "node_3_1",
                "text": "年均总辐射分布专题图",
                "pid": "node_3",
                "children": []
            }, {
                "id": "node_3_2",
                "text": "太阳能资源分区专题图",
                "pid": "node_3",
                "children": []
            }
        ]
    }, {
        "id": "node_4",
        "text": "煤炭资源",
        "children": []
    }, {
        "id": "node_5",
        "text": "石油资源",
        "children": []
    }, {
        "id": "node_6",
        "text": "天然气资源",
        "children": []
    }, {
        "id": "node_7",
        "text": "四川省边界",
        "children": []
    }, {
        "id": "node_8",
        "text": "煤炭项目",
        "children": []
    }, {
        "id": "node_9",
        "text": "石油项目",
        "children": [
            {
                "id": "node_9_1",
                "text": "石油储存库",
                "pid": "node_9",
                "children": []
            }, {
                "id": "node_9_2",
                "text": "输油管网",
                "pid": "node_9",
                "children": []
            }, {
                "id": "node_9_3",
                "text": "加油站",
                "pid": "node_9",
                "children": []
            }
        ]
    }, {
        "id": "node_10",
        "text": "天然气项目",
        "children": [
            {
                "id": "node_10_1",
                "text": "加气站",
                "pid": "node_10",
                "children": []
            }, {
                "id": "node_10_2",
                "text": "燃气公司",
                "pid": "node_10",
                "children": []
            }, {
                "id": "node_10_3",
                "text": "输气管网",
                "pid": "node_10",
                "children": []
            }
        ]
    }, {
        "id": "node_11",
        "text": "电站项目",
        "children": [
            {
                "id": "node_11_1",
                "text": "火电站",
                "pid": "node_11",
                "children": []
            }, {
                "id": "node_11_2",
                "text": "水电站",
                "pid": "node_11",
                "children": []
            },{
                "id": "node_11_3",
                "text": "生物质电站",
                "pid": "node_11",
                "children": []
            }, {
                "id": "node_11_4",
                "text": "风电场",
                "pid": "node_11",
                "children": []
            },{
                "id": "node_11_5",
                "text": "太阳能电站",
                "pid": "node_11",
                "children": []
            }
        ]
    }, {
        "id": "node_12",
        "text": "输电线路项目",
        "children": []
    }, {
        "id": "node_13",
        "text": "变电站项目",
        "children": []
    }, {
        "id": "node_14",
        "text": "天然气规划",
        "children": [
            {
                "id": "node_14_1",
                "text": "现状",
                "pid": "node_14",
                "children": []
            }, {
                "id": "node_14_2",
                "text": "规划",
                "pid": "node_14",
                "children": []
            }
        ]
    }, {
        "id": "node_15",
        "text": "输电线路规划",
        "children": [
            {
                "id": "node_15_1",
                "text": "现状",
                "pid": "node_15",
                "children": []
            }, {
                "id": "node_15_2",
                "text": "规划",
                "pid": "node_15",
                "children": []
            }
        ]
    }
];

//动态生成图例，最近一次选择，将图例添加到图例div的最上面
var legendhtml = [
    '',
    '<div id="waterbasionbox"><ul><li><div class="legendTitle">流域</div></li><li><div class="legendColor " onclick="" style="background-color: #5453BB;"></div><div class="legendLabel ">金沙江</div></li><li><div class="legendColor " onclick="" style="background-color: #7373CD;"></div><div class="legendLabel ">大渡河</div></li><li><div class="legendColor " onclick="" style="background-color: #7C76CE;"></div><div class="legendLabel ">雅砻江</div></li><li><div class="legendColor " onclick="" style="background-color: #9594E0;"></div><div class="legendLabel ">岷江</div></li><li><div class="legendColor" style="background-color: #A1A2D8;"></div><div class="legendLabel">长江</div></li><li><div class="legendColor " onclick="" style="background-color: #ABADE0;"></div><div class="legendLabel ">嘉陵江</div></li><li><div class="legendColor " onclick="" style="background-color: #C9C6F3;"></div><div class="legendLabel ">青衣江</div></li><li><div class="legendColor " onclick="" style="background-color: #D9D6F3;"></div><div class="legendLabel ">沱江</div></li><li><div class="legendColor" style="background-color: #F0EDF8;"></div><div class="legendLabel">任河</div></li></ul></div>',
    '<div id="waterregionbox"><ul><li><div class="legendTitle">蕴含量(兆瓦)</div></li><li><div class="legendColor " onclick="" style="background-color: #5452C0;"></div><div class="legendLabel ">30000~max</div></li><li><div class="legendColor " onclick="" style="background-color: #7679C0;"></div><div class="legendLabel">7000~30000</div></li><li><div class="legendColor" onclick="" style="background-color: #A2A2D6;"></div><div class="legendLabel ">3000~7000</div></li><li><div class="legendColor" onclick="" style="background-color: #BFBDE2;"></div><div class="legendLabel ">1000~3000</div></li><li><div class="legendColor " onclick="" style="background-color: #BDC7FF;"></div><div class="legendLabel">min~1000</div></li></ul></div>',
    '',
    '<div id="windspeedbox"><ul><li><div class="legendTitle">风速(米/秒)</div></li><li><img class="legendimgIcon" onclick="" src="/Css/images/GIS/gradually2.png" /><div class="legendLabel legendLabelImg">5.67725</div><div class="legendLabel legendLabelImg">1.04204</div></li></ul></div>',
    '<div id="windpowerbox"><ul><li><div class="legendTitle">风能密度(瓦/平方米)</div></li><li><img class="legendimgIcon" onclick="" src="/Css/images/GIS/gradually2.png" /><div class="legendLabel legendLabelImg">145</div><div class="legendLabel legendLabelImg">20</div></li></ul></div>',
    '',
    '<div id="solarradiobox"><ul><li><div class="legendTitle">年均辐射量(戈瑞)</div></li><li><img class="legendimgIcon" onclick="" src="/Css/images/GIS/gradually1.png" /><div class="legendLabel legendLabelImg">6911</div><div class="legendLabel legendLabelImg">4346</div></li></ul></div>',
    '<div id="solarpowerbox"><ul><li><div class="legendTitle">太阳能分区</div></li><li><div class="legendColor" onclick="" style="background-color: #FF4C50;"></div><div class="legendLabel">资源较丰富区</div></li><li><div class="legendColor" onclick="" style="background-color: #FF8A4D;"></div><div class="legendLabel">资源丰富区</div></li><li><div class="legendColor" onclick="" style="background-color: #FEC748;"></div><div class="legendLabel">资源可利用区</div></li><li><div class="legendColor" onclick="" style="background-color: #FAFF4F;"></div><div class="legendLabel">资源欠缺区</div></li></ul></div>',
    '<div id="coalbox"><ul><li><div class="legendTitle">煤炭资源分区 </div></li><li><img class="legendimg legendimgPic" onclick="" src="/Css/images/GIS/gradually3.png" /><div class="legendLabel legendimgPicLabel">煤区</div></li></ul></div>',
    '','','',
    '<div id="coalprojectbox"><ul style="height:16px;padding-top:6px;clear:both;"><li><div class="legendColor" onclick="" style="background-color: #996633;"></div><span class="legendspan">矿区</span></li></ul></div>',
    '','','','','','','','','',
    '<div id="firestationbox"><ul><li><div class="legendTitle">火力电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/firestation1.png" /><span class="legendspan legendimgBigLab">规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/firestation2.png" /><span class="legendspan legendimgBigLab">在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/firestation3.png" /><span class="legendspan legendimgBigLab">已建</span></li></ul></div>',
    '<div id="waterstationbox"><ul><li><div class="legendTitle">水电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation13.png" /><span class="legendspan legendimgBigLab">大型规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation23.png" /><span class="legendspan legendimgBigLab">大型在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation33.png" /><span class="legendspan legendimgBigLab">大型已建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation12.png" /><span class="legendspan legendimgBigLab">中型规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation22.png" /><span class="legendspan legendimgBigLab">中型在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation32.png" /><span class="legendspan legendimgBigLab">中型已建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation11.png" /><span class="legendspan legendimgBigLab">小型规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation21.png" /><span class="legendspan legendimgBigLab">小型在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/waterstation31.png" /><span class="legendspan legendimgBigLab">小型已建</span></li></ul></div>',
    '<div id="bioenergybox"><ul><li><div class="legendTitle">生物质电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/biostation1.png" /><span class="legendspan legendimgBigLab">规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/biostation2.png" /><span class="legendspan legendimgBigLab">在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/biostation3.png" /><span class="legendspan legendimgBigLab">已建</span></li></ul></div>',
    '<div id="windstationbox"><ul><li><div class="legendTitle">风电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/windstation1.png" /><span class="legendspan legendimgBigLab">规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/windstation2.png" /><span class="legendspan legendimgBigLab">在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/windstation3.png" /><span class="legendspan legendimgBigLab">已建</span></li></ul></div>',
    '<div id="solarstationbox"><ul><li><div class="legendTitle">太阳能电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/solarstation1.png" /><span class="legendspan legendimgBigLab">规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/solarstation2.png" /><span class="legendspan legendimgBigLab">在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/solarstation3.png" /><span class="legendspan legendimgBigLab">已建</span></li></ul></div>',
    '<div id="powerlinebox"><ul><li><div class="legendTitle">输电线</div></li><li><div class="legendLine" onclick="" style="background-color: #008000;"></div><span class="legendspan">规划</span></li><li><div class="legendLine" onclick="" style="background-color: #FF0000;"> </div><span class="legendspan">在建</span></li><li><div class="legendLine" onclick="" style="background-color: #0000FF;"> </div><span class="legendspan">已建</span></li></ul></div>',
    '<div id="substationbox"><ul><li><div class="legendTitle">变电站</div></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/substation1.png" /><span class="legendspan legendimgBigLab">规划</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/substation2.png" /><span class="legendspan legendimgBigLab">在建</span></li><li><img class="legendimgBig" onclick="" src="/Css/images/GIS/substation3.png" /><span class="legendspan legendimgBigLab">已建</span></li></ul></div>',
    '',
    '<div id="gasnowbox"><ul><li><div class="legendTitle">天然气现状</div></li><li><div class="legendLine" onclick="" style="background-color: #0C11B3;"></div><span class="legendspan">管道</span></li></ul></div>',
    '<div id="gasfuturebox"><ul><li><div class="legendTitle">天然气规划</div></li><li><div class="legendLine" onclick="" style="background-color:#FFF75C ;"></div><span class="legendspan">管道</span></li></ul></div>',
    '',
    '<div id="linenowbox"><ul><li><div class="legendTitle">输电线路现状</div></li><li><div class="legendLine" onclick="" style="background-color: #FF0000;"></div><span class="legendspan">线路</span></li></ul></div>',
    '<div id="linefuturebox"><ul><li><div class="legendTitle">输电线路规划</div></li><li><div class="legendLine" onclick="" style="background-color: #13AB34;"></div><span class="legendspan">线路</span></li></ul></div>'
];

//关于扩展，判断新增节点在树中位置，然后向数组中相应位置插入节点，然后更改方法中判断表达式


function ShapeToPoint(data) {//将Shape转经纬度
    if (data) {
        var returnarray = [];
        $.each(data, function (index, item) {
            var array = [];
            $.each(item, function (num, obj) {
                if (num == 'Shape') {
                    var wkt = new Wkt.Wkt();
                    wkt.read(item.Shape);
                    var config = {
                        spatialReference: {
                            wkid: 4326
                        },
                        editable: false
                    };
                    var point = wkt.toObject(config);
                    array.push("x:" + point.x);
                    array.push("y:" + point.y);
                } else {
                    array.push("\"" + num + "\"" + ":" + "\"" + obj + "\"");
                }
            });
            returnarray.push("{" + array + "}");
        });
        return eval("[" + returnarray + "]");
    }
}

//重写聚合算法
//设计思路：根据当前地图范围和分辨率，将地图分成若干个相等的矩形，每个矩形只显示最中央的那个点。
function overrideClusterLayer(distance, result) {
    var data = ShapeToPoint(result);//转换数据
    var mapMaxX = map.extent.xmax;
    var mapMinX = map.extent.xmin;
    var mapMaxY = map.extent.ymax;
    var mapMinY = map.extent.ymin;
    var clusterResolution = map.extent.getWidth() / map.width;//分辨率
    var width = parseInt((mapMaxX - mapMinX) / (distance*clusterResolution));
    var height = parseInt((mapMaxY - mapMinY) / (distance * clusterResolution));
    labellayer.clear();
    graphiclayerid[24].clear();
    map.addLayer(graphiclayerid[24]);
    map.addLayer(labellayer);
    if (map.InfoWindow) {
        map.InfoWindow.hide();
    }
    var points = [];//每个矩形的范围
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var minxx = mapMinX + i * (distance * clusterResolution);
            var maxxx = mapMinX + (i + 1) * (distance * clusterResolution);
            var minyy = mapMinY + j * (distance * clusterResolution);
            var maxyy = mapMinY + (j + 1) * (distance * clusterResolution);
            points.push({
                minx: minxx,
                maxx: maxxx,
                miny: minyy,
                maxy: maxyy
            });
        }
    }
    var areadata = [];//将当前范围的数据按照对应的矩形进行存放
    $.each(points, function(index, item) {
        areadata[index] = new Array();
        $.each(data, function(num, obj) {
            var xx = obj.x;
            var yy = obj.y;
            if (xx >= item.minx && xx < item.maxx && yy >= item.miny && yy < item.maxy) {
                areadata[index].push(obj);
            }
        });
    });
    //分别加载每个矩形的点
    $.each(areadata, function (index, item) {
        var length = item.length;
        if (length == 1) {
            addtolayer(item[0], length);//当当前矩形只有一个点时就显示当前点
        } else if (length == 0) {
        }else {
            var minobject = findcenter(index, item);//当当前矩形包含多个点时，选择最中央的点代表当前区域
            addtolayer(minobject, length);
        }
    });
    //鼠标点击事件
    graphiclayerid[24].on('click', function (event) {
        map.infoWindow.hide();
        var geotype = event.graphic.geometry.type;
        var symbol = event.graphic.symbol;
        var symbolwid = symbol.width;
        var symbolhei = symbol.height;
        if (symbolwid > 28) {
            map.setZoom(map.getZoom()+ 1);
        } else {
            if (geotype == 'point') {//如果是点，则放大图标
                if (symbolwid == 21) {
                    symbol.setWidth(28);
                }
                if (symbolhei == 27) {
                    symbol.setHeight(36);
                }
            }
            event.graphic.setSymbol(symbol);
            var content = content_infowindow(event.graphic, 24);
            map.infoWindow.setContent(content);
            map.infoWindow.setTitle("详情");
            map.infoWindow.show(event.mapPoint);
        }
    });
    //鼠标移除事件
    graphiclayerid[24].on('mouse-out', function (event) {
        var geotype = event.graphic.geometry.type;
        var symbol = event.graphic.symbol;
        var symbolwid = symbol.width;
        var symbolhei = symbol.height;
        if (geotype == 'point') {
            if (symbolwid == 28) {
                symbol.setWidth(21);
            } 
            if (symbolhei == 36) {
                symbol.setHeight(27);
            }
        }
        event.graphic.setSymbol(symbol);
    });
    //过滤当前矩形的所有数据并进行排序，得出最中央的点并返回
    function findcenter(index, data) {
        var tocenterdistance = [];
        var centerx = (points[index].maxx - points[index].minx) / 2;
        var centery = (points[index].maxy - points[index].miny) / 2;
        $.each(data, function(num, obj) {
            tocenterdistance.push(Math.sqrt(
                    Math.pow((centerx - obj.x), 2) + Math.pow((centery - obj.y), 2)
                    ));
        });
        tocenterdistance.sort();
        var minobj;
        $.each(data, function (num, obj) {
            var mindistance = Math.sqrt(
                Math.pow((centerx - obj.x), 2) + Math.pow((centery - obj.y), 2)
            );
            if (mindistance == tocenterdistance[0]) {
                minobj = obj;
            }
        });
        return minobj;
    }
    //将矩形中的点加载到地图
    function addtolayer(obj, length) {
        require(["esri/symbols/TextSymbol", "esri/Color", "esri/symbols/Font"], function (TextSymbol, Color, Font) {
            var point = new esri.geometry.Point(parseFloat(obj.x), parseFloat(obj.y), new esri.SpatialReference({ wkid: 4490 }));
            var font = new Font();
            font.setSize("12pt");
            font.setWeight(Font.WEIGHT_BOLD);
            var newLabel = new TextSymbol(length).setColor(new Color([255, 255, 255])).setOffset(0, 0).setFont(font);
            var graphicWeb = new esri.Graphic(point);
            graphicWeb.attributes = obj;
            var pointSymbol;
            if (length ==1) {
                var state = obj.State;
                var scale = obj.StationScale;
                pointSymbol=SetWaterStationSymbol(state, scale);
            }else if (length > 1 && length < 200) {
                pointSymbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/GreenPin1LargeB.png", 64, 64);
            } else {
                pointSymbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/RedPin1LargeB.png", 72, 72);
            }
            graphicWeb.setSymbol(pointSymbol);
            graphiclayerid[24].add(graphicWeb);
            if (length > 1) {
                var labelGraphic = new esri.Graphic(point, newLabel);
                labellayer.add(labelGraphic);
            }
        });
    }
}
