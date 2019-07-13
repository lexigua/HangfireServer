$(function () {
    var date = new Date();
    var startDate = (date.getFullYear() - 1) + "年" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '月';
    var endDate = (date.getFullYear()) + "年" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '月';
    $("#startDate").val(startDate);
    $("#endDate").val(endDate);
    QueryElecSumData();
});

function resetQueryform() {
    $("#startDate").val("");
    $("#endDate").val("");
}

function QueryElecSumData() {
    var startData = $("#startDate").val();
    var endData = $("#endDate").val();
    if (endData != "") {
        var dateYear = endData.substr(0, 4);
        var dateMonth = endData.substr(endData.indexOf('年') + 1, 2);
        if (dateMonth == "12") {
            endData = endData.replace(dateYear, parseFloat(dateYear) + 1);
            endData = endData.replace(dateMonth, 1);
        } else {
            endData = endData.replace(dateMonth, parseFloat(dateMonth) + 1);
        }
    }
    getElecConsumSumData(startData, endData, "proc_ElecConsum_CommonStatisticsMethod", $("#statisticsTypeId").val());

}

