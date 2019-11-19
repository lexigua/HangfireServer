	//定义 google 图层

	function defineClassesBeforInitMap() {

	    dojo.declare("GoogleMapLayer", esri.layers.TiledMapServiceLayer, {

	        constructor: function () {

	            this.spatialReference = new esri.SpatialReference({ wkid: 102113 });
	            var minpt = new esri.geometry.Point(92.17957278846418, -16.909669691616585, new esri.SpatialReference({ wkid: 4326 }));
	            var minptWeb = esri.geometry.geographicToWebMercator(minpt);
	            var maxpt = new esri.geometry.Point(140.97612918514383, 28.517045192981243, new esri.SpatialReference({ wkid: 4326 }));
	            var maxptWeb = esri.geometry.geographicToWebMercator(maxpt);
	            this.fullExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787, this.spatialReference);

	            this.initialExtent = new esri.geometry.Extent(minptWeb.x, minptWeb.y, maxptWeb.x, maxptWeb.y, this.spatialReference);

	            this.tileInfo = new esri.layers.TileInfo({

	                "rows": 256,

	                "cols": 256,

	                "compressionQuality": 0,

	                "origin": { "x": -20037508.342787, "y": 20037508.342787 },

	                "spatialReference": { "wkid": 102113 },

	                "lods": [
                        { "level": 0, "scale": 591657527.591555, "resolution": 156543.033928 },
                        { "level": 1, "scale": 295828763.795777, "resolution": 78271.5169639999 },
                        { "level": 2, "scale": 147914381.897889, "resolution": 39135.7584820001 },
                        { "level": 3, "scale": 73957190.948944, "resolution": 19567.8792409999 },

                         { "level": 4, "scale": 36978595.474472, "resolution": 9783.93962049996 },

                         { "level": 5, "scale": 18489297.737236, "resolution": 4891.96981024998 },

                         { "level": 6, "scale": 9244648.868618, "resolution": 2445.98490512499 },

                         { "level": 7, "scale": 4622324.434309, "resolution": 1222.99245256249 },

                         { "level": 8, "scale": 2311162.217155, "resolution": 611.49622628138 },

                         { "level": 9, "scale": 1155581.108577, "resolution": 305.748113140558 },

                         { "level": 10, "scale": 577790.554289, "resolution": 152.874056570411 },

                         { "level": 11, "scale": 288895.277144, "resolution": 76.4370282850732 },

                         { "level": 12, "scale": 144447.638572, "resolution": 38.2185141425366 },

                         { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },

                         { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },

                         { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },

                         { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },

                         { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },

                         { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },

                         { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617}]

	            });

	            this.loaded = true;

	            this.onLoad(this);

	        },

	        getTileUrl: function (level, row, col) {
	            //return "images/map/hightop.png";
	            return "http://mt" + (col % 4) + ".google.cn/vt/lyrs=m@226000000&hl=zh-CN&gl=cn&x=" + col + "&y=" + row + "&z=" + level + "&s=Gali";

	        }

	    }); //谷歌矢量地图切片地图



	    dojo.declare("GoogleAnooLayer", esri.layers.TiledMapServiceLayer, {

	        constructor: function () {

	            this.spatialReference = new esri.SpatialReference({ wkid: 102113 });
	            var minpt = new esri.geometry.Point(92.17957278846418, -16.909669691616585, new esri.SpatialReference({ wkid: 4326 }));
	            var minptWeb = esri.geometry.geographicToWebMercator(minpt);
	            var maxpt = new esri.geometry.Point(140.97612918514383, 28.517045192981243, new esri.SpatialReference({ wkid: 4326 }));
	            var maxptWeb = esri.geometry.geographicToWebMercator(maxpt);
	            this.fullExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787, this.spatialReference);

	            this.initialExtent = new esri.geometry.Extent(minptWeb.x, minptWeb.y, maxptWeb.x, maxptWeb.y, this.spatialReference);

	            this.tileInfo = new esri.layers.TileInfo({

	                "rows": 256,

	                "cols": 256,

	                "compressionQuality": 0,

	                "origin": { "x": -20037508.342787, "y": 20037508.342787 },

	                "spatialReference": { "wkid": 102113 },

	                "lods": [
                         { "level": 0, "scale": 591657527.591555, "resolution": 156543.033928 },
                        { "level": 1, "scale": 295828763.795777, "resolution": 78271.5169639999 },
                        { "level": 2, "scale": 147914381.897889, "resolution": 39135.7584820001 },
                        { "level": 3, "scale": 73957190.948944, "resolution": 19567.8792409999 },

                        { "level": 4, "scale": 36978595.474472, "resolution": 9783.93962049996 },

                        { "level": 5, "scale": 18489297.737236, "resolution": 4891.96981024998 },

                        { "level": 6, "scale": 9244648.868618, "resolution": 2445.98490512499 },

                        { "level": 7, "scale": 4622324.434309, "resolution": 1222.99245256249 },

                        { "level": 8, "scale": 2311162.217155, "resolution": 611.49622628138 },

                        { "level": 9, "scale": 1155581.108577, "resolution": 305.748113140558 },

                        { "level": 10, "scale": 577790.554289, "resolution": 152.874056570411 },

                        { "level": 11, "scale": 288895.277144, "resolution": 76.4370282850732 },

                        { "level": 12, "scale": 144447.638572, "resolution": 38.2185141425366 },

                        { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },

                        { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },

                        { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },

                        { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },

                        { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },

                        { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },

                        { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617}]

	            });

	            this.loaded = true;

	            this.onLoad(this);

	        },

	        getTileUrl: function (level, row, col) {

	            return "http://mt" + (col % 4) + ".google.cn/vt/lyrs=h@177000000&hl=zh-CN&gl=cn&x=" + col + "&y=" + row + "&z=" + level + "&s=";

	        }

	    }); //谷歌路网地名切片地图



	    dojo.declare("GoogleImageLayer", esri.layers.TiledMapServiceLayer, {

	        constructor: function () {

	            this.spatialReference = new esri.SpatialReference({ wkid: 102113 });
	            var minpt = new esri.geometry.Point(92.17957278846418, -16.909669691616585, new esri.SpatialReference({ wkid: 4326 }));
	            var minptWeb = esri.geometry.geographicToWebMercator(minpt);
	            var maxpt = new esri.geometry.Point(140.97612918514383, 28.517045192981243, new esri.SpatialReference({ wkid: 4326 }));
	            var maxptWeb = esri.geometry.geographicToWebMercator(maxpt);
	            this.fullExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787, this.spatialReference);

	            this.initialExtent = new esri.geometry.Extent(minptWeb.x, minptWeb.y, maxptWeb.x, maxptWeb.y, this.spatialReference);

	            this.tileInfo = new esri.layers.TileInfo({

	                "rows": 256,

	                "cols": 256,

	                "compressionQuality": 0,

	                "origin": { "x": -20037508.342787, "y": 20037508.342787 },

	                "spatialReference": { "wkid": 102113 },

	                "lods": [
                         { "level": 0, "scale": 591657527.591555, "resolution": 156543.033928 },
                        { "level": 1, "scale": 295828763.795777, "resolution": 78271.5169639999 },
                        { "level": 2, "scale": 147914381.897889, "resolution": 39135.7584820001 },
                         { "level": 3, "scale": 73957190.948944, "resolution": 19567.8792409999 },

                        { "level": 4, "scale": 36978595.474472, "resolution": 9783.93962049996 },

                        { "level": 5, "scale": 18489297.737236, "resolution": 4891.96981024998 },

                        { "level": 6, "scale": 9244648.868618, "resolution": 2445.98490512499 },

                        { "level": 7, "scale": 4622324.434309, "resolution": 1222.99245256249 },

                        { "level": 8, "scale": 2311162.217155, "resolution": 611.49622628138 },

                        { "level": 9, "scale": 1155581.108577, "resolution": 305.748113140558 },

                        { "level": 10, "scale": 577790.554289, "resolution": 152.874056570411 },

                        { "level": 11, "scale": 288895.277144, "resolution": 76.4370282850732 },

                        { "level": 12, "scale": 144447.638572, "resolution": 38.2185141425366 },

                        { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },

                        { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },

                        { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },

                        { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },

                        { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },

                        { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },

                        { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617}]

	            });

	            this.loaded = true;

	            this.onLoad(this);

	        },

	        getTileUrl: function (level, row, col) {
	            //.google.cn/vt/lyrs=s@143&hl=zh-CN&gl=CN&src=app
	            return "http://mt" + (col % 4) + ".google.cn/vt/lyrs=s@186&hl=zh-CN&gl=CN&src=app&x=" + col + "&y=" + row + "&z=" + level + "&s=";
	            //return "http://mt" + (col % 4) + ".google.cn/vt/lyrs=t@132,r@248000000&gl=CN&src=app&hl=zh-CN&x=" + col + "&y=" + row + "&z=" + level + "&s=Gali";
	        }

	    });  //谷歌影像切片地图



	}