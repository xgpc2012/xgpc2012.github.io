$(document).ready(function() {
    createCode();//产生验证码
    init();//获取Cookie
});

var code;
//var apiServer = "http://172.16.2.206:8080";
//var apiServer = "http://localhost:8080";

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return 'index.html';
}

function createCode(){
    code = "";  
    var code2="";
    var codeLength = 4;//验证码的长度  
    var checkCode = document.getElementById("code");   
    var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',  
    'S','T','U','V','W','X','Y','Z');//随机数  
    for(var i = 0; i < codeLength; i++) {//循环操作  
       var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）  
       code2 += ' '+random[index];//根据索引取得随机数加到code上  
       code+=random[index];
   }  
   checkCode.value = code2;//把code值赋给验证码  
}

//校验验证码  
function validate(){  
    var inputCode = document.getElementById("j_captcha").value.toUpperCase(); //取得输入的验证码并转化为大写        
    inputCode=inputCode.toUpperCase();
    var valid=true;
    if(inputCode.length <= 0) { //若输入的验证码长度为0  
        show_err_msg("请输入验证码！"); //则弹出请输入验证码  
        valid=false;
    }         
    else if(inputCode != code ) { 
        show_err_msg("验证码输入错误！@_@"); //则弹出验证码输入错误  
        createCode();//刷新验证码  
        document.getElementById("code").value = "";//清空文本框  
        valid=false;
    }  
    return valid;
}  


function loginWithForm(){
    addCookie();
    show_loading();
    if(!validate()){
        return;
    }
    if ($('#username').val()=='') {
        show_err_msg('用户名不能为空！');
        $('#username').focus();
    } else if ($('#password').val() == '') {
        show_err_msg('密码还没填呢！');
        $('#password').focus();
    }
    else{
        var username = $('#username').val();
        var password = $('#password').val();
        var callback = function (data) {
            if(data.success==true){
                var source = GetQueryString('source');
                document.location.href = decodeURIComponent(source);
            }
            else{
                show_err_msg('用户名密码不匹配！');
            }
        };
        $.qa.login(username, password, callback);
    }
    
}
function init(){
    var username = getCookie("username");
    var password = getCookie("password");
    if(username){
        document.getElementById("username").value = username;
    }
    if(password){
        document.getElementById("password").value = password;
    }
}

function reset(){
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    delCookie("username");
    delCookie("password");
}
function addCookie(){
    if(document.getElementById("j_remember").checked){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        addCookie("username",username,365);
        addCookie("password",password,365);
    }else{
        delCookie("username");
        delCookie("password");
    }
}

