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
    var res=isWeiXin()
        node1=document.getElementById("div1");
    if(res){
        node1.innerText="我是在微信内置浏览器里面";
    }else{
        node1.innerText="我是在普通浏览器里面";
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