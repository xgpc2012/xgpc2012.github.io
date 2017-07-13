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
    } else {
        uri = "umsylsw://kouliang?";
    }
    //此处应当先判断设备类型
    location.href = uri + encodeURI(params);
}