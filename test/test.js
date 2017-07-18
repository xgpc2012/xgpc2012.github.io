/**
 * Created by pc on 2017/7/13.
 */
function moveToApp(mobile) {
    var u = navigator.userAgent,
        uri = "",
        params = "key1=1&key2=2";
    //终端类型判断
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    if (isAndroid) {
        uri = "umsapp://main.app/openwith?";
        location.href = uri + encodeURI(params);
        window.setTimeout(function () {
            location.href = "https://appsto.re/cn/_XZjeb.i";
        }, 2000)
    } else {
        uri = "umsylsw://kouliang?";
        location.href = uri + encodeURI(params);
        window.setTimeout(function () {
            location.href = "https://appsto.re/cn/_XZjeb.i";
        }, 3000)
    }
}

function showMsg(){
    var res=isWeiXin();
        node1=document.getElementById("div1");
    if(res){
        node1.innerHTML="<p style='color: blue;'>如果用微信浏览器打开可以看到这排文字</p>";
    }else{
        node1.innerHTML="<p style='color: red;'>如果不在微信浏览器打开可以看到这排文字</p>";
    }
}

function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
} 

function load(){
    var res=isWeiXin();
    if(res){
        var btn1 = document.getElementById("btn1");
        btn1.onclick = moveToApp;
    }
    showMsg();
}