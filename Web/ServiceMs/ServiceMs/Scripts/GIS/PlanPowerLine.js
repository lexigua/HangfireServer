//var planGasLineArry;
//var gasLineLayer;
var isverticalswipe = false;
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.CartographicLineSymbol");
dojo.require("esri.layers.graphics");
dojo.require("esri.renderers.ClassBreaksRenderer");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.InfoTemplate");
dojo.require("esri.geometry.Extent");
dojo.require("esri.SpatialReference");
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
    map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } }), 7);

    //gasLineLayer = new GraphicsLayer();
    //map.addLayer(gasLineLayer);

    //map.on('mouse-move', function (event) {

    //    if (event.graphic != undefined) {
    //        console.log(event.graphic);
    //        var content = "";
    //        if (event.graphic.attributes.Type == 0) {
    //            content = "<ul><li><b>管道名称:</b><span>" + event.graphic.attributes.Name + "</span></li><li><b>管道名称:</b><span>已建</span></li></ul>";
    //        }
    //        if (event.graphic.attributes.Type == 1) {
    //            content = "<ul><li><b>管道名称:</b><span>" + event.graphic.attributes.Name + "</span></li><li><b>管道类型:</b><span>规划</span></li></ul>";
    //        }

    //        map.infoWindow.setContent(content);
    //        map.infoWindow.setTitle("详情");
    //        map.infoWindow.show(event.mapPoint, esri.dijit.InfoWindow.ANCHOR_UPPERLEFT);
    //    } else {
    //        map.infoWindow.hide();
    //    }
    //});

    //因为地图在缩放或者平移过程中，承载layer的 div会发生水平或者垂直方向的transform。所以计算出来
    //on(wmtsLayer_region, 'load', function () {


    //2015图层
    var Identifier = "2015";
    var tileMatrixSet = "Custom_2015";
    var extent = new esri.geometry.Extent(97.34967842925383, 26.049047744957647, 108.54095798941984, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }));
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-power/wmts_tianditu";
    var origin = { "x": 97.34967842925383, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    var layerNow = new ThematicLayer(extent, url, origin);
    layerNow.id = "uplayer";
    map.addLayer(layerNow);


    //2016图层
    var Identifier = "2016";
    var tileMatrixSet = "Custom_2016";
    var extent = new esri.geometry.Extent(97.34967842925383, 26.049047744957647, 108.54095798941984, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }));
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-power/wmts_tianditu";
    var origin = { "x": 97.34967842925383, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    var layerPlan = new ThematicLayer(extent, url, origin);
    layerPlan.id = "toplayer";
    map.addLayer(layerPlan);


    var maptoplayerdiv = null;


    var ishorizontalswipe = false;


    map.on('mouse-move', function (e) {
        maptoplayerdiv = maptoplayerdiv ? maptoplayerdiv : document.getElementById(map.id + '_toplayer'); //map_layer1   _toplayer
        var offsetX = e.screenPoint.x;
        var offsetY = e.screenPoint.y;
        var mapheightpx = maptoplayerdiv.style.height;
        var mapwidthpx = maptoplayerdiv.style.width;
        var mapheight = parseInt(mapheightpx.substring(0, mapheightpx.lastIndexOf('px')));//去掉单位px 取出数值
        var mapwidth = parseInt(mapwidthpx.substring(0, mapwidthpx.lastIndexOf('px')));
        var origin = getLayerTransform(maptoplayerdiv);
        var cliptop = -origin.y + "px";
        var clipleft = -origin.x + "px";//clip的左上起点
        var clipbottom, clipright;
        clipbottom = ishorizontalswipe ? (offsetY - origin.y) + 'px' : (mapheight - origin.y) + 'px';
        clipright = isverticalswipe ? (offsetX - origin.x) + "px" : (mapwidth - origin.x) + "px";
        //console.log('rect(' + cliptop + ',' + clipright + ',' + clipbottom + ',' + clipleft + ')');
        maptoplayerdiv.style.clip = 'rect(' + cliptop + ',' + clipright + ',' + clipbottom + ',' + clipleft + ')';
    });
    //  })


    //postPlanGasLine();
    //addEchart();
    //addSiChuanShengBorder1();
});
//请求数据
function postPlanGasLine() {
    $.post("/GIS/ProjectGasPipeline/GetBasinOne", function (result) {   //GetCoalProject
        planGasLineArry = JSON.parse(result);
        console.log(planGasLineArry);
        addSunProject(planGasLineArry);
    });
}

//加载管道
function addSunProject(res) {
    gasLineLayer.clear();
    map.infoWindow.hide();
    $.each(res, function (index, obj) {
        var wkt = new Wkt.Wkt();
        wkt.read(obj.Shape);
        var config = {
            spatialReference: {
                wkid: 4326
            },
            editable: false
        };

        var polygon = wkt.toObject(config);
        polygon = esri.geometry.geographicToWebMercator(polygon);
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = polygon;
        graphicWeb.attributes = obj;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 213]), 6);
        if (obj.Type == 0) {
            lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 213]), 6);
        }
        if (obj.Type == 1) {
            lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDASH, new dojo.Color([93, 93, 95]), 6);
            lineSymbol = new esri.symbol.CartographicLineSymbol(esri.symbol.CartographicLineSymbol.STYLE_SHORTDASH,
                new esri.Color([93, 93, 95]), 6, esri.symbol.CartographicLineSymbol.CAP_ROUND,
                esri.symbol.CartographicLineSymbol.JOIN_ROUND, 5);

        }
        var polySymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 255, 255, 0.5]));
        graphicWeb.setSymbol(lineSymbol);
        gasLineLayer.add(graphicWeb);
    });

    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(gasLineLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });
}


$(function () {
    //卷帘对比
    var changeNum = 1;
    $(".changeBtn").click(function() {
        if (changeNum == 1) {
            $(this).css({ "background": "#bbb" });
            isverticalswipe = !isverticalswipe;
            changeNum = 0;
        } else {
            $(this).css({ "background": "#4c8fed" });
            isverticalswipe = !isverticalswipe;
            changeNum = 1;
        }
    });
    //卫星和普通地图切换
    $(".mapChange").on("click", ".streetMap", function () {
        $(this).css({ "background": "#4c8fed" }).siblings().css({ "background": "#bbb" });
        selectedIfo = 'jd';
        showLayer(selectedIfo);
    });
    $(".mapChange").on("click", ".satelliteMap", function () {
        selectedIfo = 'wx';
        $(this).css({ "background": "#4c8fed" }).siblings().css({ "background": "#bbb" });
        showLayer(selectedIfo);
    });
});
//
function addEchart(Arry) {
    var myChart3 = echarts.init(document.getElementById('mychart1'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [];
    //$.each(Arry, function (index, item) {
    //    arry1.push(item.Name);//名称
    //    //arry2.push(item.StationNum);
    //    //var a = { value: item.StationNum, name: item.Name };
    //    arry2.push(item.Reserves);//理论蕴藏量
    //    arry3.push(item.DevelopByEcNum);//经济可开发量
    //    arry4.push(item.DevelopByTechNum);//已开发装机容量
    //});
    //console.log(arry2);
    //console.log(arry1);
    //console.log(arry3);
    //console.log(arry4);
    option = {
        title: {
            text: '四川盆地“十三五”天然气规划统计',
            subtext: '',
            left: 600
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['供应', '需求', '产量'],
            //orient: 'vertical'
            right: 160
        },
        grid: {

            bottom: 25,
            top: 40

        },
        toolbox: {
            show: true,
            feature: {
                //dataView: { show: true, readOnly: false },
                //magicType: { show: true, type: ['line', 'bar'] },
                //restore: { show: true },
                //saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['2011年', '2012年', '2013年', '2014年', '2015年']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位:亿方'
            }
        ],
        series: [
            {
                name: '产量',
                type: 'bar',
                data: [160, 190, 240, 250, 270]
            },
               {
                   name: '供应',
                   type: 'bar',
                   data: [140, 150, 170, 210, 288]
               },
            {
                name: '需求',
                type: 'bar',
                data: [250, 320, 346, 375, 413]
            }
        ]
    };

    myChart3.setOption(option);
}


