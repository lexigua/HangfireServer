
function Stateformatter(value, row, index) {
    if (value == 0) {
        return "";
    }else if (value == 4210688) {
        return "进行中";
    } else if (value == 8404992) {
        return "二审";
    }
    else if (value == 4398046511104) {
        return "三审";
    } else if (value == 4227072) {
        return "已完成";
    } else {
        return "";
    }

}
function SampleAuditStateformatter(value, row, index) {
    if (value == 0) {
        return "";
    } else if (value == 8404992) {
        return "进行中";
    } else if (value == 8421376) {
        return "二审";
    } else if (value == 8392704) {
        return "三审";
    } else {
        return "已完成";
    }

}
function SampleCheckStateformatter(value, row, index) {
    if (value == 0) {
        return "";
    } else if (value == 4227072) {
        return "未流转";
    } else if (value == 4259840) {
        return "已流转";
    } else if (value == 4227072) {
        return "已提交";
    }

}
function AnalysisStateformatter(value, row, index) {
    if (value == 0) {
        return "";
    } else if (value == 4227072) {
        return "未流转";
    } else if (value == 67108864) {
        return "二审";
    } else if (value == 134217728) {
        return "三审";
    }

}
function MergeCells(tableID, fldList) {
    var Arr = fldList.split(",");
    var dg = $('#' + tableID);
    var fldName;
    var RowCount = dg.datagrid("getRows").length;
    var span;
    var PerValue = "";
    var CurValue = "";
    var length = Arr.length - 1;
    for (i = length; i >= 0; i--) {
        fldName = Arr[i];
        PerValue = "";
        span = 1;
        for (row = 0; row <= RowCount; row++) {
            if (row == RowCount) {
                CurValue = "";
            } else {
                CurValue = dg.datagrid("getRows")[row][fldName];
            }
            if (PerValue == CurValue) {
                span += 1;
            } else {
                var index = row - span;
                dg.datagrid('mergeCells', {
                    index: index,
                    field: fldName,
                    rowspan: span,
                    colspan: null
                });
                span = 1;
                PerValue = CurValue;
            }
        }
    }
}