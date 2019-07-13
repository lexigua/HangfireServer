
$(function () {
    var winW = $("#divMain").width() - 30;
    var mychart1 = $('#mychart1');
    mychart1.css('width', winW + 'px');
    $(".legend_huise").hide();
});

var fieldarray = ['Name', 'Address', 'VoltageLevel', 'MainTransformerCapacity', 'NetLoad', 'Type', 'ProductionTime', 'All'];
var typearray = ['2', '2', '1', '1', '1', '2', '3', '0'];
function dataConditionChange() {
    SelectCondition(fieldarray, typearray);
}
//搜索框
$("#searchbutton").click(function () {
    localStorage.setItem("sub_legend1", 0);
    localStorage.setItem("sub_legend2", 0);
    localStorage.setItem("sub_legend3", 0);
    localStorage.setItem("sub_legend4", 0);
    localStorage.setItem("sub_legend5", 0);
    localStorage.setItem("sub_state6", 0);
    localStorage.setItem("sub_state7", 0);
    localStorage.setItem("sub_state8", 0);
    $("#legend0").show();
    $("#legend1").hide();
    $("#legend2").show();
    $("#legend3").hide();
    $("#legend4").show();
    $("#legend5").hide();
    $("#legend6").show();
    $("#legend7").hide();
    $("#legend8").show();
    $("#legend9").hide();
    $("#state10").show();
    $("#state11").hide();
    $("#state12").show();
    $("#state13").hide();
    $("#state14").show();
    $("#state15").hide();
    var type = 0;
    var values = $("#dataCondition").combobox("getValue");
    if (values == 'All') {
        if (tabtip == 0) {
            selectLegend(SubStationArry);//图例选择
        } else {
            selectState(SubStationArry);//状态选择
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
        var array = ConditionQuery(SubStationArry, condition, minvalue, maxvalue, type);
        if (tabtip == 0) {
            selectLegend(array);//图例选择
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


var tabtip = 2;//初始化图例tab的值
var SubProjectLayer;//变电站图层
var SubStationArry;//表格数据数组
var SubStationRegionArry;//类别数组
var labelPointGraphicLayer;//文本图层
var TempArray = [];//用于临时存储图例筛选数据
var gra;
var borderLayer;
dojo.require("esri.graphic");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.graphics");

require(["esri/map", "esri/dijit/InfoWindow", "extras/TDTRoadLayer", "extras/TDTAnnoLayer", "extras/TDTImageLayer", "esri/layers/GraphicsLayer"], function (Map, InfoWindow, TDTRoadLayer, TDTAnnoLayer, TDTImageLayer, GraphicsLayer) {
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

    labelPointGraphicLayer = new GraphicsLayer();
    map.addLayer(labelPointGraphicLayer);

    borderLayer = new GraphicsLayer();
    map.addLayer(borderLayer);

    SubProjectLayer = new GraphicsLayer();
    map.addLayer(SubProjectLayer);

    //鼠标移动事件，将graphic的样式换为另外一个
    SubProjectLayer.on('mouse-move', function (event) {
        //console.log('你经过了一个graphic');
        event.graphic.setSymbol(new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station_hover.png', 20, 20));
        map.infoWindow.setContent(infowindow_content(event.graphic));
        map.infoWindow.setTitle("详情");
        map.infoWindow.show(event.mapPoint);
    });
    //鼠标离开事件，将graphic的symbol还原
    SubProjectLayer.on('mouse-out', function (event) {
        //console.log('你离开了一个graphic');
        var pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 15, 15);
        if (tabtip == 2) {
            if (event.graphic.attributes.Type == '特高压变电站') {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/fifthstation.png', 15, 15);
        } else if (event.graphic.attributes.Type == '500kV变电站') {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/fourthstation.png', 15, 15);
        } else if (event.graphic.attributes.Type == '220kV变电站') {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/thirdstation.png', 15, 15);
        } else if (event.graphic.attributes.Type == '110kV变电站') {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/secondstation.png', 15, 15);
        } else if (event.graphic.attributes.Type == '35kV变电站') {
            pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/firststation.png', 15, 15);
        }
        } else {
            if (event.graphic.attributes.State == '规划') {
                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/planning.png', 15, 15);
            } else if (event.graphic.attributes.State == '在建') {
                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/building.png', 15, 15);
            } else if (event.graphic.attributes.State == '已建') {
                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/builded.png', 15, 15);
            }
        }
       
        event.graphic.setSymbol(pointSymbol);
        map.infoWindow.hide();
    });


    //设置地图的中心点和缩放层级
    //map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4326 } }), 5);
    var pt = new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } });
    pt = esri.geometry.geographicToWebMercator(pt);
    map.centerAndZoom(pt, 5);

    
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
    postSubStation();
    postSubStationRegion();
});
    //加载数据表格
    function postSubStation() {
        $.post("/GIS/ProjectSubstation/GetBasinOne", function (result) {
            var tempArray = eval(result);
            SubStationArry = FormatJsonDefault(tempArray);
            TempArray = SubStationArry;
            addpointtomap(SubStationArry, SubProjectLayer, 'Shape', tabtip, 'State',0);
            $('#data_list').datagrid({
                data: SubStationArry
            });
        });
    }

    //加载区域数据
    function postSubStationRegion() {
        $.post("/GIS/ProjectSubstation/CountByType", function (result) {
            SubStationRegionArry = FormatJsonDefault(eval(result));
            $('#data_class').datagrid({
                data: SubStationRegionArry
            });
            addEchart1(SubStationRegionArry);
            //addEchart2(SubStationRegionArry);
            //addEchart3(SubStationRegionArry);
        });

    }
    //加载变电站点位,type标识符号系统
    //function addSubStation(res,type) {
    //    SubProjectLayer.clear();
    //    map.infoWindow.hide();
    //    console.log("length:" + res.length);
    //    $('#data_list').datagrid({
    //        data: res
    //    });
    //    if (res.length == 0) return;
    //    $.each(res, function (index, obj) {
    //        var wkt = new Wkt.Wkt();
    //        wkt.read(obj.Shape);
    //        var config = {
    //            spatialReference: {
    //                wkid: 4490
    //            },
    //            editable: false
    //        };
    //        var polygon = wkt.toObject(config);
    //        //polygon = esri.geometry.geographicToWebMercator(polygon);
    //        var graphicWeb = new esri.Graphic();
    //        graphicWeb.geometry = polygon;
    //        graphicWeb.attributes = obj;
    //        var pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 15, 15);
    //        if (type == 1) {
    //            if (obj.Type == '特高压变电站') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/fifthstation.png', 15, 15);
    //            } else if (obj.Type == '500kV变电站') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/fourthstation.png', 15, 15);
    //            } else if (obj.Type == '220kV变电站') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/thirdstation.png', 15, 15);
    //            } else if (obj.Type == '110kV变电站') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/secondstation.png', 15, 15);
    //            } else if (obj.Type == '35kV变电站') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/firststation.png', 15, 15);
    //            }
    //        } else if(type==2){
    //            if (obj.State == '规划') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/planning.png', 15, 15);
    //            }else if (obj.State == '在建') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/building.png', 15, 15);
    //            }else if(obj.State=='已建') {
    //                pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/builded.png', 15, 15);
    //            }
    //        }
    //        graphicWeb.setSymbol(pointSymbol);
    //        SubProjectLayer.add(graphicWeb);
    //        var textSymbol = new esri.symbol.TextSymbol(obj.Name,new esri.symbol.Font("20pt", esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD, "YaHei")).setAlign(esri.symbol.TextSymbol.ALIGN_START).setOffset(-15, 10).setColor(new dojo.Color([30, 30, 30, 0.9]));
    //        var labelPointGraphic = new esri.Graphic(polygon, textSymbol);
    //        labelPointGraphicLayer.add(labelPointGraphic);
    //    });

    //    require(["esri/graphicsUtils"], function (graphicsUtils) {
    //        var myExtent = graphicsUtils.graphicsExtent(SubProjectLayer.graphics);
    //        map.setExtent(myExtent.expand(1.5));
    //    });
        

    //}

    function addEchart1(Arry) { 
        var myChart1 = echarts.init(document.getElementById('mychart1'));
        var arry1 = [], arry2 = [], arry3 = [];
        $.each(Arry, function (index, item) {
            arry1.push(item.VoltageLevel);
            arry2.push(item.MainTransformerCapacity);
            arry3.push(item.Num);
        });
        console.log(arry2);
        console.log(arry1);
        option = {
            color: ['#4BBC63', '#59C9EF'],
            title: {
                text: '区域装机容量统计',
                x: 'center',
                top: 0,
                textStyle: {
                    fontSize: 16
                },
            },
                tooltip: {
                    //trigger: 'axis'
                },
                legend: {
                    x: 'right',
                    y: 'top',
                    top: 15,
                    itemGap: 2,
                    data: ['装机容量', '电站个数']
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
                    }, {
                        type: 'value',
                        name: '电站个数：个',
                        splitLine: {
                            splitLine: false
                        }
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
                    }, {
                        name: '电站个数',
                        type: 'line',
                        yAxisIndex: 1,
                        data: arry3
                    }
                ]
        }
        myChart1.setOption(option);
        myChart1.on("click", function(params) {
            $.each(SubStationRegionArry, function (index, item) {
                if (item.VoltageLevel == params.name) {
                    postStationInfo_wind_after(item.VoltageLevel, tabtip);
                }
            });
        });
    }

      
    
    $(function () {
        //左侧tab切换事件
        $("#tab4").tabs({
            onSelect: function (title, index) {
                $(".datagrid-row-selected").css("background", "white");//去除表格选中状态
                if (index == 0) {
                    tabtip = 2;
                    selectLegend(SubStationArry);//图例选择
                } else if (index == 1) {
                    tabtip = 0;
                    selectState(SubStationArry);//状态选择
                }
            }
        });

        $(".legend_huise").hide();
        $(".state_huise").hide();

        //0表示选中，1表示未选
        localStorage.setItem("sub_legend1", 0);
        localStorage.setItem("sub_legend2", 0);
        localStorage.setItem("sub_legend3", 0);
        localStorage.setItem("sub_legend4", 0);
        localStorage.setItem("sub_legend5", 0);
        //0表示选中，1表示未选
        localStorage.setItem("sub_state6", 0);
        localStorage.setItem("sub_state7", 0);
        localStorage.setItem("sub_state8", 0);
        $(".legendImg").click(function () {
            var id = $(this)[0].id;
            $(".legendImg").each(function (index, item) {
                var piot = item.id.indexOf("state");
                if (piot < 0) {
                    if (id == item.id) {
                        var num = index / 2;
                        var ex = /^\d+$/;
                        if (ex.test(num)) {
                            $("#legend" + index).hide();
                            $("#legend" + (index + 1)).show();
                            localStorage.setItem("sub_legend" + (num + 1), 1);
                        } else {
                            $("#legend" + index).hide();
                            $("#legend" + (index - 1)).show();
                            localStorage.setItem("sub_legend" + (parseInt(num) + 1), 0);
                        }
                        $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
                        selectLegend(SubStationArry);
                    }
                }
                else {
                    if (id == item.id) {
                        var num = index / 2;
                        var ex = /^\d+$/;
                        if (ex.test(num)) {
                            $("#state" + index).hide();
                            $("#state" + (index + 1)).show();
                            localStorage.setItem("sub_state" + (num + 1), 1);
                        } else {
                            $("#state" + index).hide();
                            $("#state" + (index - 1)).show();
                            localStorage.setItem("sub_state" + (parseInt(num) + 1), 0);
                        }
                        $(".datagrid-row-selected").css("background", "white"); //去除表格选中状态
                        selectState(SubStationArry);
                    }
                }
            
            });
        });
        //点击tab重新加载全部数据
        $('#tab1 .tabs li a').click(function () {
            if (tabtip == 2) {
                selectLegend(SubStationArry);
            } else {
                selectState(SubStationArry);
            }
        });
        $('#data_list').datagrid({ loadFilter: pagerFilter });
        //数据表格
        $('#data_list').datagrid({
            onClickRow: function (index, row) {
                console.log(row);
                datagrid_list(SubProjectLayer, row, tabtip, 'Name', 'State');              
            }
        });
        //根据类别筛选
        $('#data_class').datagrid({
            onClickRow: function (index, row) {
                console.log(row);
                $.each(SubStationRegionArry, function (index, item) {
                    if (item.VoltageLevel == row.VoltageLevel) {
                        console.log(item.VoltageLevel);
                        postStationInfo_wind_after(item.VoltageLevel, tabtip);
                    }
                });
            }
        });
        //根据风区筛选
        $('#data_class_region').datagrid({
            onClickRow: function (index, row) {
                console.log(windStationArry);
                console.log("你点击了" + row.Address);
                $.each(windStationRegionArry, function (index, item) {
                    if (item.Address == row.Address) {
                        postStationInfo_region_after(item.Address);
                        addBorder(item.Address, 2);
                    }
                });
            }
        });
        $('#tab1').tabs({
            onSelect: function (title, index) {
                console.log(title);
                console.log(index);
                if (index == 0) {
                    addEchart1(SubStationRegionArry);
                    $("#searchinputbox").val("");
                }
                if (index == 1) {
                    addEchart1('');
                    $("#searchinputbox").val("");
                }
                //addSubStation(SubStationArry);
            }
        });

    });
   
//列举可能出现的选择情况
    function selectState(AtationArray) {
        var state1 = localStorage.getItem("sub_state6");
        var state2 = localStorage.getItem("sub_state7");
        var state3 = localStorage.getItem("sub_state8");
        var array1 = ['规划', '在建', '已建'];
        var array2 = [state1, state2, state3];
        addpointtomap(SelectByArbitrarily('State', AtationArray, array1, array2), SubProjectLayer,'Shape',tabtip,'State',0);
    }

    function selectLegend(temparray) {
        var legend1 = localStorage.getItem("sub_legend1");
        var legend2 = localStorage.getItem("sub_legend2");
        var legend3 = localStorage.getItem("sub_legend3");
        var legend4 = localStorage.getItem("sub_legend4");
        var legend5 = localStorage.getItem("sub_legend5");
        var array1 = [ '特高压变电站','500kV变电站','220kV变电站', '110kV变电站','35kV变电站'];
        var array2 = [legend1, legend2, legend3, legend4, legend5];
        addpointtomap(SelectByArbitrarily('Type', temparray, array1, array2), SubProjectLayer,'Shape',tabtip,'State',0);
    }

    //定义infowindow内容
    function infowindow_content(item) {
        var content = "<ul><li><b>电站名称:</b><span>" +item.attributes.Name
                    + "</span></li><li><b>项目所在:</b><span>" +item.attributes.Address
                    + "</span></li><li><b>电压等级:</b><span>" +item.attributes.VoltageLevel + ' 千伏'
                    + "</span></li><li><b>主变容量:</b><span>" + item.attributes.MainTransformerCapacity + ' 千瓦'
                    + "</span></li><li><b>下网负载:</b><span>" + item.attributes.NetLoad + ' 千瓦'
                    + "</span></li><li><b>类别:</b><span>" +item.attributes.Type
                    + "</span></li><li><b>投产时间:</b><span>" + item.attributes.ProductionTime.substring(0, 10)
                    + "</span></li></ul>";
        return content;
    }

    //根据区域筛选水电站数据
    function postStationInfo_wind_after(code, tabtip) {
        if (SubStationArry.length == 0) {
            alert("正在请求数据，请稍后再试");
            return;
        }
        var arrystation = [];
        $.each(SubStationArry, function (index, item) {
            if (code == item.VoltageLevel) {
                arrystation.push(item);
            }
        });
        console.log(arrystation);
        if (tabtip == 2) {
            selectLegend(arrystation);
        } else {
            selectState(arrystation);
        }
    }

    //根据风区筛选水电站数据
    function postStationInfo_region_after(code) {
        if (windStationRegionArry.length == 0) {
            alert("正在请求数据，请稍后再试");
            return;
        }
        var arrystation = [];
        $.each(windStationRegionArry, function (index, item) {
            if (code == item.Address) {
                arrystation.push(item);
            }
        });
        addpointtomap(arrystation, SubProjectLayer, 'Shape', tabtip, 'State',0);
    }


