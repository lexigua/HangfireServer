var gasLineLayer;
var isverticalswipe = false;
var layerName;
var wmtsLayer_region;
var PlanWaterArry;//规划水电站的所有数据
var PlanWaterLayer;
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
    PlanWaterLayer = new GraphicsLayer();
    map.addLayer(PlanWaterLayer);



    //设置地图的中心点和缩放层级
    var point = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    //point = new esri.geometry.geographicToWebMercator(point);
    map.centerAndZoom(point, 7);


    //加载现状图层



    //加载规划图层


    map.on('mouse-move', function (event) {
        if (event.graphic != undefined) {
            console.log(event.graphic);
            gtype = event.graphic.geometry.type;//当前要素类型
            console.log(gtype);
            if (gtype == "point") {
                var content =
            "<ul><li><b>电站名称:</b><span>" + event.graphic.attributes.Name
            + "</span></li><li><b>建设性质:</b><span>" +event.graphic.attributes.Property
            + "</span></li><li><b>建设状态:</b><span>" + '暂无'//event.graphic.attributes.State
            + "</span></li><li><b>装机容量:</b><span>" + event.graphic.attributes.InstalledCapacity + " 万千瓦"
            + "</span></li><li><b>机组台数:</b><span>" + event.graphic.attributes.AlternatorQuantity + " 台"
            + "</span></li><li><b>投产时间:</b><span>" + event.graphic.attributes.ProductionTime
            + "</span></li></ul>";
                map.infoWindow.setContent(content);
                map.infoWindow.setTitle("详情");
                map.infoWindow.show(event.mapPoint);
            }
        } else {
            map.infoWindow.hide();
        }

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


    postwaterstation();
    addEchart();
    addEchart2();

});
//请求数据
function postwaterstation() {
    $.post("/GIS/PlanWaterStation/GetAllData", function (result) {
        var tempArray = JSON.parse(result);
        PlanWaterArry = FormatJsonDefault(tempArray);
        addPlanWaterStation(PlanWaterArry);
    });
}

//加载规划水电站的地图
function addPlanWaterStation(res) {
    PlanWaterLayer.clear();
    map.infoWindow.hide();
    $.each(res, function (index, obj) {
        var pt = new esri.geometry.Point(parseFloat(obj.Longitude), parseFloat(obj.Latitude), new esri.SpatialReference({ wkid: 4490 }));
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = pt;
        graphicWeb.attributes = obj;
        var pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/waterstation.png', 25, 25);
        graphicWeb.setSymbol(pointSymbol);
        PlanWaterLayer.add(graphicWeb);
    });

    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(PlanWaterLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });

}

//加载管道


$(function () {
    $("#data_list").datagrid({
        fitColumns: true,
        data: [
            { 'Name': '乌东德', '2011': '255', '2012': '"十三五"新建', '2013': '投产装机(投产3台机组)', '2014': '金沙江' },
                     { 'Name': '金沙', '2011': '14', '2012': '"十三五"新建', '2013': '投产装机(投产首台机组)', '2014': '金沙江' },
        { 'Name': '乌东德', '2011': '510', '2012': '"十二五"结转', '2013': '建设规模', '2014': '金沙江' },
         { 'Name': '苏洼龙', '2011': '60', '2012': '"十二五"结转', '2013': '建设规模', '2014': '金沙江' },
          { 'Name': '岗托', '2011': '55', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
           { 'Name': '波罗', '2011': '48', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
            { 'Name': '叶巴滩', '2011': '112', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
             { 'Name': '拉哇', '2011': '100', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
              { 'Name': '巴塘', '2011': '37.5', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
               { 'Name': '昌波', '2011': '53', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
                { 'Name': '旭龙', '2011': '111', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
                 { 'Name': '北鹤滩', '2011': '800', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
                  { 'Name': '金沙', '2011': '56', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },
                   { 'Name': '银江', '2011': '36', '2012': '"十三五"新建', '2013': '建设规模', '2014': '金沙江' },

        ]

    });

    $("#data_list1").datagrid({
        fitColumns: true,
        data: [
             { 'Name': '杨房沟', '2011': '75', '2012': '"十三五"新建', '2013': '投产装机(投产2台机组)', '2014': '雅砻江' },
                { 'Name': '卡拉', '2011': '75.5', '2012': '"十三五"新建', '2013': '投产装机(投产首台机组)', '2014': '雅砻江' },
        { 'Name': '两河口', '2011': '300', '2012': '"十二五"结转', '2013': '建设规模', '2014': '雅砻江' },
         { 'Name': '杨房沟', '2011': '150', '2012': '"十二五"结转', '2013': '建设规模', '2014': '雅砻江' },
          { 'Name': '牙根一级', '2011': '27', '2012': '"十三五"新建', '2013': '建设规模', '2014': '雅砻江' },
           { 'Name': '牙根二级', '2011': '108', '2012': '"十三五"新建', '2013': '建设规模', '2014': '雅砻江' },
            { 'Name': '楞古', '2011': '257.5', '2012': '"十三五"新建', '2013': '建设规模', '2014': '雅砻江' },
             { 'Name': '孟底沟', '2011': '240', '2012': '"十三五"新建', '2013': '建设规模', '2014': '雅砻江' },
              { 'Name': '卡拉', '2011': '100', '2012': '"十三五"新建', '2013': '建设规模', '2014': '雅砻江' },

        ]

    });
    $("#data_list2").datagrid({
        fitColumns: true,
        data: [
                    { 'Name': '长河坝', '2011': '260', '2012': '"十三五"新建', '2013': '投产装机', '2014': '大渡河' },
                       { 'Name': '沙坪二级', '2011': '34.8', '2012': '"十三五"新建', '2013': '投产装机', '2014': '大渡河' },
                          { 'Name': '猴子岩', '2011': '17', '2012': '"十三五"新建', '2013': '投产装机', '2014': '大渡河' },
         { 'Name': '猴子岩', '2011': '170', '2012': '"十二五"结转', '2013': '建设规模', '2014': '大渡河' },
         { 'Name': '长河坝', '2011': '260', '2012': '"十二五"结转', '2013': '建设规模', '2014': '大渡河' },
          { 'Name': '沙坪二级', '2011': '34.8', '2012': '"十二五"结转', '2013': '建设规模', '2014': '大渡河' },
           { 'Name': '双江口', '2011': '200', '2012': '"十二五"结转', '2013': '建设规模', '2014': '大渡河' },
            { 'Name': '金川', '2011': '86', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
             { 'Name': '安宁', '2011': '38', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
              { 'Name': '巴底', '2011': '72', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
               { 'Name': '丹巴', '2011': '119.6', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
                { 'Name': '硬梁包', '2011': '111.6', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
                 { 'Name': '老鹰岩', '2011': '22', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
                  { 'Name': '枕头坝二级', '2011': '32.6', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
                   { 'Name': '沙坪一级', '2011': '34', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' },
                    { 'Name': '硬梁包', '2011': '111.6', '2012': '"十三五"新建', '2013': '建设规模', '2014': '大渡河' }


        ]

    });
    //天然气管道
    $("#data_list_piping").datagrid({
        data: [
        { 'Name': '攀钢自备扩建工程', '2011': '30', '2012': '2015', '2013': '攀枝花', '2014': '已核准' },
        { 'Name': '神华江油天明电厂', '2011': '200', '2012': '2015', '2013': '江油', '2014': '已核准' },
        { 'Name': '大唐广元电厂', '2011': '200', '2012': '十三五', '2013': '广元', '2014': '已纳入国家火电项目规划' },
        { 'Name': '白马循环流化床', '2011': '66', '2012': '十三五', '2013': '内江', '2014': '已规划火电储备' },
        { 'Name': '宜宾筠连煤矸石发电项目', '2011': '70', '2012': '十三五', '2013': '宜宾', '2014': '已规划火电储备' },
        { 'Name': '泸州叙永煤矸石发电项目', '2011': '70', '2012': '2015', '2013': '泸州', '2014': '已规划火电储备' },
        { 'Name': '乐山嘉阳煤矸石发电项目', '2011': '70', '2012': '2011-2014', '2013': '乐山', '2014': '已规划火电储备' }
        ]

    });
    //天然气气田
    $("#data_list_fire_field").datagrid({
        data: [
        { 'Name': '燃煤发电', '2015': '1286', '2016': '1283', '2017': '1383', '2018': '1483', '2019': '1443', '2020': '1401' },
         { 'Name': '天然气发电', '2015': '70', '2016': '70', '2017': '70', '2018': '70', '2019': '70', '2020': '70' },
        { 'Name': '余气余压余热发电', '2015': '206', '2016': '206', '2017': '206', '2018': '206', '2019': '206', '2020': '206' },
        { 'Name': '退役燃煤发电', '2015': '-4.7', '2016': '-33.6', '2017': '0', '2018': '0', '2019': '-40', '2020': '-42' }
        ]

    });
    $('#data_list_piping').datagrid({ loadFilter: pagerFilter });

    //设置图标的宽度
    var winW = $(window).width() - 60;
    var mychart1 = $('#mychart1');
    var machart2 = $('#mychart2');
    mychart1.css('width', winW/2 + 'px');
    machart2.css('width', winW/2 + 'px');
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
            text: '四川盆地“十三五”火力发电站规划统计',
            subtext: '',
            x: 'left'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            //data: ['装机容量'],
            ////orient: 'vertical'
            //x:'right'
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
                data: ['攀钢自备扩建工程', '神华江油天明电厂', '大唐广元电厂', '白马循环流化床', '宜宾筠连煤矸石发电项目', '泸州叙永煤矸石发电项目', '乐山嘉阳煤矸石发电项目'],
                axisLabel: {
                    show: true,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位:万千瓦'
            }
        ],
        series: [
            //{
            //    name: '电站个数',
            //    type: 'bar',
            //    data: [14, 9, 16]
            //},
               {
                   name: '装机容量',
                   type: 'bar',
                   data: [30,200,200,66,70,70,70]
               }
            //{
            //    name: '需求',
            //    type: 'bar',
            //    data: [250, 320, 346, 375, 413]
            //}
        ]
    };

    myChart3.setOption(option);
}
function addEchart2(Arry) {
    var myChart3 = echarts.init(document.getElementById('mychart2'));
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
            text: '四川盆地“十三五“火力发电规划统计',
            subtext: '',
            x: 'left'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['燃煤', '天然气发电', '余气余压余热'],
            //orient: 'vertical'
            x: 'right'
            
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
                data: ['2015', '2016', '2017', '2018', '2019', '2020'],
                axisLabel: {
                    show: true,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位:万千瓦'
            }
        ],
        series: [
            //{
            //    name: '电站个数',
            //    type: 'bar',
            //    data: [14, 9, 16]
            //},
               {
                   name: '燃煤',
                   type: 'line',
                   data: [1286,1283,1383,1483,1443,1401]
               },
            {
                name: '天然气发电',
                type: 'bar',
                data: [70, 70, 70, 70, 70, 70]
            },
            {
                name: '余气余压余热',
                type: 'bar',
                data: [206, 206, 206, 206, 206, 206]
            }
        ]
    };

    myChart3.setOption(option);
}
