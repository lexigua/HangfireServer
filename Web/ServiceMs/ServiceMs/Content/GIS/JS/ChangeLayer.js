//卫星地图 矢量地图切换:注意，是切换，不要去删除图层，否则其他图层会被新增加的图层隐藏
function showLayer(toShowLayer) {
    if (toShowLayer == "jd") {
        $(".satellitemap").removeClass("mapfirst");
        $(".basemap").addClass("mapfirst");
        roadLayer.show();;
        satLayer.hide();
        lableLayer.hide();
        map.infoWindow.hide();
    } else if (toShowLayer == "wx") {
        $(".basemap").removeClass("mapfirst");
        $(".satellitemap").addClass("mapfirst");
        roadLayer.hide();;
        satLayer.show();
        lableLayer.show();
        map.infoWindow.hide();
    } else if (toShowLayer == "dx") {

    }
}