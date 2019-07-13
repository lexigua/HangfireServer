var fieldarray = ['Name', 'Address', 'amount', 'Installed', 'SingleCapacity', 'Investor', 'AnnualYield', 'ConstructionUnit', 'ProductionTime', 'All'];
var typearray = ['2', '2', '2', '1', '1', '2', '1', '2', '3', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("win_state1", 0);
    localStorage.setItem("win_state2", 0);
    localStorage.setItem("win_state3", 0);
    $("#state0").show();
    $("#state1").hide();
    $("#state2").show();
    $("#state3").hide();
    $("#state4").show();
    $("#state5").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        addpointtomap(windStationArry, 'windProjectLayer', 'Shape', 0, 'State', 0);
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
        var array = ConditionQuery(windStationArry, condition, minvalue, maxvalue, type);
        addpointtomap(array, 'windProjectLayer', 'Shape', 0, 'State', 0);
    }
});


var labelPointGraphicLayer;//文本图层
var windProjectLayer;//风电场图层
var windStationArry;//区域数组
var windStationRegionArry;//风区数组
var borderLayer;//边界图层
var ArryCity;//城市数据
var wmtsLayer_risk;
var gra;//用于存储表格点击时获取到的一个graphic
var windpower_layer;//风功率
var windspeed_layer;//风速
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");
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

        //加载边界
        borderLayer = new GraphicsLayer();
        map.addLayer(borderLayer);

        windProjectLayer = new GraphicsLayer();
        map.addLayer(windProjectLayer);

          //鼠标移动事件，将graphic的样式换为另外一个
        windProjectLayer.on('mouse-move', function (event) {
            //console.log('你经过了一个graphic');
            ipos = event.graphic.attributes.ProductionTime.indexOf("T");
            event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 20,20));
            map.infoWindow.setContent(infowindow_content(event.graphic));
            map.infoWindow.setTitle("详情");
            map.infoWindow.show(event.mapPoint);
        });
    //鼠标离开事件，将graphic的symbol还原
        windProjectLayer.on('mouse-out', function (event) {
            var symbol;
            if (event.graphic.attributes.State == '规划') {
                symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/planning.png", 15, 15);
            } else if (event.graphic.attributes.State == '在建') {
                symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/building.png", 15, 15);
            } else if (event.graphic.attributes.State == '已建') {
                symbol = new esri.symbol.PictureMarkerSymbol("/Css/images/GIS/builded.png", 15, 15);
            }
            event.graphic.setSymbol(symbol);
            map.infoWindow.hide();
        });


        labelPointGraphicLayer = new GraphicsLayer();
        map.addLayer(labelPointGraphicLayer);
        //设置地图的中心点和缩放层级
        //map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } }), 5);
        var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
        pt = esri.geometry.geographicToWebMercator(pt);
        map.centerAndZoom(pt, 5);

        //风速图层
        var Identifier = "四川省风速分布";
        var tileMatrixSet = "Custom_四川省风速分布";
        var extent = new esri.geometry.Extent(96.55788242507582, 25.772947683720858, 108.92485867198486, 34.55894793743847, new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = "http://112.74.101.152:8090/iserver/services/map-FZY---FuBen/wmts_tianditu";
        var origin = { "x": 96.55788242507582, "y": 34.55894793743847 }; //x:100.96736581498045     y:32.53580121915098 
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        windspeed_layer = new ThematicLayer(extent, url, origin);
        map.addLayer(windspeed_layer);
       //风功率图层
        var Identifier = "四川省风能密度分布";
        var tileMatrixSet = "Custom_四川省风能密度分布";
        var extent = new esri.geometry.Extent(97.34166666665574, 26.040833329996037, 108.5499999999846, 34.315833329992714, new esri.SpatialReference({ wkid: 4326 }));
        var baseurl = "http://112.74.101.152:8090/iserver/services/map-FZY---FuBen/wmts_tianditu";
        var origin = { "x": 97.34166666665574, "y": 34.315833329992714 }; //x:100.96736581498045     y:32.53580121915098 
        var url = baseurl + "?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=" + Identifier + "&STYLE=default&FORMAT=image/png&TILEMATRIXSET=" + tileMatrixSet;
        windpower_layer = new ThematicLayer(extent, url, origin);
        map.addLayer(windpower_layer);
        windspeed_layer.hide();
        windpower_layer.hide();
        
    //根据地图等级来设置文本图层的显示与隐藏
        dojo.connect(map, 'onZoomEnd', function () {

            var zoomlevel = map.getZoom();
            if (zoomlevel > 9) {
                labelPointGraphicLayer.show();
                
            } else {
                labelPointGraphicLayer.hide();
            }
        });
        //加载四川省边界
        addSiChuanShengBorder();
        postWindStationRegion();
        postCityBorder();

        //postCityBorder();
    }
);
//加载列表数据
    function postWindStation() {
        $.post("/GIS/ProjectWindStation/GetBasinOne", function (result) {
            var tempArray = eval(result);
            windStationArry = FormatJsonDefault(tempArray);
            addpointtomap(windStationArry, 'windProjectLayer', 'Shape',0,'State',0);
            $('#data_list').datagrid({
                data: windStationArry
            });
        });
    }

//加载区域数据
    function postWindStationRegion() {
        $.post("/GIS/ProjectWindStation/GetWindRegion", function (result) { 
            windStationRegionArry = FormatJsonDefault(eval(result));
            $('#data_class').datagrid({
                data: windStationRegionArry
            });
            //由于异步加载的问题影响表格的列表名对不齐，所以讲数据加载放在另一个数据加载完成后执行
            postWindStation();
            addEchart1(windStationRegionArry);
            addEchart2(windStationRegionArry);
            addEchart3(windStationRegionArry);
        });

    }

//加载区域城市数据
    function postCityBorder() {
        $.post("/GIS/City/GetCity", function(result) {
            ArryCity = FormatJsonDefault(eval(result));
        });
    }


    function addEchart1(Arry) { //
        var myChart1 = echarts.init(document.getElementById('mychart1'));
        var arry1 = [], arry2 = [], arry3 = [];
        $.each(Arry, function(index, item) {
            arry1.push(item.Address);
            arry2.push(item.Installed);
        });
        console.log(arry2);
        console.log(arry1);
        option = {
            color: ['#4BBC63'],
            title: {
                text: '区域装机容量统计',
                x: 'left',
                top: 0,
                textStyle: {
                    fontSize: 16
                }
            },
            tooltip: {
                //trigger: 'axis'
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
                    name: '装机容量：MW'
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [
                {
                    name: '装机容量',
                    type: 'bar',
                    data: arry2
                   
                }
            ]
        };

        myChart1.setOption(option);
        myChart1.on("click", function (params) {
            $.each(ArryCity, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_wind_after(item.Name);
                    addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
                }
            });
        });
    }

    function addEchart2(Arry) { //
        var myChart1 = echarts.init(document.getElementById('mychart2'));
        var arry1 = [], arry2 = [];
        $.each(Arry, function(index, item) {
            arry1.push(item.Address);
            arry2.push(item.AnnualYield);
        });
        console.log(arry2);
        console.log(arry1);
        option = {
            color: ['#59C9EF'],
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
                    name: '年发电量：KW·h'
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [
                {
                    name: '年发电量',
                    type: 'bar',
                    data: arry2
                }
            ]
        };

        myChart1.setOption(option);
        myChart1.on("click", function (params) {
            $.each(ArryCity, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_wind_after(item.Name);
                    addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
                }
            });
        });
    }

    function addEchart3(Arry) { //
        var myChart1 = echarts.init(document.getElementById('mychart3'));
        var arry1 = [], arry2 = [], arry3 = [];
        $.each(Arry, function(index, item) {
            arry1.push(item.Address);
            arry2.push(item.Number);
        });
        option = {
            color: ['#FF855F'],
            title: {
                text: '区域风电站个数统计',
                x: 'left',
                top: 0,
                textStyle: {
                    fontSize: 16
                }
            },
            tooltip: {
                //trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
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
                    name: '电站个数：个'
                }
            ],
            series: [
                {
                    name: '电站个数',
                    type: 'bar',
                    data: arry2
                }
            ]
        };

        myChart1.setOption(option);
        myChart1.on("click", function(params) {
            $.each(ArryCity, function (index, item) {
                if (item.Name == params.name) {
                    postStationInfo_wind_after(item.Name);
                    addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
                }
            });
        });
    }
   
    $(function () {
        document.onkeydown = function (e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                $('#searchbutton').click();
            }
        }
        var tabtip = 0;//判断左侧tab选中情况
        //数据表格分页
        $('#data_list').datagrid({ loadFilter: pagerFilter });
        //点击tab重新加载全部数据
        $('#tab1 .tabs li a').click(function () {
            $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
            if (tabtip == 0) {
                State_Situation(windStationArry);
            } else if (tabtip == 1) {
                State_Situation(windStationArry);
            }
        });
        //数据表格
        $('#data_list').datagrid({
            onClickRow: function (index, row) {
                datagrid_list(windProjectLayer, row, tabtip,'Name','State');
            }
        });

        //根据区域筛选
        $('#data_class').datagrid({
            onClickRow: function(index, row) {
                $.each(ArryCity, function(index, item) {
                    if (item.Name == row.Address) {
                        postStationInfo_wind_after(item.Name);
                        addBorder(item.Name, ArryCity); //添加边界之后，面图层在上，点图层在下
                    }
                });
            }
        });
        //根据风区筛选
        $('#data_class_region').datagrid({
            onClickRow: function(index, row) {
                console.log(windStationArry);
                console.log("你点击了" + row.Address);
                $.each(windStationRegionArry, function(index, item) {
                    if (item.Address == row.Address) {
                        postStationInfo_region_after(item.Address);
                        addBorder(item.Address, windStationRegionArry);
                    }
                });
            }
        });
        //根据点击TAB联动下方表格
        $('#tab1').tabs({
            onSelect: function (title, index) {
                if (index == 0) {
                    addEchart1(windStationRegionArry);
                    addEchart2(windStationRegionArry);
                    addEchart3(windStationRegionArry);
                    //windProjectLayer.show();
                    $("#searchinputbox").val("");
                }
                if (index == 1) {
                    addEchart1('');
                    addEchart2('');
                    addEchart3('');
                    //windProjectLayer.hide();
                    $("#searchinputbox").val("");
                }
                borderLayer.clear();
                //addWindStation(windStationArry);
                $('#checkbox').hide();
            }
        });
        //根据复选框选择控制专题图的显示与隐藏
        $("#wind_density").click(function () {
            $("#checkbox").hide();
            if ($("#wind_density").prop("checked") == true) {
                windspeed_layer.show();
                $("#wind_speed").prop("checked", false);
                windpower_layer.hide();
                $(".ckLegend").show();
                $(".legend_xz").show();
                $(".legend_p").hide();
            } else {
                windspeed_layer.hide();
                $(".legend_xz").hide();
                $(".ckLegend").hide();
            }
        });
        $("#wind_speed").click(function () {
            $("#checkbox").hide();
            if ($("#wind_speed").prop("checked") == true) {
                windpower_layer.show();
                $("#wind_density").prop("checked", false);
                windspeed_layer.hide();
                $(".ckLegend").show();
                $(".legend_p").show();
                $(".legend_xz").hide();
            } else {
                windpower_layer.hide();
                $(".legend_p").hide();
                $(".ckLegend").show();
            }
        });
        $(".state_huise").hide();
        //0表示选中，1表示未选
        localStorage.setItem("win_state1", 0);
        localStorage.setItem("win_state2", 0);
        localStorage.setItem("win_state3", 0);

        $(".legendImg").click(function () {
            var id = $(this)[0].id;
            $(".legendImg").each(function (index, item) {
                if (id == item.id) {
                    var num = index / 2;
                    var ex = /^\d+$/;
                    if (ex.test(num)) {
                        $("#state" + index).hide();
                        $("#state" + (index + 1)).show();
                        localStorage.setItem("win_state" + (num + 1), 1);
                    } else {
                        $("#state" + index).hide();
                        $("#state" + (index - 1)).show();
                        localStorage.setItem("win_state" + (parseInt(num) + 1), 0);
                    }
                    $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
                    State_Situation(windStationArry);
                }
            });
        });

        var winW = $("#divMain").width() - 10;
        var mychart1 = $('#mychart1');
        var mychart2 = $('#mychart2');
        var mychart3 = $('#mychart3');
        mychart1.css('width', winW / 3 + 'px');
        mychart2.css('width', winW / 3 + 'px');
        mychart3.css('width', winW / 3 + 'px');
        $(".legend_xz").hide();
        $(".legend_p").hide();
    });
//定义infowindow的内容
function infowindow_content(item) {
    var content = "<ul><li><b>风电站名称:</b><span>" + item.attributes.Name
                        + "</span></li><li><b>所属区域:</b><span>" + item.attributes.Address
                        + "</span></li><li><b>风机台数:</b><span>" + item.attributes.Amount + " 台"
                        + "</span></li><li><b>装机容量:</b><span>" +item.attributes.Installed + " 兆瓦"
                        + "</span></li><li><b>单机容量:</b><span>" + item.attributes.SingleCapacity + " 兆瓦"
                        + "</span></li><li><b>投资者:</b><span>" + item.attributes.Investor
                        + "</span></li><li><b>年发电量:</b><span>" + item.attributes.AnnualYield + " 兆瓦·时"
                        + "</span></li><li><b>开发建设单位:</b><span>" + item.attributes.ConstructionUnit
                        + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0,10)
                        + "</span></li></ul>";
    return content;
}

//根据区域筛选水电站数据
    function postStationInfo_wind_after(code) {
        if (windStationArry.length == 0) {
            alert("正在请求数据，请稍后再试");
            return;
        }
        var arrystation = [];
        $.each(windStationArry, function(index, item) {
            if (code == item.Address) {
                arrystation.push(item);
            }
        });
        State_Situation(arrystation);
    }

//根据风区筛选水电站数据
    function postStationInfo_region_after(code) {
        if (windStationRegionArry.length == 0) {
            alert("正在请求数据，请稍后再试");
            return;
        }
        var arrystation = [];
        $.each(windStationRegionArry, function(index, item) {
            if (code == item.Address) {
                arrystation.push(item);
            }
        });
        State_Situation(arrystation);
    }

//请求装机容量等级数据，并重绘图表
    function post(basincode, regioncode) {
        var a = "", b = "";
        if (basincode != undefined) {
            a = basincode;
        }
        if (regioncode != undefined) {
            b = regioncode;
        }

        $.post("/GIS/ProjectHydropowerStationProject/CountInstalledCapacityNum", { basinCode: a, regionCode: b }, function(result) {
            console.log(result);
            var res = eval(result);
            addEchart3(res);
        });
    }

//分析状态可能出现的组合情况
function State_Situation(StationArray) {
    var state1 = localStorage.getItem("win_state1");
    var state2 = localStorage.getItem("win_state2");
    var state3 = localStorage.getItem("win_state3");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    addpointtomap(SelectByArbitrarily('State', StationArray, array1, array2), 'windProjectLayer', 'Shape',0,'State',0);
}
