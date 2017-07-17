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
    } else {
        //uri = "umsylsw://kouliang?";
        var ifr = document.createElement('iframe');
        ifr.src = 'umsylsw://kouliang?'+params;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(function(){
            document.body.removeChild(ifr);
        },3000)
    }
}