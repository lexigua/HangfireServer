//高级查询方法
//水电站
//var condition = "[{\"text\":\"电站名称\",\"value\":\"{'Type':'textbox','text':'电站名称','Name':'HydropowerStationName','Data':'','DataType':'string'}\"}" +
//          ",{\"text\":\"所在区域\",\"value\":\"{'Type':'dropdownList','text':'所在区域','Name':'BelongToRegion','Data':'/GIS/City/AreaCityComb','DataType':'string'}\"}" +
//          ",{\"text\":\"所在流域\",\"value\":" +
//                    "\"{'Type':'dropdownList','text':'所在流域','Name':'BelongToBasin','Data':'/GIS/ProjectHydropowerStationProject/SearchBelongToBasin','DataType':''}\"}" +
//       ",{\"text\":\"投产时间\",\"value\":\"{'Type':'rangeDate','text':'投产时间','Name':'BeginProductionTime,EndProductionTime','Data':'','DataType':'date'}\"}" +
//    "]";
var condition = "[]";
var jsondata = eval("(" + condition + ")");
function BeforeOut() {
    if (typeof (Out) === "undefined") {
        $.messager.alert('提示框', '先查询数据才能导出！', 'error');
    } else {
        Out();
    }
}
$(function () {
    $("#DataType").combobox({
        onChange: function () {
            $("#Type").combobox('setValue', '');
            $("#Type").combobox('loadData', '');
            $("#Type").combobox({
                url: "/Common/CommonSystemDictionary/QueryValueCodeWithStaff?code=" + $("#DataType").combobox('getValue')
            });
            //$("#Type").combobox('reload');
        }
    });
    $("#divQuery2").hide();
    $("#Type").combobox({
        onLoadSuccess: function() {
            $("#Type").combobox('setValue', '');
        }
    });
});
var url = "";
var panelurl = "";
var oldurl = "";
function TypeChange(newValue, oldValue) {
    $.easyui.showLoading();
    Reset2();
    if (oldurl !== "/GIS/ProjectHydropowerStationProject/SearchWelcome") {
        oldurl = "/GIS/ProjectHydropowerStationProject/SearchWelcome";
        $("#SearchPanel").panel('open').panel('refresh', "/GIS/ProjectHydropowerStationProject/SearchWelcome");
    }
    if (newValue === "" || newValue == null) {
        if (oldValue !== "") {
            $("#divQuery2").hide();
            $.easyui.removeLoading();
        }
    } else {
        $.post("/Common/CommonAdvancedQueryConfig/QueryCodeJson", { code: newValue }, function (data) {
            if (data != null) {
                var newjson = eval("(" + data + ")");
                $("#divQuery2").show();
                panelurl = newjson.DictionaryValue;
                url = newjson.DictionaryValue.substring(0, newjson.DictionaryValue.lastIndexOf('/')) + "/query";
                jsondata = newjson.json;
                $.easyui.removeLoading();
            }
        });

        //$.post("/Common/CommonSystemDictionary/QueryCodeJson", { code: newValue }, function (data) {
        //    console.log(data);
        //    if (data != null) {
        //        var json = eval("(" + data + ")");
        //        $("#divQuery2").show();
        //        panelurl = json.DictionaryValue;
        //        url = json.DictionaryValue.substring(0, json.DictionaryValue.lastIndexOf('/'))+"/query";
        //        $.post("/Common/CommonAdvancedQueryConfig/GetJson", { configid: json.Id }, function (data2) {
        //            jsondata = eval("(" + data2 + ")");
        //        });
        //    }
        //});
    }
    return true;
}

function addhtml(newValue, id) {
    var newjson = eval("(" + newValue + ")");
    //如果条件重复 删除原条件 
    if ($("#markquery #" + newjson.Name) != null) {
        $("#markquery #" + newjson.Name).parent().parent().remove();
    }
    //如果原有查询条件要删除
    $("#markquery  #" + id + " .newcondition").remove();
    if ($("#markquery  #" + id + " td:last-child").html() === "") {
        $("#markquery  #" + id + " td:last-child").remove();
    }
    //判断条件类型 <td class='newcondition'>" + newjson.Text + "</td>
    var str = "";
    switch (newjson.Type) {
        case "textbox":
            str = addtextbox(str, newjson); break;
        case "dropdownList":
            str = adddroplist(str, newjson);
            break;
        case "dropCountyList":
            str = addcountylist(str, newjson);
            break;
        case "dropCityList":
            str = addcitylist(str, newjson);
            break;
        case "rangeNumber":
            str = addrangenumber(str, newjson); break;
        case "rangeDouble":
            str = addrangedouble(str, newjson); break;
        case "rangeDate":
            str = addrangedate(str, newjson); break;
        default: str = "";
            break;
    }
    str += "<td class='newcondition'><span class='icon-deleteInput' onclick='RemoveQuery(\"" + id + "\")'></span><td>";
    $("#" + id).append(str);
}

function RemoveQuery(id) {
    $.each(markId, function (index, obj) {
        if ($("#markquery #" + id + "  #" + obj).length > 0) {
            $("#markquery #" + connectionId[index]).combobox('reload', countryurl);
        }
    });
    $("#markquery #" + id).remove();
    /*if ($("#markquery tr").length === 0) {
        AddQuery("QueryCombox");
    }*/
    if (!$("#markquery tr").length) {
        $(".moreConditions").css("display", "none");
    }
}

function AddFirstQuery() {
    var queryhtml = '<input  class="QueryCombox" id="QueryCombox1"></input>';
    //<td>选择条件</td>
    $("#markquery").append("<tr id='markquery1'><td>" + queryhtml + "</td></tr>");
    $("#QueryCombox1").combobox({
        data: jsondata,
        editable: false,
        onChange: function (newValue, oldValue) {
            addhtml(newValue, "markquery1");
        }
    });
}

function AddQuery() {
    var index = getIndex();
    var queryhtml = '<input  class="QueryCombox" id="QueryCombox' + index + '"></input>';
    //<td>选择条件</td>
    $(".moreConditions").css("display", "block");
    $("#markquery").append("<tr id='markquery" + index + "'><td>" + queryhtml + "</td></tr>");
    $("#QueryCombox" + index).combobox({
        data: jsondata,
        editable: false,
        onChange: function (newValue, oldValue) {
            addhtml(newValue, "markquery" + index);
        }
    });
}

var index = 1;

function getIndex() {
    //var index =  document.getElementById("markquery").getElementsByTagName("tr").length+1;
    index = index + 1;
    return index;
}
function addtextbox(str, newjson) {
    str += "<td  class='newcondition'><input name='" + newjson.Name + "' id='" + newjson.Name + "'/>&nbsp;&nbsp;</td>";
    str += "<script>$('#markquery #" + newjson.Name + "').textbox({});</script>";
    return str;
}
function adddroplist(str, newjson) {
    str += "<td  class='newcondition'><input name='" + newjson.Name + "' id='" + newjson.Name + "'/>&nbsp;&nbsp;</td>";
    str += "<script>$('#markquery #" + newjson.Name + "').combobox({ url:'" + newjson.Data + "'});</script>";
    return str;
}
//区县
function addcountylist(str, newjson) {
    var list = newjson.Name.split(",");
    str += "<td  class='newcondition'><input name='" + list[0] + "' id='" + list[0] + "'/>&nbsp;&nbsp;</td>";
    str += "<script> if($('#markquery #" + list[1] + "').length<1){city=''}countryurl='" + newjson.Data + "';" +
        "$('#markquery #" + list[0] + "').combobox({ url:'" + newjson.Data + "'+city});</script>";
    return str;
}

var city = "";
var countryurl = "";
var markId = [];
var connectionId = [];
//市州
function addcitylist(str, newjson) {
    var list = newjson.Name.split(",");
    str += "<td  class='newcondition'><input name='" + list[0] + "' id='" + list[0] + "'/>&nbsp;&nbsp;</td>";
    str += "<script>$('#markquery #" + list[0] + "').combobox({ url:'" + newjson.Data + "'," +
        "onChange:function(newValue,oldValue){city=newValue;if($('#markquery #" + list[1] + "').length>0)" +
        "{$('#markquery #" + list[1] + "').combobox('reload',countryurl+newValue);$('#markquery #" + list[1] + "').combobox('setValue', '')}}});markId.push('" + list[0] + "');connectionId.push('" + list[1] + "')</script>";
    return str;
}
function addrangenumber(str, newjson) {
    var list = newjson.Name.split(",");
    str += "<td  class='newcondition'><input name='" + list[0] + "' id='" + list[0] + "' type='text' class='easyui-numberbox'/>~</td>";
    str += "<td  class='newcondition'><input name='" + list[1] + "' id='" + list[1] + "' type='text' class='easyui-numberbox'/></td>";
    str += "<script>$('#markquery #" + list[0] + "').numberbox({ min:0, precision:0});" +
        "$('#" + list[1] + "').numberbox({ min:0,precision:0});</script>";
    return str;
}
function addrangedouble(str, newjson) {
    var list = newjson.Name.split(",");
    str += "<td  class='newcondition'><input name='" + list[0] + "' id='" + list[0] + "' type='text' class='easyui-numberbox'/>~</td>";
    str += "<td  class='newcondition'><input name='" + list[1] + "' id='" + list[1] + "' type='text' class='easyui-numberbox'/></td>";
    str += "<script>$('#markquery #" + list[0] + "').numberbox({ min:0, precision:2});" +
        "$('#" + list[1] + "').numberbox({ min:0,precision:2});</script>";
    return str;
}

function addrangedate(str, newjson) {
    var list = newjson.Name.split(",");
    str += "<td  class='newcondition'><input  name='" + list[0] + "'  id='" + list[0] + "' type='text'>~</input></td>";
    str += "<td  class='newcondition'><input  name='" + list[1] + "'  id='" + list[1] + "' type='text'></input></td>";
    str += "<script>$('#markquery #" + list[0] + "').datebox({});$('#" + list[1] + "').datebox({});</script>";
    return str;
}

function Query() {
    var jsondata;
    if (oldurl !== panelurl) {
        console.log(panelurl);
        $("#SearchPanel").panel('open').panel('refresh', panelurl);
        oldurl = panelurl;
        jsondata = $("#formQuery").serializeJson();
        $("#grid").datagrid({
            url: url,
            queryParams: jsondata
        });
    } else {
        jsondata = $("#formQuery").serializeJson();
        $("#grid").datagrid({
            url: url,
            queryParams: jsondata
        });
    }
}

function gridLoad() {
    var jsondata = $("#formQuery").serializeJson();
    $("#grid").datagrid({
        url: url,
        queryParams: jsondata
    });
}

function Reset() {
    $("#markquery .newcondition").remove();
    $.easyui.refresh("formQuery", "");
    $("#markquery tr").each(function (index) {
            $(this).remove();
    });
    $("#grid").datagrid("loadData", []);
}

function Reset2() {
    $("#markquery").html("");
    //$("#markquery .newcondition").remove();
    //$("#markquery tr").each(function (index) {
    //        $(this).remove();
    //});
}