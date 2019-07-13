define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function (extent, url, origin) {
            this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
            this._mapurl = url;
            this.initialExtent = (this.fullExtent = extent);
            this.tileInfo = new esri.layers.TileInfo({
                "dpi": 96,//90.7142857142857,
                "rows": 256,
                "cols": 256,
               "compressionQuality": 0,
               "origin": origin,
                "spatialReference": {
                    "wkid": 4326
                },
                "lods": [
                  //{ "level": 1, "resolution": 0.703125, "scale": 5.916587109091312E8 },
                  //{ "level": 2, "resolution": 0.17578125, "scale": 7.39573388625E7 },
                  //{ "level": 3, "resolution": 0.087890625, "scale": 3.697866943125E7 },
                  //{ "level": 4, "resolution": 0.0439453125, "scale": 1.8489334715625E7 },
                  //{ "level": 5, "resolution": 0.02197265625, "scale": 9244667.3578125 },
                  //{ "level": 6, "resolution": 0.010986328125, "scale": 4622333.67890625 },
                  //{ "level": 7, "resolution": 0.0054931640625, "scale": 2311166.839453125 },
                  //{ "level": 8, "resolution": 0.00274658203125, "scale": 1155583.4197265625 }
                   { "level": 0, "resolution": 1.4062499999999998, "scale": 5.916587109091312E8 },
                  { "level": 1, "resolution": 0.7031249999999999, "scale": 2.958293554545656E8 },
                  { "level": 2, "resolution": 0.3515625, "scale": 1.4774879652937502E8 },
                  { "level": 3, "resolution": 0.17578125, "scale": 7.387439826468751E7 },
                  { "level": 4, "resolution": 0.087890625, "scale": 3.6937199132343754E7 },
                  { "level": 5, "resolution": 0.0439453125, "scale": 1.8468599566171877E7 },
                  { "level": 6, "resolution": 0.02197265625, "scale": 9234299.783085939 },
                  { "level": 7, "resolution": 0.010986328125, "scale": 4617149.891542969 },
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

            //return "http://192.168.2.204:8020/mapproxy.ashx?type=zhuanti&x=" + row + "&y=" + col + "&z=" + level + "&baseurl=" + this._mapurl;
            //return "http://192.168.2.155:8033/mapproxy.ashx?type=zhuanti&x=" + row + "&y=" + col + "&z=" + level + "&baseurl=" + this._mapurl;
            
            //var url = "http://localhost:8090/iserver/services/map-supermapsuper3/wmts_tianditu/guandao%40guandao/default/Custom_guandao@guandao/" + level + "/" + row + "/" + col + ".png";
            //return url;
            //return "http://localhost:5632/mapproxy.ashx?type=zhuanti&x=" + row + "&y=" + col + "&z=" + level + "&baseurl=" + this._mapurl;

             return this._mapurl + "&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col;
        }
    });
});