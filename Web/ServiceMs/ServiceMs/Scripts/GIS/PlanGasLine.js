var planGasLineArry;
var gasLineLayer;
var isverticalswipe = false;
var layerName;
var wmtsLayer_region;
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.CartographicLineSymbol")
dojo.require("esri.layers.graphics");
dojo.require("esri.renderers.ClassBreaksRenderer");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.InfoTemplate");
dojo.require("esri.geometry.Extent");
dojo.require("esri.SpatialReference");
dojo.require("esri.layers.WMTSLayer");
dojo.require("esri.layers.TiledMapServiceLayer");
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
    var point = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    //point = new esri.geometry.geographicToWebMercator(point);
    map.centerAndZoom(point, 7);


    //加载现状图层
    var Identifier = "Gas Current Situation_SiChuan";
    var tileMatrixSet = "Custom_Gas Current Situation_SiChuan";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 109.53082999606099, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_GAS/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    var layerNow = new ThematicLayer(extent, url, origin);
    layerNow.id = "uplayer";
    map.addLayer(layerNow);


    //加载规划图层
    var Identifier = "guandao@guandao";
    var tileMatrixSet = "Custom_guandao@guandao";
    var extent = new esri.geometry.Extent(97.35097729486642, 26.049047744957647, 109.53082999606099, 34.31453675476757, new esri.SpatialReference({ wkid: 4326 }))
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-supermapsuper/wmts_tianditu";
    var origin = { "x": 97.35097729486642, "y": 34.31453675476757 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    var layerPlan = new ThematicLayer(extent, url, origin);
    layerPlan.id = "toplayer";
    map.addLayer(layerPlan);

    gasLineLayer = new GraphicsLayer();
    map.addLayer(gasLineLayer);


    //鼠标移动事件，将graphic的样式换为另外一个
    gasLineLayer.on('mouse-move', function (event) {
        //console.log('你经过了一个graphic');
        
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 7);
        event.graphic.setSymbol(lineSymbol);
        var content = "";
        var ipos1, ipos2;
        if (event.graphic.attributes.StartBuildTime != null) {
            ipos1 = event.graphic.attributes.StartBuildTime.indexOf("T");
        }
        if (event.graphic.attributes.EndBuildTime != null) {
            ipos2 = event.graphic.attributes.EndBuildTime.indexOf("T");
        }
        if (event.graphic.attributes.Type == 0) {
            content = "<ul><li><b>管道名称:</b><span>" + event.graphic.attributes.Name + "</span></li>"
                + "<li><b>管道状态:</b><span>已建</span></li>"
                + "</ul>";
        }
        if (event.graphic.attributes.Type == 1) {
            content = "<ul><li><b>管道名称:</b><span>" + event.graphic.attributes.Name
                + "</span></li><li><b>管道类型:</b><span>规划</span></li>"
                 + "<li><b>管道走向:</b><span>" + event.graphic.attributes.PipelineMoveTowards+ "</span></li>"
                + "<li><b>管径:</b><span>" +event.graphic.attributes.PipeDiameter+ "</span></li>"
                + "<li><b>设计压力:</b><span>" + event.graphic.attributes.Pressure + "MPa" + "</span></li>"
                 + "<li><b>年输气能力:</b><span>" + event.graphic.attributes.YeargasTransportationCapacity + "亿方" + "</span></li>"
                  + "<li><b>开工时间:</b><span>" + event.graphic.attributes.StartBuildTime.substring(0, ipos1) + "</span></li>"
                   + "<li><b>建成时间:</b><span>" + event.graphic.attributes.EndBuildTime.substring(0, ipos2) + "</span></li>"
                    + "<li><b>全长:</b><span>" + event.graphic.attributes.Length + "公里" + "</span></li>"
                + "</ul>";
        }
        map.infoWindow.setContent(content);
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    gasLineLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0,0]), 7);
        if (event.graphic.attributes.Type == 0) {
            lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0,0]), 7);
        }
        if (event.graphic.attributes.Type == 1) {
            lineSymbol = new esri.symbol.CartographicLineSymbol(esri.symbol.CartographicLineSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0,0]), 6, esri.symbol.CartographicLineSymbol.CAP_ROUND,
            esri.symbol.CartographicLineSymbol.JOIN_ROUND, 5);

        }
        event.graphic.setSymbol(lineSymbol);
        map.infoWindow.hide();
    });



    //因为地图在缩放或者平移过程中，承载layer的 div会发生水平或者垂直方向的transform。所以计算出来
    //on(wmtsLayer_region, 'load', function () {

    var maptoplayerdiv = null;


    var ishorizontalswipe = false;


    map.on('mouse-move', function (e) {
        if (isverticalswipe == false) return;
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


    postPlanGasLine();

    addEchart();
   
});
//请求数据
function postPlanGasLine() {
    $.post("/GIS/ProjectGasPipeline/GetBasinOne", function (result) {   //GetCoalProject
        var tempArray = JSON.parse(result);
        planGasLineArry = FormatJsonDefault(tempArray);
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
                wkid: 4490
            },
            editable: false
        };

        var polygon = wkt.toObject(config);
        //polygon = esri.geometry.geographicToWebMercator(polygon);
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = polygon;
        graphicWeb.attributes = obj;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0,0]), 7);
        if (obj.Type == 0) {
            lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0,0]), 7);
        }
        if (obj.Type == 1) {
            lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0,0]), 7);//STYLE_SHORTDASH
            lineSymbol = new esri.symbol.CartographicLineSymbol(esri.symbol.CartographicLineSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0,0]), 6, esri.symbol.CartographicLineSymbol.CAP_ROUND, esri.symbol.CartographicLineSymbol.JOIN_ROUND, 5);

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
    //设置图表的宽度
    var winW = $(window).width() - 80;
    var mychart1 = $('#mychart1');
    mychart1.css('width', winW + 'px');

        var changeNum = 1;
    $(".changeBtn").click(function () {
        if (changeNum == 1) {
            $(this).css({ "background": "#bbb" });
            isverticalswipe = !isverticalswipe;
            gasLineLayer.hide();
            changeNum = 0;
        }
        else {
            $(this).css({ "background": "#4c8fed" });
            isverticalswipe = !isverticalswipe;
            gasLineLayer.show();
            changeNum = 1;
        }
    })

    $("#data_list").datagrid({
        data: [
        { 'Name': '中石油西南油气田分公司', '2011': '155', '2012': '175', '2013': '200', '2014': '225', '2015': '251' },
         { 'Name': '中石化西南油气分公司', '2011': '45', '2012': '65', '2013': '66', '2014': '70', '2015': '82' },
          { 'Name': '中石化普光分公司', '2011': '50', '2012': '80', '2013': '80', '2014': '80', '2015': '80' },
           { 'Name': '合计', '2011': '250', '2012': '320', '2013': '346', '2014': '375', '2015': '413' }
        ]

    });

    $("#data_list1").datagrid({
        data: [
        { 'Name': '中石油', '2011': '190', '2012': '175', '2013': '200', '2014': '225', '2015': '251' },
         { 'Name': '中石化西南油气分公司', '2011': '78', '2012': '65', '2013': '66', '2014': '70', '2015': '82' },
          { 'Name': '中石化普光分公司', '2011': '20', '2012': '80', '2013': '80', '2014': '80', '2015': '80' },
           { 'Name': '合计', '2011': '288', '2012': '320', '2013': '346', '2014': '375', '2015': '413' }
        ]

    });
    $("#data_list2").datagrid({
        data: [
        { 'Name': '中石油', '2011': '190', '2012': '175', '2013': '200', '2014': '225', '2015': '251' },
         { 'Name': '中石化西南油气分公司', '2011': '78', '2012': '65', '2013': '66', '2014': '70', '2015': '82' },
          { 'Name': '中石化普光分公司', '2011': '20', '2012': '80', '2013': '80', '2014': '80', '2015': '80' },
           { 'Name': '合计', '2011': '288', '2012': '320', '2013': '346', '2014': '375', '2015': '413' }
        ]

    });
    //天然气管道
    $("#data_list_piping").datagrid({
        data: [
        { 'Name': '北外环集输气管道', '2011': '达州、南充、巴中、德阳', '2012': '2010-2013', '2013': '37.03', '2014': '管道全长468KM，年输气能力60亿方' },
         { 'Name': '四川石化基地供气工程', '2011': '德阳、成都', '2012': '2011-2011', '2013': '2.44', '2014': '管道全长56KM，年输气能力20亿方' },
          { 'Name': '铁山坡净化气集输管道', '2011': '达州', '2012': '2012-2013', '2013': '2.66', '2014': '管道全长61KM，年输气能力16亿方' },
        { 'Name': '达州供气管道工程', '2011': '达州', '2012': '2012-2013', '2013': '1.00', '2014': '管道全长65KM，年输气能力10亿方' },
{ 'Name': '乐山地区天然气输气管道工程', '2011': '乐山', '2012': '2011-2013', '2013': '4.15', '2014': '管道全长150KM，新增输气能力22亿方' },
{ 'Name': '江津－纳溪输气管道工程', '2011': '重庆江津、四川泸州', '2012': '2011-2013', '2013': '7.4', '2014': '管道全长115km，年输气能力40亿方' },
{ 'Name': '自贡-隆昌-荣昌-永川管道工程', '2011': '自贡、内江', '2012': '2011-2014', '2013': '1.7', '2014': '管道全长50km，年输气能力17亿方' },
{ 'Name': '楚雄－攀枝花－西昌输气管道工程', '2011': '云南楚雄、四川攀枝花、西昌', '2012': '2012-2014', '2013': '17.00', '2014': '管道全长450km，年输气能力30亿方' },
{ 'Name': '中卫-贵阳天然气联络线（四川段）', '2011': '广元、南充、广安', '2012': '2010-2012', '2013': '33.10', '2014': '管道全长323km，年输气能力150亿方' },
{ 'Name': '大邑—青白江—德阳输气管道', '2011': '成都市、德阳市', '2012': '2012-2016', '2013': '8', '2014': '管道全长170KM，年输气能力36亿方' },
{ 'Name': '绵阳清管站～丰谷～东岳输气管线', '2011': '绵阳市', '2012': '2015-2016', '2013': '3', '2014': '管道全长30KM，新增输气能力20亿方' },
        { 'Name': '川东北－川西输气管道', '2011': '德阳市、南充市、绵阳市、巴中市、达州市、广元市', '2012': '2008-2020', '2013': '46', '2014': '管道全长430KM，年输气能力110亿方' }

        ]

    });
    //天然气气田
    $("#data_list_piping_gas_field").datagrid({
        data: [
        { 'Name': '川东北高含硫气田开发', '2011': '达州', '2012': '续建', '2013': '2011-2015', '2014': '82', '2015': '新建产能50亿方/年' },
         { 'Name': '龙岗气田开发', '2011': '南充、广元', '2012': '续建', '2013': '2011-2015', '2014': '87', '2015': '新建产能32亿方/年' },
        { 'Name': '川中、川西须家河组气田开发', '2011': '遂宁、资阳等', '2012': '续建', '2013': '2011-2015', '2014': '62', '2015': '新增产能22亿方/年' },
        { 'Name': '中石油川西、川南老气田开发', '2011': '绵阳、泸州等', '2012': '续建', '2013': '2011-2015', '2014': '56', '2015': '新增产能15亿方/年' },
       { 'Name': '页岩气开发', '2011': '自贡、内江、宜宾', '2012': '新建', '2013': '2011-2015', '2014': '52', '2015': '新增产能15亿方/年' },
       { 'Name': '普光气田开发', '2011': '达州', '2012': '续建', '2013': '2011-2015', '2014': '25', '2015': '新建产能   亿方/年' },
       { 'Name': '元坝气田开发', '2011': '广元', '2012': '续建', '2013': '2011-2015', '2014': '114', '2015': '新建产能24亿方/年' },
       { 'Name': '中石化川西老气田深层开发', '2011': '成都、德阳、绵阳', '2012': '续建', '2013': '2011-2015', '2014': '51', '2015': '新增产能17亿方/年' },
       { 'Name': '中石化川西老气田浅层开发', '2011': '成都、德阳、绵阳', '2012': '续建', '2013': '2011-2015', '2014': '45', '2015': '新增产能 6 亿方/年' }


        ]

    });
    $('#data_list_piping').datagrid({ loadFilter: pagerFilter });
});

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
            x: 'center',
            top: 0,
            textStyle: {
                fontSize: 16
            },
        },
            color: ['#4BBC63', '#59C9EF', '#FF855F', '#67D6C1', '#9966CC', '#6699FF', '#F7C263', '#FFE443'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['产量', '供应', '需求'],
                //orient: 'vertical'
                x: 'right',
                y: 'top',
                top: 15,
                itemGap: 2,
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
        }
    myChart3.setOption(option);
}







