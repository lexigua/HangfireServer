define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({ wkid: 4490 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));

            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0,
                "origin": {
                    "x": -180,
                    "y": 90
                },
                "spatialReference": {
                    "wkid":4490
                },
                "lods": [
                     { "level": 0, "resolution": 1.4062499999999998, "scale": 5.916587109091312E8 },
                      { "level": 1, "resolution": 0.7031249999999999, "scale": 2.958293554545656E8 },
                  { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                  { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                  { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                  { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                 { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                  {"level" : 7, "resolution" : 0.010986328125, "scale" : 4617149.8915429693},
                  { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                  { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                  { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                  { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                  { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                  { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                  { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                  { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                  { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                  { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                  { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
                ]
            });

             this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
            //return "http://192.168.2.204:8020/mapproxy.ashx?type=road&x=" + row + "&y=" + col + "&z=" + level;
            //return "http://192.168.2.155:8033/mapproxy.ashx?type=zhuanti&x=" + row + "&y=" + col + "&z=" + level 

            //return "http://t0.tianditu.com/DataServer?T=vec_c&x=" + row + "&y=" + col + "&l=" + level;
            return "http://t0.tianditu.com/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles"
            //return "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
            //return " http://118.112.190.75:8891/iMap/iMapServer/defaultrest/services/SCTileMap/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";

        }
    });
});
//define(["dojo/_base/declare","esri/layers/tiled"], function(declare){
//return declare(esri.layers.TiledMapServiceLayer, {
//        constructor: function() {
//          this.spatialReference = new esri.SpatialReference({ wkid:4326 });
//          this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
         
//          this.tileInfo = new esri.layers.TileInfo({
//            "rows" : 256,
//            "cols" : 256,
//            "compressionQuality" : 0,
//            "origin" : {
//              "x" : -180,
//              "y" : 90
//            },
//            "spatialReference" : {
//              "wkid" : 4326
//            },
//            "lods": [
//                 { "level": 0, "resolution": 1.4062499999999998, "scale": 5.916587109091312E8 },
//                  { "level": 1, "resolution": 0.7031249999999999, "scale": 2.958293554545656E8 },
//              {"level" : 2, "resolution" : 0.3515625, "scale" : 147748796.52937502},
//              {"level" : 3, "resolution" : 0.17578125, "scale" : 73874398.264687508},
//              {"level" : 4, "resolution" : 0.087890625, "scale" : 36937199.132343754},
//              {"level" : 5, "resolution" : 0.0439453125, "scale" : 18468599.566171877},
//              {"level" : 6, "resolution" : 0.02197265625, "scale" : 9234299.7830859385},
//              {"level" : 7, "resolution" : 0.010986328125, "scale" : 4617149.8915429693},
//              {"level" : 8, "resolution" : 0.0054931640625, "scale" : 2308574.9457714846},
//              {"level" : 9, "resolution" : 0.00274658203125, "scale" : 1154287.4728857423},
//              {"level" : 10, "resolution" : 0.001373291015625, "scale" : 577143.73644287116},
//              {"level" : 11, "resolution" : 0.0006866455078125, "scale" : 288571.86822143558},
//              {"level" : 12, "resolution" : 0.00034332275390625, "scale" : 144285.93411071779},
//              {"level" : 13, "resolution" : 0.000171661376953125, "scale" : 72142.967055358895},
//              {"level" : 14, "resolution" : 8.58306884765625e-005, "scale" : 36071.483527679447},
//              {"level" : 15, "resolution" : 4.291534423828125e-005, "scale" : 18035.741763839724},
//              {"level" : 16, "resolution" : 2.1457672119140625e-005, "scale" : 9017.8708819198619},
//              {"level" : 17, "resolution" : 1.0728836059570313e-005, "scale" : 4508.9354409599309},
//              {"level" : 18, "resolution" : 5.3644180297851563e-006, "scale" : 2254.4677204799655}
//            ]
//          });
 
//          this.loaded = true;
//          this.onLoad(this);
//        },
 
//        getTileUrl: function(level, row, col) {
//            //return "http://t0.tianditu.com/DataServer?T=vec_c&x=" + row + "&y=" + col + "&l=" + level;

//          return "http://t" + col%8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT=tiles";
//            //return " http://118.112.190.75:8891/iMap/iMapServer/defaultrest/services/SCTileMap/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
 
//        }
//      });
//      });

//define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
//    return declare(esri.layers.TiledMapServiceLayer, {
//        constructor: function () {
//            this.spatialReference = new esri.SpatialReference({ wkid: 3857 });
//            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892, this.spatialReference));

//            this.tileInfo = new esri.layers.TileInfo({
//                "rows": 256,
//                "dpi":96,
//                "cols": 256,
//                "compressionQuality": 0,
//                "origin": {
//                    "x": -20037508.3427892,
//                    "y": 20037508.3427892
//                },
//                "spatialReference": {
//                    "wkid": 3857
//                },
//                "lods": [
//                  { "level": 2, "resolution": 39135.75848201024, "scale": 1.479146777272828E8 },
//                  { "level": 3, "resolution": 19567.87924100512, "scale": 7.39573388636414E7 },
//                  { "level": 4, "resolution": 9783.93962050256, "scale": 3.69786694318207E7 },
//                  { "level": 5, "resolution": 4891.96981025128, "scale": 1.848933471591035E7 },
//                  { "level": 6, "resolution": 2445.98490512564, "scale": 9244667.357955175 },
//                  { "level": 7, "resolution": 1222.99245256282, "scale": 4622333.678977588 },
//                  { "level": 8, "resolution": 611.49622628141, "scale": 2311166.839488794 },
//                  { "level": 9, "resolution": 305.748113140705, "scale": 1155583.419744397 },
//                  { "level": 10, "resolution": 152.8740565703525, "scale": 577791.7098721985 },
//                  { "level": 11, "resolution": 76.43702828517625, "scale": 288895.85493609926 },
//                  { "level": 12, "resolution": 38.21851414258813, "scale": 144447.92746804963 },
//                  { "level": 13, "resolution": 19.109257071294063, "scale": 72223.96373402482 },
//                  { "level": 14, "resolution": 9.554628535647032, "scale": 36111.98186701241 },
//                  { "level": 15, "resolution": 4.777314267823516, "scale": 18055.990933506204 },
//                  { "level": 16, "resolution": 2.388657133911758, "scale": 9027.995466753102 },
//                  { "level": 17, "resolution": 1.194328566955879, "scale": 4513.997733376551 },
//                  { "level": 18, "resolution": 0.5971642834779395, "scale": 2256.998866688275 }
//                ]
//            });

//            this.loaded = true;
//            this.onLoad(this);
//        },

//        getTileUrl: function (level, row, col) {
//            //return "http://t0.tianditu.com/DataServer?T=vec_c&x=" + row + "&y=" + col + "&l=" + level;
//              return "http://t0.tianditu.com/DataServer?T=vec_w" + "&x=" + col + "&y=" + row + "&l=" + level;
//            //return "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
//            //return " http://118.112.190.75:8891/iMap/iMapServer/defaultrest/services/SCTileMap/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";

//        }
//    });
//});