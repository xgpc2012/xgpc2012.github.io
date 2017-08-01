/**
 * Created by pc on 2017/7/13.
 */

//mobile为所填手机号
//callback函数代表在微信内部点击按钮时执行的操作(显示提示语等等)
function clickBtn(mobile,callback) {
    var res = isWeiXin();
    if (res) {
        //这个地方提示请使用非微信浏览器打开浏览器打开
        //呈现方式由口粮决定
        callback();
    } else {
        moveToApp(mobile);
    }
}

//跳转APP
function moveToApp(mobile) {
    var mobile=mobile?mobile:"18616002500";
    var u = navigator.userAgent,
        uri = "",
        params = "key1=" + mobile;
    //终端类型判断
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    if (isAndroid) {
        uri = "umsapp://main.app/openwith?";
        location.href = uri + encodeURI(params);
        //没有安装app自动跳转下载页面
        window.setTimeout(function () {
            location.href = "http://app.chinaums.com/app/filedownload?appid=2844";
        }, 4000)
    } else {
        uri = "umsylsw://kouliang?";
        // location.href = uri + encodeURI(params);
        // //没有安装app自动跳转下载页面
        // window.setTimeout(function () {
        //     location.href = "http://app.chinaums.com/app/filedownload?appid=2844";
        // }, 4000)
        var ifr = document.createElement("iframe");
        ifr.src = "umsylsw://kouliang?"; 
        ifr.style.display = "none";
        document.body.appendChild(ifr);
        window.setTimeout(function(){
            document.body.removeChild(ifr);
            window.location.href = "http://app.chinaums.com/app/filedownload?appid=2844";
        },2000)
    }
}

//判断是否在微信内部浏览器
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}