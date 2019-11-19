require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "dojo/dom", "dojo/on", "dojo/dom-class",
    "esri/layers/WMTSLayer", "esri/layers/WMTSLayerInfo", "esri/geometry/Extent", "esri/layers/TileInfo", "esri/SpatialReference",
    "dojo/domReady!"], function (Map, ArcGISTiledMapServiceLayer, dom, on, domClass, WMTSLayer, WMTSLayerInfo, Extent, TileInfo, SpatialReference) {
    map1 = new Map("map1", {
        //basemap: "topo",
        ///center: [103.69828872684525, 33.24237112174851], // long, lat
        //zoom: 4,
       // sliderStyle: "small"
    });
    
        addWMTSlayer();
        //addWMTSlayer1();


    var tileInfo2 = new TileInfo({
        "dpi": 90.7142857142857,
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
        "lods": [
            {
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
            },
        {
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
            "scale": 545978.7734655447,
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
        }
        , {
            "level": "16",
            "scale": 8530.918335399136,
            "resolution": 9.554628535647034
        }
        , {
            "level": "17",
            "scale": 4265.459167699568,
            "resolution": 9.554628535647034
        }
        , {
            "level": "18",
            "scale": 2132.729583849784,
            "resolution": 9.554628535647034
        }]
    });
    var tileExtent2 = new Extent(1.0566382772378184E7, 2911594.9059327883, 1.2354022971795602E7, 4243048.7054562345, new SpatialReference({    //
        wkid: 3857
    }));
    var layerInfo2 = new WMTSLayerInfo({
        tileInfo: tileInfo2,
        fullExtent: tileExtent2,
        initialExtent: tileExtent2,
        identifier: "sb",   //
        tileMatrixSet: "GoogleMapsCompatible_sb",   //  
        format: "png",
        style: "default"   //
    });

    var resourceInfo = {
        version: "1.0.0",
        layerInfos: [layerInfo2]
        //  copyright: ""
    };

    var options = {
        serviceMode: "KVP",
        resourceInfo: resourceInfo,
        layerInfo: layerInfo2,
        id: 'toplayer'
    };

    var map1toplayer = new WMTSLayer("http://localhost:8090/iserver/services/map-444442/wmts100", options);
    //var map1toplayer = new ArcGISTiledMapServiceLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', { id: 'toplayer' });

    var map1toplayerid = map1.id + '_toplayer';
    var map1toplayerdiv = null;
    map1.addLayer(map1toplayer);

    
    map1toplayer.on('load', function() {
        console.log("shabi");
    });
    var isverticalswipe = false;
    var ishorizontalswipe = false;
    on(dom.byId('verticalswipe'), "click", function () {
        isverticalswipe = !isverticalswipe;
    });
    on(dom.byId('horizontalswipe'), "click", function () {
        ishorizontalswipe = !ishorizontalswipe;
    });
    //因为地图在缩放或者平移过程中，承载layer的 div会发生水平或者垂直方向的transform。所以计算出来
    //on(map1toplayer, 'load', function () {
        on(map1, 'mouse-move', function (e) {
            map1toplayerdiv = map1toplayerdiv ? map1toplayerdiv : document.getElementById(map1.id + '_toplayer'); //map1_layer1   _toplayer
            var offsetX = e.screenPoint.x;
            var offsetY = e.screenPoint.y;
            var mapheightpx = map1toplayerdiv.style.height;
            var mapwidthpx = map1toplayerdiv.style.width;
            var mapheight = parseInt(mapheightpx.substring(0, mapheightpx.lastIndexOf('px')));//去掉单位px 取出数值
            var mapwidth = parseInt(mapwidthpx.substring(0, mapwidthpx.lastIndexOf('px')));
            var origin = getLayerTransform(map1toplayerdiv);
            var cliptop = -origin.y + "px";
            var clipleft = -origin.x + "px";//clip的左上起点
            var clipbottom, cliplright;
            clipbottom = ishorizontalswipe ? (offsetY - origin.y) + 'px' : (mapheight - origin.y) + 'px';
            clipright = isverticalswipe ? (offsetX - origin.x) + "px" : (mapwidth - origin.x) + "px";
            console.log('rect(' + cliptop + ',' + clipright + ',' + clipbottom + ',' + clipleft + ')');
            map1toplayerdiv.style.clip = 'rect(' + cliptop + ',' + clipright + ',' + clipbottom + ',' + clipleft + ')';
        });
  //  })

    //获取图层右上角的坐标
    function getLayerTransform(layer) {
        // var layer = document.getElementById(layerid);

        var xorigin, yorigin, layerstyle = layer.style;
        //chrome
        if (layerstyle['-webkit-transform']) {
            var s = layerstyle['-webkit-transform'];//格式为"translate(0px, 0px)"
            var xyarray = s.replace(/translate\(|px|\s|\)/, '').split(',');
            xorigin = parseInt(xyarray[0]);
            yorigin = parseInt(xyarray[1]);
        }
            //firefox
        else if (layerstyle['transform']) {
            //layer.style['transform'] 格式为"translate3d(xpx,ypx,zpx)" 这样的字符串，现在通过匹配转为[z,y,z]的数组,分别将 px,translate3d,空格
            // var xyzarray=layerstyle.replace(/px/g,'').replace(/ /g,'').replace('translate3d(','').replace(')','').split(',')
            var layertransforstring = layerstyle['transform'];
            var xyz = layertransforstring.replace(/px|\s|translate3d\(|px|\)/g, '').split(',');
            xorigin = parseInt(xyz[0]);
            yorigin = parseInt(xyz[1]);
        }
            //ie 8+
        else {
            xorigin = parseInt(layer.style.left.replace('px', ''));
            yorigin = parseInt(layer.style.top.replace('px', ''));
        }
        console.log("zheshi" + xorigin +"feng"+ yorigin);
        return {
            x: xorigin,
            y: yorigin
        }
    }
    //
    //
    ///
    ///
    ///
    ///下面的代码是针对的第二个Map  动画实现主要是结合css3中的 transition 请查阅相关资料
    ///
    ///
    ///


});


function addWMTSlayer() {
    require([
        "esri/map", "esri/layers/WMTSLayer", "esri/layers/WMTSLayerInfo", "esri/geometry/Extent", "esri/layers/TileInfo", "esri/SpatialReference", "dojo/domReady!"
    ],
    function (Map, WMTSLayer, WMTSLayerInfo, Extent, TileInfo, SpatialReference) {

        var tileInfo2 = new TileInfo({
            "dpi": 90.7142857142857,
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
            "lods": [
                {
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
                },
            {
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
        var tileExtent2 = new Extent(1.1557578395608038E7, 3327293.3585149352, 1.2083774322122136E7, 3810352.6895283116, new SpatialReference({    //
            wkid: 3857
        }));
        var layerInfo2 = new WMTSLayerInfo({
            tileInfo: tileInfo2,
            fullExtent: tileExtent2,
            initialExtent: tileExtent2,
            identifier: "Gas Current Situation_SiChuan",   //
            tileMatrixSet: "GoogleMapsCompatible_Gas Current Situation_SiChuan",   //  
            format: "png",
            style: "default"   //
        });

        var resourceInfo = {
            version: "1.0.0",
            layerInfos: [layerInfo2]
            //  copyright: ""
        };

        var options = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo,
            layerInfo: layerInfo2
        };

        wmtsLayer_region = new WMTSLayer("http://112.74.101.152:8090/iserver/services/map-ZTZT_GAS/wmts100", options);

     
        //wmtsLayer_region = new WMTSLayer("http://localhost:8090/iserver/services/map-55555/wmts100", options);
        map1.addLayer(wmtsLayer_region);
        wmtsLayer_region.visible = true;
    });
}

