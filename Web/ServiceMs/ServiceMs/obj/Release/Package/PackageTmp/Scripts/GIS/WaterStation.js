
$(function () {
    var winW = $("#divMain").width() - 20;
    var mychart1 = $('#mychart1');
    var mychart2 = $('#mychart2');
    var mychart3 = $('#mychart3');
    mychart1.css('width', winW / 4 + 'px');
    mychart2.css('width', winW / 2+ 'px');
    mychart3.css('width', winW / 4 + 'px');
    $(".legend_flow").hide();
    $(".legend_xz").hide();
});
var fieldarray = ['HydropowerStationName', 'StationScale', 'BelongToBasin', 'TotalStorageCapacity', 'BelongToRegion', 'InstalledCapacity', 'HydropowerStationType', 'All'];
var typearray = ['2', '2', '2', '1', '2', '1', '2',  '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("w_legend1", 0);
    localStorage.setItem("w_legend2", 0);
    localStorage.setItem("w_legend3", 0);
    localStorage.setItem("w_state4", 0);
    localStorage.setItem("w_state5", 0);
    localStorage.setItem("w_state6", 0);
    $("#legend0").show();
    $("#legend1").hide();
    $("#legend2").show();
    $("#legend3").hide();
    $("#legend4").show();
    $("#legend5").hide();
    $("#state6").show();
    $("#state7").hide();
    $("#state8").show();
    $("#state9").hide();
    $("#state10").show();
    $("#state11").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        if (tabtip == 0) {
            celectLevel(ArryStation);//图例选择
        } else {
            selectState(ArryStation);//状态选择
        }
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
        var array = ConditionQuery(ArryStation, condition, minvalue, maxvalue, type);
        if (tabtip == 0) {
            celectLevel(array);//图例选择
        } else {
            selectState(array);//状态选择
        }
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


var tabtip = 1;//初始化图例tab的值
var ArryStation;
var arryStation = [];//供图例使用
var labelPointGraphicLayer;//文本图层
var waterStationLayer;
var borderLayer;//边界图层
var water_basinlayer;//区划专题图图层
var water_arealayer;//流域专题图图层
var ArryBasin;
var ArryCity;
var InstalledCapacity_basin;
var InstalledCapacity_region;
var ArrayStation;
var tabindex = 0;//用于指示tab1的选择情况
var gra;//用于存储表格点击时获取到的一个graphic
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
dojo.require("extras.ThematicLayer");
require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer", "extras/ThematicLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "esri/layers/GraphicsLayer"], function (Map, InfoWindow, TDTRoadLayer,ThematicLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer) {
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
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    
    map.centerAndZoom(pt,5);
    borderLayer = new GraphicsLayer();
    map.addLayer(borderLayer);
    waterStationLayer = new GraphicsLayer();
    map.addLayer(waterStationLayer);
    //鼠标移动事件，将graphic的样式换为另外一个
    waterStationLayer.on('mouse-move', function(event) {
        //console.log('你经过了一个graphic');
        event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 20, 20));
        map.infoWindow.setContent(infowindow_content(event.graphic));
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    waterStationLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var symbol;
        if (tabtip == 1) {
            if (event.graphic.attributes.StationScale == '1') {
                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/bigstation.png', 15, 15);
            }
            if (event.graphic.attributes.StationScale == '2') {
                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 15, 15);
            }
            if (event.graphic.attributes.StationScale == '3') {
                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/smallstation.png', 15, 15);
            }
        } else {
            if (event.graphic.attributes.State == '规划') {
                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/planning.png', 15, 15);
            } else if (event.graphic.attributes.State == '在建') {
                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/building.png', 15, 15);
            } else if (event.graphic.attributes.State == '已建') {
                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/builded.png', 15, 15);
            }
        }
        event.graphic.setSymbol(symbol);
        map.infoWindow.hide();
    });
    labelPointGraphicLayer = new GraphicsLayer();
    map.addLayer(labelPointGraphicLayer);

    //流域专题图图层
    var Identifier = "Water_Basin";
    var tileMatrixSet = "Custom_Water_Basin";
    var extent = new esri.geometry.Extent(96.81132404600002, 24.470114679000066, 109.27840940900006, 34.52871874900006, new esri.SpatialReference({ wkid: 4326 }));
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_Water/wmts_tianditu";
    var origin = { "x": 96.81132404600002, "y": 34.52871874900006 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    water_arealayer = new ThematicLayer(extent, url, origin);
    map.addLayer(water_arealayer);

    //区划专题图图层
    var Identifier = "Water_Division";
    var tileMatrixSet = "Custom_Water_Division";
    var extent = new esri.geometry.Extent(97.35105544600003, 26.049023511000033, 108.54135189000003, 34.31474036800006, new esri.SpatialReference({ wkid: 4326 }));
    var baseurl = "http://112.74.101.152:8090/iserver/services/map-ZTZT_Water/wmts_tianditu";
    var origin = { "x": 97.35105544600003, "y": 34.31474036800006 }; //x:100.96736581498045     y:32.53580121915098 
    var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
    water_basinlayer = new ThematicLayer(extent, url, origin);
    map.addLayer(water_basinlayer);
    

    water_arealayer.hide();
    water_basinlayer.hide();

    postStationInfo_level(1);
    $('#data_list').datagrid({ loadFilter: pagerFilter });
    postStationInfo();

    $.post("/GIS/BasinOne/GetBasinOne", function (result) {
        var temparr = eval(result);
        //var temparray = [];
        //$.each(temparr, function (index, item) {
        //    temparray.push({ Code: item.Code, Name: item.Name, DevelopByTechNum: item.DevelopByTechNum.toFixed(2), DevelopByEcNum: item.DevelopByEcNum.toFixed(2), Area: item.Area, StationNum: item.StationNum, Version: item.Version, CreateTime: item.CreateTime, Shape: item.Shape, Reserves: item.Reserves.toFixed(2), Runoff: item.Runoff, InstalledCapacityHadBuilt: item.InstalledCapacityHadBuilt, InstalledCapacityInConstruction: item.InstalledCapacityInConstruction, InstalledCapacityToBeDeveloped: item.InstalledCapacityToBeDeveloped, Flow: item.Flow });
        //});
        ArryBasin = FormatJsonDefault(temparr);
        addEchart(ArryBasin);
        
        $('#data_class').datagrid({
            data: ArryBasin
        });

    });

    $.post("/GIS/City/GetCity", function (result) {
        var temparr = eval(result);
        var temparray = FormatJsonDefault(temparr);
        //$.each(temparr, function (index, item) {
        //    var length = item.DevelopByTechNum.toFixed(2);
        //    temparray.push({ Code: item.Code, Name: item.Name, DevelopByTechNum: length, DevelopByEcNum: item.DevelopByEcNum, Area: item.Area, StationNum: item.StationNum, Version: item.Version, CreateTime: item.CreateTime, Shape: item.Shape, Reserves: item.Reserves, Runoff: item.Runoff, InstalledCapacityHadBuilt: item.InstalledCapacityHadBuilt, InstalledCapacityInConstruction: item.InstalledCapacityInConstruction, InstalledCapacityToBeDeveloped: item.InstalledCapacityToBeDeveloped, Flow: item.Flow });
        //});
        ArryCity = temparray;
        $('#data_class_region').datagrid({
            data: ArryCity
           
        });

    });

    $.post("/GIS/ProjectHydropowerStationProject/CountAnnualYieldAmount", { Code: 1 }, function (result) {
        InstalledCapacity_basin = eval(eval(result));
        addEchart1(InstalledCapacity_basin);
    });
    $.post("/GIS/ProjectHydropowerStationProject/CountAnnualYieldAmount", { Code:2 }, function (result) {
        InstalledCapacity_region = eval(eval(result));
    });
    //请求装机容量等级
    post();
    //加载四川省边界
    addSiChuanShengBorder();

 

    //根据地图等级来设置文本图层的显示与隐藏
    dojo.connect(map, 'onZoomEnd', function () {

        var zoomlevel = map.getZoom();
        if (zoomlevel > 9) {
            labelPointGraphicLayer.show();

        } else {
            labelPointGraphicLayer.hide();
        }
    });
});
//分页
function pagerFilter(data) {
    if (typeof data.length == 'number' && typeof data.splice == 'function') {    // 判断数据是否是数组
        data = {
            total: data.length,
            rows: data
        }
    }
    var dg = $(this);
    var opts = dg.datagrid('options');
    var pager = dg.datagrid('getPager');
    pager.pagination({
        onSelectPage: function (pageNum, pageSize) {
            opts.pageNumber = pageNum;
            opts.pageSize = pageSize;
            pager.pagination('refresh', {
                pageNumber: pageNum,
                pageSize: pageSize
            });
            dg.datagrid('loadData', data);
        }
    });
    if (!data.originalRows) {
        data.originalRows = (data.rows);
    }
    var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
    var end = start + parseInt(opts.pageSize);
    data.rows = (data.originalRows.slice(start, end));
    return data;
}
//异步请求所有电站数据，供后面的图例筛选数据，和流域区域筛选数据时使用，避免每次筛选从服务器请求数据，以此提高效率
function postStationInfo(basin,region,level) {    //basin 流域    region    区域   level  装机容量等级
    var a = "", b = "", c = "";
    if (basin != undefined) {
        a = basin;
    }
    if (region != undefined) {
        b = region;
    }
    if (level != undefined) {
        c = level;
        console.log(level);
    }
    $.post("/GIS/ProjectHydropowerStationProject/QueryData", { basinCode: a, regionCode: b, level: c }, function (result) {
        var tempArray = eval(result);
        ArryStation = FormatJsonDefault(tempArray);
    });
}
//初始化页面时请求一级电站的数据，减小数据量
function postStationInfo_level(level) {    //basin 流域    region    区域   level  装机容量等级
    var a = "", b = "", c = "";
 
    if (level != undefined) {
        c = level;
        console.log(level);
    }
    $.post("/GIS/ProjectHydropowerStationProject/query_level", { StationScale: c }, function (result) {
        var tempArray = result;
        ArryStation = FormatJsonDefault(tempArray);
        addpointtomap(ArryStation, 'waterStationLayer','Shape', tabtip, 'State',1);
        ArrayStation = ArryStation;
        $('#data_list').datagrid({
            data: result
        });
    },"json");
}

//添加水电站
//function addStation(res,type) {
//    console.log(res);
//    labelPointGraphicLayer.clear();
//    waterStationLayer.clear();
//    borderLayer.clear();
//    map.infoWindow.hide();
//    if (res.length == 0)return;
//    $.each(res, function (index, item) {
//        var pt = new esri.geometry.Point(parseFloat(item.Longitude), parseFloat(item.Latitude), new esri.SpatialReference({ wkid: 4490 }));
//        var symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/waterstation.png', 15, 15);
//        if(type==1) {
//            if (item.StationScale == '1') {
//                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/bigstation.png', 15, 15);
//            }
//            if (item.StationScale == '2') {
//                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 15, 15);
//            }
//            if (item.StationScale == '3') {
//                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/smallstation.png', 15, 15);
//            }
//        }else if (type == 2) {
//            if (item.State == '规划') {
//                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/planning.png', 15, 15);
//            } else if (item.State == '在建') {
//                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/building.png', 15, 15);
//            } else if (item.State == '已建') {
//                symbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/builded.png', 15, 15);
//            }
//        }
//        var graphicWeb = new esri.Graphic();
//        graphicWeb.geometry = pt;
//        graphicWeb.attributes = item;
//        graphicWeb.setSymbol(symbol);   
//        waterStationLayer.add(graphicWeb);

//        var textSymbol = new esri.symbol.TextSymbol(item.HydropowerStationName, new esri.symbol.Font("20pt", esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD, "YaHei")).setAlign(esri.symbol.TextSymbol.ALIGN_START).setOffset(-25, 10).setColor(new dojo.Color([30, 30, 30, 0.9]));
//        var labelPointGraphic = new esri.Graphic(pt, textSymbol);
//        labelPointGraphicLayer.add(labelPointGraphic);

//    });
//        require(["esri/graphicsUtils"], function(graphicsUtils) {
//            var myExtent = graphicsUtils.graphicsExtent(waterStationLayer.graphics);
//            map.setExtent(myExtent.expand(1.5));
//            /* code goes here */
//        });
//    $('#data_list').datagrid({
//        data: res
//    });
//}

//根据流域筛选水电站数据
function postStationInfo_basin_after(code) {
    if (ArryStation.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(ArryStation, function (index, item) {
            if (code == item.BelongToBasinCode) {
                arrystation.push(item);
            }
    });
    var state = localStorage.getItem("s_state");//判断选择状态
    if (state == '0') {
        selectState(arrystation);
    }else if (state == '1') {
        celectLevel(arrystation);
    }
}
//根据区域筛选水电站数据
function postStationInfo_region_after(code) {
    if (ArryStation.length == 0) {
        alert("正在请求数据，请稍后再试");
        return;
    }
    var arrystation = [];
    $.each(ArryStation, function (index, item) {
        if (code == item.BelongToRegionCode) {
            arrystation.push(item);
        }
    });
    var state = localStorage.getItem("s_state");//判断选择状态
    if (state == '0') {
        selectState(arrystation);
    } else if (state == '1') {
        celectLevel(arrystation);
    }
}

$(function () {
    //点击tab重新加载全部数据
    $('#tab1 .tabs li a').click(function () {
        $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
        var state = localStorage.getItem("s_state");//判断左侧tab选中情况
        if (state == '0') {
            selectState(ArryStation);
        } else if (state == '1') {
            celectLevel(ArryStation);
        }
    });

    localStorage.setItem("s_state", 1);//用于存储左侧tab选择情况
    //左侧tab切换事件
    $("#tab4").tabs({
        onSelect: function (title, index) {
            $(".datagrid-row-selected").css("background","white");//去除表格选中状态
            if (index == 0) {
                if (localStorage.getItem("s_state") == '0') {
                    localStorage.setItem("s_state", 1);
                }
                tabtip = 1;
                celectLevel(ArryStation);//图例选择
            } else if (index == 1) {
                if (localStorage.getItem("s_state") == '1') {
                    localStorage.setItem("s_state", 0);
                }
                tabtip = 0;
                selectState(ArryStation);//状态选择
            }
        }
    });


    //点击流域表格
    $('#data_class').datagrid({
        onClickRow: function (index, row) {
            $.each(ArryBasin, function (index, item) {
                console.log(item.Code);
                    if (item.Name == row.Name) {
                        postStationInfo_basin_after(item.Code);
                        post(item.Code);
                        addBorder(item.Name, ArryBasin);
                    }
                });
        }
    });
    //点击区域表格
    $('#data_class_region').datagrid({
        onClickRow: function (index, row) {
            console.log("你点击了" + row.Name);
                $.each(ArryCity, function (index, item) {
                    if (item.Name == row.Name) {
                        postStationInfo_region_after( item.Code);
                        post(null, item.Code);
                        addBorder(item.Name, ArryCity);
                    }
                });
        }
    });
    //数据表格
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            datagrid_list(waterStationLayer, row, tabtip, 'HydropowerStationName', 'State');

        }
    });
    //点击图表
    $('#tab1').tabs({
        onSelect: function(title, index) {
            console.log(title);
            console.log(index);
            if (index == 0) {
                tabindex = 0;
                addEchart(ArryBasin);
                addEchart1(InstalledCapacity_basin);
                $("#searchinputbox").val("");
            }
            if (index == 1) {
                tabindex = 1;
                addEchart(ArryCity);
                addEchart2(InstalledCapacity_region);
                $("#searchinputbox").val("");
            }
            borderLayer.clear();
            //celectLevel(ArryStation);
        }
    });

    //专题图的加载
    $("#basin_populationGridLayer").click(function () {
        $("#checkbox").hide();
        if ($("#basin_populationGridLayer").prop("checked") == true) {
            $(".ckLegend").show();
            water_arealayer.show();
            $("#basin_scslopeareaLayer").prop("checked", false);
            water_basinlayer.hide();
            $(".legend_xz").hide();
            $(".legend_flow").show();
        } else {
            $(".ckLegend").hide();
            water_arealayer.hide();
            $(".legend_flow").hide();
        }
    });
    //专题图的加载
    $("#basin_scslopeareaLayer").click(function () {
        $("#checkbox").hide();
        if ($("#basin_scslopeareaLayer").prop("checked") == true) {
            $(".ckLegend").show();
            water_basinlayer.show();
            $("#basin_populationGridLayer").prop("checked", false);
            water_arealayer.hide();
            $(".legend_flow").hide();
            $(".legend_xz").show();
        } else {
            $(".ckLegend").hide();
            water_basinlayer.hide();
            $(".legend_xz").hide();
        }
    });
});
function infowindow_content(item) {
    var content =
             "<ul><li><b>电站名称:</b><span>" +  item.attributes.HydropowerStationName
             + "</span></li><li><b>电站类型:</b><span>" + item.attributes.HydropowerStationType
             + "</span></li><li><b>建设状态:</b><span>" + item.attributes.State
             + "</span></li><li><b>装机容量:</b><span>" + item.attributes.InstalledCapacity + " 兆瓦"
             + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
             + "</span></li><li><b>所属流域:</b><span>" + item.attributes.BelongToBasin
             + "</span></li><li><b>编制单位:</b><span>" + item.attributes.ConstructionUnit
             + "</span></li></ul>";
    return content;

}
//模糊查询
function LikeQueryByName(DatasetArray, InputText) {
    var OutputArray = [];
    $.each(DatasetArray, function (index, item) {
        var temp = item.HydropowerStationName.indexOf(InputText);
        if (temp > -1) {
            OutputArray.push(item);
        }
    });
    return OutputArray;
}

//添加电站个数占比tab的柱状图
function addEchart(Arry) {
    var myChart = echarts.init(document.getElementById('mychart1'));
    var arry1=[], arry2 = [];
    $.each(Arry, function(index,item) {
        arry1.push(item.Name);
        arry2.push(item.StationNum);
    });
    
    option = {
        color: ['#4BBC63'],
        title: {
            text: '电站个数统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {

            type: 'category',
            data: arry1,
            axisLabel: {
                //rotate: 40,
                show: true,
                interval: 'auto'
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            name: '单位:个'
        },
        series: [
            {
                name: '电站个数',
                type: 'bar',
                data: arry2
            }
        ]
    };

    myChart.setOption(option);
    myChart.on("click", function (params) {
        if (tabindex == 0) {
            $.each(ArryBasin, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_basin_after(item.Code);
                    post(item.Code);
                    addBorder(item.Name, ArryBasin);
                }
            });
        } else {
            $.each(ArryCity, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_region_after(item.Code);
                    post(null, item.Code);
                    addBorder(item.Name, ArryCity);
                }
            });
        }
    });
}
//装机容量电站个数统计
function addEchart3(Arry) {
    var myChart = echarts.init(document.getElementById('mychart3'));
    var arry1 = ["0-400wkw", "400-800wkw", "800-1200wkw", "1200-1600wkw", "大于1600wkw"], arry2 = Arry;
    option = {
        color: ['#59C9EF'],
        title: {
            text: '装机容量电站个数统计',
            x: 'left',
            top: 0,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: arry1,
            axisLabel: {
                rotate: 20,
                show: true,
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            name: '单位:个'

        },
        series: [
            {
                name: '电站个数',
                type: 'bar',
                data: arry2
            }
        ]
    };

    myChart.setOption(option);
    myChart.on("click", function (params) {
        if (tabindex == 0) {
            $.each(ArryBasin, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_basin_after(item.Code);
                    post(item.Code);
                    addBorder(item.Name, ArryBasin);
                }
            });
        } else {
            $.each(ArryCity, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_region_after(item.Code);
                    post(null, item.Code);
                    addBorder(item.Name, ArryCity);
                }
            });
        }
    });
}
//流域发电量统计
function addEchart1(Arry) {//流域饼图
    var myChart2 = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [],arry3 = [],arry4=[],arry5=[];
    $.each(Arry, function (index, item) {
        arry1.push(item.BelongToBasin);
        arry2.push(item.InstalledCapacity);
        arry3.push(item.AverageAnnualYield);
        arry4.push(item.AnnualYield);
        arry5.push(item.TotalStorageCapacity);
    });
    option = {
        color: ['#9966CC', '#6699FF', '#F7C263', '#FFE443'],
        title: {
            text: '流域年发电量统计',
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
            data: ['年平均发电量', '年发电量', '装机容量','总库容'],
            right: 0,
            top: 15,
            itemGap:2
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: arry1,
                axisLabel: {
                    rotate: 20,
                    show: true,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '发电量:MW·h'
            }, {
                type: 'value',
                name: '装机容量：MW',
                splitLine: {
                    splitLine: false
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        series: [
            {
                name: '年平均发电量',
                type: 'bar',
                data: arry3
            }, {
                name: '年发电量',
                type: 'bar',
                data: arry4
            } ,{
                name: '装机容量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: arry2
                }, {
                    name: '总库容',
                    type: 'bar',
                    data: arry5
            }
        ]
    };

    myChart2.setOption(option);
    myChart2.on("click", function (params) {
        $.each(ArryBasin, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_basin_after(item.Code);
                post(item.Code);
                addBorder(item.Name, ArryBasin);
            }
        });
    });
}
//区域年发电量统计
function addEchart2(Arry) {//区域饼图
    var myChart3 = echarts.init(document.getElementById('mychart2'));
    var arry1 = [], arry2 = [], arry3 = [], arry4 = [], arry5 = [];
    $.each(Arry, function (index, item) {
        arry1.push(item.BelongToRegion);
        arry2.push(item.InstalledCapacity);
        arry3.push(item.AverageAnnualYield);
        arry4.push(item.AnnualYield);
        arry5.push(item.TotalStorageCapacity);
    });
    option = {
        color: ['#9966CC', '#6699FF', '#F7C263', '#FFE443'],
        title: {
            text: '区域年发电量统计',
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
            data: ['年平均发电量', '年发电量', '装机容量', '总库容'],
            right: 0,
            top: 15,
            itemGap:2
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: arry1,
                axisLabel: {
                    rotate: 20,
                    show: true,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '发电量:MW·h'
            }, {
                type: 'value',
                name: '装机容量：MW',
                splitLine: {
                    splitLine: false
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        series: [
            {
                name: '年平均发电量',
                type: 'bar',
                data: arry3
            }, {
                name: '年发电量',
                type: 'bar',
                data: arry4
            }, {
                name: '装机容量',
                type: 'line',
                yAxisIndex: 1,
                data: arry2
            }, {
                name: '总库容',
                type: 'bar',
                data: arry5
            }
        ]
    };
    myChart3.setOption(option);
    myChart3.on("click", function (params) {
        $.each(ArryCity, function (index, item) {
            if (item.Name == params.name) {
                postStationInfo_region_after(item.Code);
                post(null, item.Code);
                addBorder(item.Name, ArryCity);
            }
        });
    });
}
//请求装机容量等级数据,重绘统计图表
function post(basincode,regioncode) {
    var a = "", b = "";
    if (basincode != undefined) {
        a = basincode;
    }
    if (regioncode != undefined) {
        b = regioncode;
    }
    
    $.post("/GIS/ProjectHydropowerStationProject/CountInstalledCapacityNum", { basinCode: a, regionCode: b }, function (result) {
        console.log(result);
        var res = eval(result);
        addEchart3(res);
    });
}

$(function() {
    $(".state_huise").hide();
    $("#legend1").hide();
    $("#legend2").hide();
    $("#legend4").hide();

    //0表示选中，1表示未选
    localStorage.setItem("w_legend1" , 0);
    localStorage.setItem("w_legend2", 1);
    localStorage.setItem("w_legend3", 1);
    localStorage.setItem("w_state4", 0);
    localStorage.setItem("w_state5", 0);
    localStorage.setItem("w_state6", 0);
    $(".legendImg").click(function () {
        var id = $(this)[0].id;
        $(".legendImg").each(function (index, item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (id.indexOf("state")>=0) {
                    if (ex.test(num)) {
                        $("#state" + index).hide();
                        $("#state" + (index + 1)).show();
                        localStorage.setItem("w_state" + (num + 1), 1);
                    } else {
                        $("#state" + index).hide();
                        $("#state" + (index - 1)).show();
                        localStorage.setItem("w_state" + (parseInt(num) + 1), 0);
                    }
                    $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
                    selectState(ArryStation);
                } else {
                    if (ex.test(num)) {
                        $("#legend" + index).hide();
                        $("#legend" + (index + 1)).show();
                        localStorage.setItem("w_legend" + (num + 1), 1);
                    } else {
                        $("#legend" + index).hide();
                        $("#legend" + (index - 1)).show();
                        localStorage.setItem("w_legend" + (parseInt(num) + 1), 0);
                    }
                    $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
                    celectLevel(ArryStation);
                }
            }
        });
    });
});
//图例选择
function celectLevel(ArryStation) {
    var legend1 = localStorage.getItem("w_legend1");
    var legend2 = localStorage.getItem("w_legend2");
    var legend3 = localStorage.getItem("w_legend3");
    var array1 = ['1', '2', '3'];
    var array2 = [legend1, legend2, legend3];
    addpointtomap(SelectByArbitrarily('StationScale', ArryStation, array1, array2), 'waterStationLayer', 'Shape',tabtip, 'State',1);
}
//状态选择
function selectState(ArryStation) {
    var state1 = localStorage.getItem("w_state4");
    var state2 = localStorage.getItem("w_state5");
    var state3 = localStorage.getItem("w_state6");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    addpointtomap(SelectByArbitrarily('State', ArryStation, array1, array2), 'waterStationLayer','Shape', tabtip, 'State',1);
}



