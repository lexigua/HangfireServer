var uEmpty = "请输入用户名！";
var pEmpty = "请输入密码！";
var Error = "登录失败，用户名或密码错误或账户已被禁用！";

//获取焦点
function getFocus(elem) {
    $(elem).focus().select();
}

//获取元素值
function getElemVal(elem) {
    return $(elem).val();
}

//是否选中
function isChecked(elem) {
    return $(elem).attr("checked");
}

//获取元素值长度
function getElemVLen(elem) {
    return $(elem).val().length;
}

//追加Html
function appendHtml(elem, html) {
    if (!!html) {
        $(elem).html(html);
    } else {
        $(elem).html("");
    }     
}

//追加文字
function appendText(elem, messageText) {
    $(elem).html("");
    $(elem).html(messageText);
}

//用户登录
function uLogin() {
    var uName = getElemVal("#LoginCode");
    var uPwd = getElemVal("#LoginPwd");
    var imgCode = getElemVal("#imgCode");
    if (uName.trim() == "") {
        getFocus("#LoginCode");
        appendHtml("#errorMessage", "请输入用户名");
        $.easyui.removeLoading();
    } else if (uPwd.length < 6) {
        getFocus("#LoginPwd");
        appendHtml("#errorMessage", "密码长度不小于6位");
        $.easyui.removeLoading();
    }
    else if (imgCode.length < 1) {
        getFocus("#imgCode");
        appendHtml("#errorMessage", "请输入验证码");
        $.easyui.removeLoading();
    }
    else {
        checkLogin(uName, uPwd, $("#txtRemenberPws").val(), imgCode);
        //alert(result);
       // if (result) {
           // window.location.href = "/Home";
        //} else {
        //}
    }
}

//检查用户
function checkLogin(uName, uPwd, isre, imgCode) {
    //console.info(isre)
    
    //var isLogin = false;
    $.ajax({
        type: "POST",
       // async: false,
        url: "/Login/Index",
        data: { txtUser: uName, txtPass: uPwd,imgCode: imgCode },
        success: function (data) {
            if (data == "OK") {
                //isLogin = true;
                if (isre == 1) {
                    remenberU(uName, uPwd);
                } else {
                    clearRemenberU();
                }
                $.easyui.removeLoading();
                window.location.href = "/Home";
            } else if (data == "验证码错误") {
                $("#imgCode").val("");
                var current = new Date().getTime();
                $("#showimg").attr("src", "/Login/CheckCode?id=" + current);
                getFocus("#imgCode");
                appendHtml("#errorMessage", data);
                $.easyui.removeLoading();
            }
            else {
                clearRemenberU();
                $("#LoginCode").val("");
                $("#LoginPwd").val("");
                $("#imgCode").val("");
                var current = new Date().getTime();
                $("#showimg").attr("src", "/Login/CheckCode?id=" + current);
                getFocus("#LoginCode");
                appendHtml("#errorMessage", Error);
                $.easyui.removeLoading();
            }
        }
    });
  //  return isLogin;
}

var c = 0;
$(function () {
    $.cookie("publicKey", null);
    //getPublicKey();
    if ($.cookie('uN') && $.cookie('uN') != "null") {
        $('#LoginCode').val($.cookie('uN'));
        $('#LoginPwd').val(getDAesString($.cookie('uP')));
    }
});
function getAesString(data) {//加密
    var tempkey = generateUUID();
    var tempiv = "Pkcs7";
    var key = CryptoJS.enc.Hex.parse(tempkey);
    var iv = CryptoJS.enc.Latin1.parse(tempiv);
    var encrypted = CryptoJS.AES.encrypt(data, key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
    return encrypted.toString() + "," + tempkey + "," + tempiv;
}

function getDAesString(encrypted) {//解密
    if (encrypted.split(",").length < 3)
        return "";
    var key = CryptoJS.enc.Hex.parse(encrypted.split(",")[1]);
    var iv = CryptoJS.enc.Latin1.parse(encrypted.split(",")[2]);
    var decrypted = CryptoJS.AES.decrypt(encrypted.split(",")[0], key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
}
//id
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

//记住
function remenberU(uName, uPwd) {
    clearRemenberU();
    $.cookie("uN", uName, { expires: 7 });
    $.cookie("uP", getAesString(uPwd), { expires: 7 });
}

//清除
function clearRemenberU() {
    $.cookie("uN", null);
    $.cookie("uP", null);
}

var getPublicKey = function () {
    var publicKey = "";
    if ($.cookie("publicKey") == undefined || $.cookie("publicKey") === "null") {
        var current = new Date().getTime();
        $.ajax({
            url: "/Login/GetRsaPublicKey?id=" + current,
            type: "get",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            async: false,
            data: {},
            dataType: "json",
            success: function (data) {
                if (data.Code == 0) {
                    publicKey = data.RsaPublicKey + "," + data.Key;
                    $.cookie("publicKey", publicKey);// 此处存储时间应该小于后台缓存时间
                } else {
                    return null;
                }
            }
        });

    } else {
        publicKey = $.cookie("publicKey");
    }
    return publicKey;
}

var rsaEncrypt = function (pwd) {
    $.cookie("publicKey", null);
    var publicKey = getPublicKey();
    //$.easyui.removeLoading();
    setMaxDigits(129);
    var rsaKey = new RSAKeyPair(publicKey.split(",")[0], "", publicKey.split(",")[1]);
    var pwdRtn = encryptedString(rsaKey, pwd);
    return pwdRtn + "," + publicKey.split(",")[2];
}


