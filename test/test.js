/**
 * Created by pc on 2017/7/13.
 */
function moveToApp(mobile){
    var uri="umsapp://main.app/openwith?";
    var params="a=1&b=2";
    var userAgent = navigator.userAgent;
    alert(userAgent);
    //此处应当先判断设备类型
    //location.href="http://www.baidu.com";
    //location.href=uri;
}