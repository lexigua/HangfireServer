function formatnumber(value, row) {
    if (value != null) {
        value = Math.round(value * 100) / 100;
    }
    return value;
}

//function formatnumber(value, row) {
//    if (value != null && value.indexOf(".") !== -1)
//        return value.substring(0, value.indexOf(".") + 3);
//    return value;
//}