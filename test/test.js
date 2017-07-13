/**
 * Created by pc on 2017/7/13.
 */
function moveToApp(){
    var uri="umsapp://main.app/openwith?a=1&b=2";
    alert("跳转地址是:"+uri);
    //此处应当先判断设备类型
    //location.href="http://www.baidu.com";
    location.href=uri;
}