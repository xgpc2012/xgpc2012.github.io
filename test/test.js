/**
 * Created by pc on 2017/7/13.
 */
function moveToApp(mobile){
    var uri="umsapp://main.app/openwith?";
    var params="a=1&b=2";
    var u = navigator.userAgent;
    var isAndroid=u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    alert(isAndroid);
    //此处应当先判断设备类型
    //location.href="http://www.baidu.com";
    //location.href=uri;
}