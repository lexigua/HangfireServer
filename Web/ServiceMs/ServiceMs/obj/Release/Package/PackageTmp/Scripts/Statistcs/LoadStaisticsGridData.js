//绑定电力消费grid数据
//dataResult:查询返回的json数据，按数据库的数据行显示
//gridId:datagrid目标id
//dateField:为数组类型，要显示的日期字段或其他字段,该类数据不会有子列,如：[{name:'数据年份(年)',field:'StaYear'},{name:'数据年份(月)',field:'StaMonth'}]
//childField:为数组类型,数组元素为object类型,需显示的子列,例如:[{name:'本月消费',field:'CurrentMonthUsed'},{name:'去年同月消费',field:'InTheSameMonthLastYearUsed'},{name:'消费同比(%)',field:'CurrentSameRate'}]
function BindGridData(dataResult, gridId, dateField, childField, parentFieldName) {
    var headtitle = [];
    var headArray = [];
    var headArray1 = [];
    var headArraystr = "[";
    var headArray1str = "[";
    var fieldList = [];
    var allField = [new Array(), new Array(), "",""];
    //添加表格前部数据，该类数据没有子级列
    $.each(dateField, function (i, t) {
        headArray.push({ field: t.field, title: t.name, width: 100, rowspan: 2, align: 'center' });
        headArraystr += "{'field':'" + t.field + "','title':'" + t.name + "','rowspan':'" + 2 + "' }";
        allField[0].push(t.field);
        allField[1].push(t.name);
    });
    //遍历获取父级列名以及添加二级列列名及其他属性
    $.each(dataResult, function (index, item) {
        if ($.inArray(item[parentFieldName], headtitle) < 0) {
            headtitle.push(item[parentFieldName]);
            //一级表头
            headArray.push({ title: item[parentFieldName], width: 100, colspan: childField.length, align: 'center' });
            headArraystr += ",{'title':'" + item[parentFieldName] + "','colspan':'" + childField.length + "' }";
            //二级表头
            $.each(childField, function (i, item) {
                headArray1.push({ field: "field" + index + i, title: item.name, width: 100, colspan: 1, align: 'center' });
                if (headArray1str.length > 3)
                    headArray1str += ",";
                headArray1str += "{'title':'" + item.name + "','colspan':'" +1 + "' }";
                fieldList.push('field' + index + i);
            });
        }
    });
    var dataRowCount = dataResult.length * childField.length / fieldList.length;//grid最终的数据行数
    var jsonData = [];
    //为生产的grid列构建json数据
    for (var i = 0; i < dataRowCount; i++) {
        var dataRow = "";

        for (var m = 0; m < dateField.length; m++) {
            if (m == 0) {
                dataRow += "{\"" + dateField[m].field + "\":'" + dataResult[i * fieldList.length / childField.length][dateField[m].field]+"'";
            } else {
                dataRow += ",\"" + dateField[m].field + "\":'" + dataResult[i * fieldList.length / childField.length][dateField[m].field]+"'";
            }
        }
        for (var j = 0; j < fieldList.length / childField.length; j++) {
            for (var k = 0; k < childField.length; k++) {
               
                try {
                    var value = dataResult[i * fieldList.length / childField.length + j][childField[k].field];
                    if (value == null) {
                        value = '';
                    }
                    dataRow += ",\"" + fieldList[childField.length * j + k] + "\":'" + value + "'";
                } catch (e) {
                    //debugger;
                    //console.log("jsonKey:"+i);
                    //console.log("fieldKey:" + j);
                    //console.log("k:" + k);
                } 
             
            }
        }
        dataRow += "}";
        jsonData.push(eval('(' + dataRow + ')'));
    }
    $("#" + gridId).datagrid({
        columns: [headArray, headArray1],
        fitColumns: true,
        singleSelect: true,
        data: jsonData
    });
    $.each(fieldList, function(index,item) {
            allField[0].push(item);
    });
    $.each(headtitle, function (i, t) {
        $.each(childField, function(index,item) {
            allField[1].push(item.name);
        });
    });
    headArraystr += "]";
    headArray1str += "]";
    allField[2] = headArraystr;
    allField[3] = headArray1str;
    return allField;
}