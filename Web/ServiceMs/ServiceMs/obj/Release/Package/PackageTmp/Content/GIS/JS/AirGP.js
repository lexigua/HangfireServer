var GPFiledValue;
//var GPFiledValue = value.AQI;
var gp;
function GetNowPG(){
require(["esri/tasks/Geoprocessor", "esri/tasks/FeatureSet", "esri/graphic", "esri/geometry/Point", "dojo/domReady!"], function (Geoprocessor, FeatureSet, Graphic, Point) {
    var gpUrl = "http://192.168.2.138:6080/arcgis/rest/services/EMC/AirIDWDemo/GPServer/AirIDW";
        var features = [];
        
    $.each(allAirStation, function(index, value) {
        var xShapes = value.Longitude.split(",")[0] / 1.0 + value.Longitude.split(",")[1] / 60.0 + value.Longitude.split(",")[2] / 3600.0;
        var yShapes = value.Latitude.split(",")[0] / 1.0 + value.Latitude.split(",")[1] / 60.0 + value.Latitude.split(",")[2] / 3600.0;
        var pt = new Point(xShapes, yShapes, new esri.SpatialReference({ wkid: 4326 }));
        var attribute = ({ "XCoord": "1", "YCoord": "2", "MyValue": value.AQI });
        var graphic = new Graphic(pt, "", attribute);
        features.push(graphic);
    });





        var featureSet = new FeatureSet();
        featureSet.features = features;

        var parms = {
            Z_value_field: "MyValue",
            AirPoint: featureSet
        };
        gp = new Geoprocessor(gpUrl);
        gp.submitJob(parms, jobResult);


    

    function jobResult(result) {
        var mapurlll = "http://192.168.2.138:6080/arcgis/rest/services/EMC/AirIDWDemo/MapServer/jobs" + "/" + result.jobId;
        var hotspotLayer = new esri.layers.ArcGISDynamicMapServiceLayer(mapurlll);
        map.addLayer(hotspotLayer);
    }
});
}