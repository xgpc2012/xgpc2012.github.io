$(document).ready(function() {
    createCode();//产生验证码
});

var code;
//var apiServer = "http://172.16.2.206:8080";
//var apiServer = "http://localhost:8080";


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


function updatePasswordWithForm(){  
    var inputCode = document.getElementById("j_captcha").value.toUpperCase(); //取得输入的验证码并转化为大写        
    inputCode=inputCode.toUpperCase();
    var valid=true;

    if ($('#username').val()=='') {
        show_err_msg('用户名不能为空！');
        $('#username').focus();
        valid=false;
    } else if($('#password').val() == ''){
        show_err_msg('旧密码还没填呢！');
        $('#password').focus();
        valid=false;
    }else if ($('#newPassword').val() == '' || $('#newPasswordConfirm').val() == '') {
        show_err_msg('新密码还没填呢！');
        $('#newPassword').focus();
        valid=false;
    }else if ($('#newPassword').val() != $('#newPasswordConfirm').val()) {
        show_err_msg('新密码两次输入不一致，请重新输入！');
        $('#newPassword').focus();
        valid=false;
    }else if(inputCode.length <= 0) { //若输入的验证码长度为0  
        show_err_msg("请输入验证码！"); //则弹出请输入验证码  
        valid=false;
    }         
    else if(inputCode != code ) { 
        show_err_msg("验证码输入错误！@_@"); //则弹出验证码输入错误  
        createCode();//刷新验证码  
        document.getElementById("code").value = "";//清空文本框  
        valid=false;
    }
    else{
        var username = $('#username').val();
        var password = $('#password').val();
        var callback = function (data) {
            if(data.success==false){
                show_err_msg('用户名与原密码不匹配！');
                valid=false;
                //document.location.reload();
            }
            else{
                var updateCallback = function(data){
                    if(data.success == true){
                        //show_err_msg("修改密码成功");
                        var source = $.qa.getQueryString('source');
                        if(source==null || source.length == 0) {
                            source = "index.html";
                        }
                        document.location.href = decodeURIComponent(source);
                    }else{
                        show_err_msg("修改密码失败");
                        //document.location.reload();
                    }
                };
                var username = $('#username').val();
                var password = $('#newPassword').val();
                $.qa.updatePassword(username, password, updateCallback);
            }
        };
        $.qa.login(username, password, callback);
    }

    return valid;
}  


function reset(){
    $("#username").val("");
    $("#password").val("");
    $("#newPassword").val("");
    $("#newPasswordConfirm").val("");
}


