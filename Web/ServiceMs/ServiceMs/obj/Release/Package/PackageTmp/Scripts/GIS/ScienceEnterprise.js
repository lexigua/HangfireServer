var SceienEnterLayer;//标记图层
var SceienEnterpriseinfo;//能源公司信息
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

    SceienEnterLayer = new GraphicsLayer();
    map.addLayer(SceienEnterLayer);
    map.on('mouse-move', function (event) {
        if (event.graphic != undefined) {
            console.log(event.graphic);
            gtype = event.graphic.geometry.type;//当前要素类型
            console.log(gtype);
            if (gtype == "point") {
                var content =
            "<ul><li><b>企业名称:</b><span>" + ((event.graphic.attributes.EnterpriseName == null || event.graphic.attributes.EnterpriseName == "") ? "暂无" : event.graphic.attributes.EnterpriseName)
            + "</span></li><li><b>所属行业:</b><span>" + ((event.graphic.attributes.IndustryInvolved == null || event.graphic.attributes.IndustryInvolved == "") ? "暂无" : event.graphic.attributes.IndustryInvolved)
            + "</span></li><li><b>主导产品:</b><span>" + ((event.graphic.attributes.LeadingProduct == null || event.graphic.attributes.LeadingProduct == "") ? "暂无" : event.graphic.attributes.LeadingProduct)
            + "</span></li><li><b>生产能力:</b><span>" + ((event.graphic.attributes.ProductionCapacity == null || event.graphic.attributes.ProductionCapacity == "") ? "暂无" : (event.graphic.attributes.ProductionCapacity + " 万千瓦"))
            + "</span></li><li><b>技术水平:</b><span>" + ((event.graphic.attributes.TechnologicalLevel == null || event.graphic.attributes.TechnologicalLevel == "") ? "暂无" : (event.graphic.attributes.TechnologicalLevel + " 台"))
            + "</span></li><li><b>去年产量:</b><span>" + ((event.graphic.attributes.LastYearTotalOutput == null || event.graphic.attributes.LastYearTotalOutput == "") ? "暂无" : event.graphic.attributes.LastYearTotalOutput)
            + "</span></li></ul>";
                map.infoWindow.setContent(content);
                map.infoWindow.setTitle("详情");
                map.infoWindow.show(event.mapPoint);
            }
        } else {
            map.infoWindow.hide();
        }

    });
    //设置地图的中心点和缩放层级
    map.centerAndZoom(new esri.geometry.Point({ "x": 104.0706, "y": 30.164789, "spatialReference": { "wkid": 4490 } }), 7);
    loaddata();
});

function loaddata() {
    $.post("/GIS/ScienceEnterprise/Query", function(result) {
        $("#data_list").datagrid({
            data: result.rows
        });
        AddSceienEnterprise(result.rows);
        SceienEnterpriseinfo = result.rows;
        console.log(SceienEnterpriseinfo);

    },"json");
}

function AddSceienEnterprise(data)
{
    SceienEnterLayer.clear();
    map.infoWindow.hide();
    $.each(data, function (index, obj) {
        var pt = new esri.geometry.Point(parseFloat(obj.PositionX), parseFloat(obj.PositionY), new esri.SpatialReference({ wkid: 4490 }));
        var graphicWeb = new esri.Graphic();
        graphicWeb.geometry = pt;
        graphicWeb.attributes = obj;
        var pointSymbol = new esri.symbol.PictureMarkerSymbol('/Css/images/GIS/station.png', 25, 25);
        graphicWeb.setSymbol(pointSymbol);
        SceienEnterLayer.add(graphicWeb);
    });

    require(["esri/graphicsUtils"], function (graphicsUtils) {
        var myExtent = graphicsUtils.graphicsExtent(SceienEnterLayer.graphics);
        map.setExtent(myExtent.expand(1.5));
    });

}

$(function () {
    $('#data_list').datagrid({
        onClickRow: function (index, row) {
            console.log("你点击了" + row.Name);
            $.each(SceienEnterpriseinfo, function (index, item) {
                if (item.EnterpriseName == row.EnterpriseName) {
                    var content =
         "<ul><li><b>企业名称:</b><span>" + ((item.EnterpriseName == null ||item.EnterpriseName == "") ? "暂无" :item.EnterpriseName)
         + "</span></li><li><b>所属行业:</b><span>" + ((item.IndustryInvolved == null ||item.IndustryInvolved == "") ? "暂无" :item.IndustryInvolved)
         + "</span></li><li><b>主导产品:</b><span>" + ((item.LeadingProduct == null || item.LeadingProduct == "") ? "暂无" : item.LeadingProduct)
         + "</span></li><li><b>生产能力:</b><span>" + ((item.ProductionCapacity == null || item.ProductionCapacity == "") ? "暂无" : (item.ProductionCapacity + " 万千瓦"))
         + "</span></li><li><b>技术水平:</b><span>" + ((item.TechnologicalLevel == null || item.TechnologicalLevel == "") ? "暂无" : (item.TechnologicalLevel + " 台"))
         + "</span></li><li><b>去年产量:</b><span>" + ((item.LastYearTotalOutput == null || item.LastYearTotalOutput == "") ? "暂无" : item.LastYearTotalOutput)
         + "</span></li></ul>";
                    map.infoWindow.setContent(content);
                    map.infoWindow.setTitle("详情");
                    var pt = new esri.geometry.Point(parseFloat(item.PositionX), parseFloat(item.PositionY), new esri.SpatialReference({ wkid: 4490 }));
                    map.infoWindow.show(pt);
                    map.centerAndZoom(pt, 10);
                    return;
                }
            });
        }
    });
});
