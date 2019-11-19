﻿define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(97.34760714300006, 26.04902351100003, 108.54135189000004, 34.31527800900003, this.spatialReference));

            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0,
                "origin": {
                    "x": -400,
                    "y": 400
                },
                "spatialReference": {
                    "wkid": 4326
                },
                "lods": [
                    { "level": 0, "resolution": 1.4062499999999998, "scale": 5.916587109091312E8 },
                      { "level": 1, "resolution": 0.7031249999999999, "scale": 2.958293554545656E8 },
                  { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                  { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                  { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                  { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                 { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                  { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
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
            return "http://120.25.78.82:6081/sc_sdzrd/_alllayers/" +
                "L" + dojo.string.pad(level, 2, '0') + "/" +
                "R" + dojo.string.pad(row.toString(16), 8, '0') + "/" +
                "C" + dojo.string.pad(col.toString(16), 8, '0') + ".png";
        }
    });
});