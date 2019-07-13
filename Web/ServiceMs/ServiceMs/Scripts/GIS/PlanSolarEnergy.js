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
    map.centerAndZoom(pt, 5);

});

$(function () {
    $(".ckLegend").show();
    $(".state_huise").hide();

    localStorage.setItem("ps_state1", 0);
    localStorage.setItem("ps_state2", 0);
    localStorage.setItem("ps_state3", 0);

    $(".legendImg").click(function() {
        var id = $(this)[0].id;
        $(".legendImg").each(function(index,item) {
            if (id == item.id) {
                var num = index / 2;
                var ex = /^\d+$/;
                if (ex.test(num)) {
                    $("#state"+index).hide();
                    $("#state"+(index+1)).show();
                    localStorage.setItem("ps_state" + (num + 1), 1);
                } else {
                    $("#state"+index).hide();
                    $("#state"+(index-1)).show();
                    localStorage.setItem("ps_state" + (parseInt(num) + 1), 0);
                }
            }
        });
    });

});
//根据状态图标点击来组合各种显示结果
function selectState(sunProjectArry) {
    var state1 = localStorage.getItem("ps_state1");
    var state2 = localStorage.getItem("ps_state2");
    var state3 = localStorage.getItem("ps_state3");
    var array1 = ['规划', '在建', '已建'];
    var array2 = [state1, state2, state3];
    //加载图标到地图上
    addpointtomap(SelectByArbitrarily('State', sunProjectArry, array1, array2), 'sunProjectLayer', 'Shape');
}