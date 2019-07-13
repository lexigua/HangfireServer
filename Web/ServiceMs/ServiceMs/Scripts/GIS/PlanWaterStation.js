var planWaterStationArry = [//type   规划类型   1:投产水电装机    2：开工水电       //建设规划
    { 'Name': '金沙江乌东德', 'type': '1' },
    { 'Name': '雅砻江杨房沟', 'type': '1','': '' },
    { 'Name': '卡拉', 'type': '1', '': '' },
    { 'Name': '大渡河猴子岩', 'type': '1', '': '' },
    { 'Name': '大渡河长河坝', 'type': '1', '': '' },
    { 'Name': '大渡河沙坪二级', 'type': '1', '': '' },
    { 'Name': '金沙', 'type': '1', '': '' },
    { 'Name': '金沙江叶巴滩', 'type': '2', '': '' },
    { 'Name': '金沙江乌东德', 'type': '2', '': '' },
    { 'Name': '金沙江白鹤滩', 'type': '2', '': '' },
    { 'Name': '雅砻江卡拉', 'type': '2', '': '' },
    { 'Name': '雅砻江楞古', 'type': '2', '': '' },
    { 'Name': '雅砻江孟底沟', 'type': '2', '': '' },
     { 'Name': '大渡河巴底', 'type': '2', '': '' },
      { 'Name': '大渡河沙坪一级', 'type': '2', '': '' },
       { 'Name': '大渡河枕头坝二级', 'type': '2', '': '' },

];
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
    PlanWaterLayer.on('mouse-move', function (event) {
        //console.log('你经过了一个graphic');
        event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 25, 25));
        if (event.graphic != undefined) {
            
            gtype = event.graphic.geometry.type;//当前要素类型
            
            if (gtype == "point") {
                var content =
            "<ul><li><b>电站名称:</b><span>" + ((event.graphic.attributes.Name == null || event.graphic.attributes.Name == "") ? "暂无" : event.graphic.attributes.Name)
            + "</span></li><li><b>建设性质:</b><span>" + ((event.graphic.attributes.Property == null || event.graphic.attributes.Property == "") ? "暂无" : event.graphic.attributes.Property)
            + "</span></li><li><b>建设状态:</b><span>" + ((event.graphic.attributes.State == null || event.graphic.attributes.State == "") ? "暂无" : event.graphic.attributes.State)
            + "</span></li><li><b>装机容量:</b><span>" + ((event.graphic.attributes.InstalledCapacity == null || event.graphic.attributes.InstalledCapacity == "") ? "暂无" : (event.graphic.attributes.InstalledCapacity + " 万千瓦"))
            + "</span></li><li><b>机组台数:</b><span>" + ((event.graphic.attributes.AlternatorQuantity == null || event.graphic.attributes.AlternatorQuantity == "") ? "暂无" : (event.graphic.attributes.AlternatorQuantity + " 台"))
            + "</span></li><li><b>投产时间:</b><span>" + ((event.graphic.attributes.ProductionTime == null || event.graphic.attributes.ProductionTime == "") ? "暂无" : event.graphic.attributes.ProductionTime)           
            + "</span></li></ul>";
                map.infoWindow.setContent(content);
                map.infoWindow.setTitle("详情");
                map.infoWindow.show(event.mapPoint);
            }
        }
    });
    PlanWaterLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var symbol;
        if (event.graphic.attributes.StationScale == '1') {
            symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/bigstation.png', 20, 20);
        }
        if (event.graphic.attributes.StationScale == '2') {
            symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 20, 20);
        }
        if (event.graphic.attributes.StationScale == '3') {
            symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/smallstation.png', 20, 20);
        }

        event.graphic.setSymbol(symbol);
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

    addSiChuanShengBorder();
    postwaterstation();
    addEchart();
    addEchart2();

});
//请求数据
function postwaterstation() {
    $.post("/GIS/PlanWaterStation/GetAllData", function (result) {
        var tempArray = JSON.parse(result);
        PlanWaterArry = FormatJsonDefault(tempArray);
    celectLevel(PlanWaterArry);
});
}

//加载规划水电站的图标
function addPlanWaterStation(res) {
    PlanWaterLayer.clear();
    map.infoWindow.hide();
    $.each(res, function (index, obj) {
        var pointSymbol;
        var pt = new esri.geometry.Point(parseFloat(obj.Longitude), parseFloat(obj.Latitude), new esri.SpatialReference({ wkid: 4490 }));
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = pt;
        graphicWeb.attributes = obj;
        if (obj.StationScale == "1") {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/bigstation.png', 20, 20);
        } 
        if(obj.StationScale=="2") 
        {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 20, 20);
        }
        if (obj.StationScale == "3") {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/smallstation.png', 20, 20);
        }
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
    //设置图标的宽度
    var winW = $(window).width() - 30;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    mychart1.css('width', winW / 3 * 2 + 'px');
    mychart2.css('width', winW / 3 + 'px');

    localStorage.setItem("pw_legend1", 0);
    localStorage.setItem("pw_legend2", 0);
    localStorage.setItem("pw_legend3", 0);
    $("#legend1").hide();
    $("#legend3").hide();
    $("#legend5").hide();

    $(".legendImg").click(function () {
        var id = $(this)[0].id;
        $(".legendImg").each(function (index, item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (ex.test(num)) {
                    $("#legend" + index).hide();
                    $("#legend" + (index + 1)).show();
                    localStorage.setItem("pw_legend" + (num + 1), 1);
                } else {
                    $("#legend" + index).hide();
                    $("#legend" + (index - 1)).show();
                    localStorage.setItem("pw_legend" + (parseInt(num) + 1), 0);
                }
                $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
                celectLevel(PlanWaterArry);
            }
        });
    });

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
            text: '四川盆地“十三五”水电站规划统计',
            subtext: '',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        color: ['#4BBC63', '#59C9EF'],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            //x: 'right',
            //y: 'top',
            //data: [ '容量']
            ////orient: 'vertical'
            top: 15,
            itemGap: 2
        },
        grid: {

            left: '3%',
            right: '3%',
            bottom: '10%',
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
                data: ['乌东德', '金沙', '乌东德', '苏洼龙', '岗托', '波罗', '叶巴滩', '拉哇', '巴塘', '昌波', '旭龙', '北鹤滩', '金沙',
                    '银江', '杨房沟', '卡拉', '两河口', '杨房沟', '牙根一级', '牙根二级', '楞古', '孟底沟', '卡拉', '长河坝', '沙坪二级',
                    '猴子岩', '猴子岩', '长河坝', '沙坪二级', '双江口', '金川', '安宁', '巴底', '丹巴', '硬梁包', '老鹰岩', '枕头坝二级', '沙坪一级', '硬梁包'],
                axisLabel: {
                    rotate: 30,
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
                   name: '容量',
                   type: 'bar',
                   data: [255, 14, 510, 60, 55, 48, 112, 100, 37.5, 53,
                       111, 800, 56, 36, 75, 75.5, 300, 150, 27,
                       108, 257.5, 240, 100, 260, 34.8, 17, 170,
                       260, 34.8, 200, 86, 38, 72, 119.6, 111.6, 22, 32.6, 34, 111.6]
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
            text: '四川盆地“十三五”水力发电量规划统计',
            subtext: '',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        color: ['#59C9EF'],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            top: 15,
            itemGap: 2
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
            data: ['2015年', '2016年', '2017年', '2018年', '2019年', '2020年'],
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
               {
                   name: '电源建设目标',
                   type: 'bar',
                   data: [6759,6969	,7525,7650,7779,8377]
               }
        ]
    };

    myChart3.setOption(option);
}
//图例选择
function celectLevel(ArryStation) {
    var legend1 = localStorage.getItem("pw_legend1");
    var legend2 = localStorage.getItem("pw_legend2");
    var legend3 = localStorage.getItem("pw_legend3");
    var array1 = ['1', '2', '3'];
    var array2 = [legend1, legend2, legend3];
    addPlanWaterStation(SelectByArbitrarily('StationScale', ArryStation, array1, array2));
}




