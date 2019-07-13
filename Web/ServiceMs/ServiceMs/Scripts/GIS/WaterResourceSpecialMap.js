

var map;
var roadLayer;

require([
        "esri/map", "esri/layers/WMTSLayer", "esri/layers/WMTSLayerInfo", "esri/geometry/Extent", "esri/layers/TileInfo", "esri/SpatialReference",  "dojo/domReady!"
],
    function (Map, WMTSLayer, WMTSLayerInfo, Extent, TileInfo, SpatialReference
       ) {

        //parser.parse();

        map = new Map("map");


      //  defineClassesBeforInitMap();
       // roadLayer = new GoogleMapLayer();
        //
       // map.addLayer(roadLayer);
        //var minpt = new esri.geometry.Point(92.17957278846418, -17.909669691616585, new esri.SpatialReference({ wkid: 4326 }));
        //var minptWeb = esri.geometry.geographicToWebMercator(minpt);
        //var maxpt = new esri.geometry.Point(140.97612918514383, 28.517045192981243, new esri.SpatialReference({ wkid: 4326 }));
        //var maxptWeb = esri.geometry.geographicToWebMercator(maxpt);

        //var initialExtent = new esri.geometry.Extent(minptWeb.x, minptWeb.y, maxptWeb.x, maxptWeb.y, map.spatialReference);
        //map.setExtent(initialExtent);

        //var scalebar = new Scalebar({
        //    map: map,
        //    scalebarUnit: "dual"
        //});





        var tileInfo2 = new TileInfo({
            "dpi": 90.71428571428571,
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": new SpatialReference({
                "wkid": 3857   //
            }),
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -2.0037508342787E7,
                "y": 2.0037508342787E7
            },
            "lods": [{
                "level": "0",
                "scale": 5.590822640287178E8,
                "resolution": 156543.033928041
            }, {
                "level": "1",
                "scale": 2.795411320143589E8,
                "resolution": 78271.5169640205
            }, {
                "level": "2",
                "scale": 1.3977056600717944E8,
                "resolution": 39135.75848201025
            }, {
                "level": "3",
                "scale": 6.988528300358972E7,
                "resolution": 19567.879241005125
            }, {
                "level": "4",
                "scale": 3.494264150179486E7,
                "resolution": 9783.939620502562
            }, {
                "level": "5",
                "scale": 1.747132075089743E7,
                "resolution": 4891.969810251281
            }, {
                "level": "6",
                "scale": 8735660.375448715,
                "resolution": 2445.9849051256406
            }, {
                "level": "7",
                "scale": 4367830.1877243575,
                "resolution": 1222.9924525628203
            }, {
                "level": "8",
                "scale": 2183915.0938621787,
                "resolution": 611.4962262814101
            }, {
                "level": "9",
                "scale": 1091957.5469310894,
                "resolution": 305.7481131407051
            }, {
                "level": "10",
                "scale": 1091957.5469310894,
                "resolution": 305.7481131407051
            }, {
                "level": "11",
                "scale": 272989.38673277234,
                "resolution": 76.43702828517627
            }, {
                "level": "12",
                "scale": 136494.69336638617,
                "resolution": 38.218514142588134
            }, {
                "level": "13",
                "scale": 68247.34668319309,
                "resolution": 19.109257071294067
            }, {
                "level": "14",
                "scale": 34123.67334159654,
                "resolution": 9.554628535647034
            }, {
                "level": "15",
                "scale": 17061.83667079827,
                "resolution": 4.777314267823517
            }]
        });
        var tileExtent2 = new Extent(1.0837065764556533E7, 3005151.0383373476, 1.2082765435716089E7, 4071141.9681105777, new SpatialReference({    //
            wkid: 3857
        }));
        var layerInfo2 = new WMTSLayerInfo({
            tileInfo: tileInfo2,
            fullExtent: tileExtent2,
            initialExtent: tileExtent2,
            identifier: "Export_Output_2@Export_Output_2",   //
            tileMatrixSet: "GoogleMapsCompatible_Export_Output_2@Export_Output_2",   //  
            format: "png",
            style: "default"   //
        });

        var resourceInfo = {
            version: "1.0.0",
            layerInfos: [layerInfo2],
            copyright: "open layer1"
        };

        var options = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo,
            layerInfo: layerInfo2
        };

        wmtsLayer = new WMTSLayer("http://localhost:8090/iserver/services/map-3/wmts100", options);
        map.addLayer(wmtsLayer);



    });

