function dd(value) {
    var ids = $("#annexids").val();
    if (ids.trim() != "") {
        $("#annexids").val(ids + "," + value);
    } else {
        $("#annexids").val(value);
    }
}