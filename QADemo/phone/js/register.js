//提示语常量
var InfoCons = {
    "username": "用户名",
    "password": "密码",
    "password1": "确认密码",
    "realname": "真实姓名",
    "title": "职务",
    "location": "办公地点",
    "qq": "QQ号码",
    "email": "工作邮箱",
    "phone": "工作座机",
    "mobilePhone": "个人电话"
};

var submitData = {
    "username": "",
    "password": "",
    "realname": "",
    "title": "",
    "location": "",
    "qq": "",
    "email": "",
    "phone": "",
    "mobilePhone": ""
}

var checkInput = function () {
    var checkResult = true;
    var password = $("#password").val();
    var passwordToConfirm = $("#password1").val();
    if(password != passwordToConfirm) {
        checkResult = false;
        $("#dialog").dialog({
            title:"错误提示信息",
            show: true,
            hide: true,
            buttons : {
                '确定' : function () {
                    $("#dialog").dialog("close");
                }
            }
        })
        $("#errorMsg").text("两次输入的密码不一致，请确认！");
    }

    $("input").each(function (index, item) {
        var $this = $(this);
        var fieldName = $this.attr("id");
        var value = $this.val();
        var essential  = $this.hasClass("essential");
        if (value == "" && essential) {
            $("#dialog").dialog({
                title:"错误提示信息",
                show: true,
                hide: true,
                buttons : {
                    '确定' : function () {
                        $("#dialog").dialog("close");
                    }
                }
            })
            $("#errorMsg").text("注册信息中【" + InfoCons[fieldName] + "】字段不能为空");
            checkResult = false;
                //提前停止循环
                return false;
            } else {
                if (submitData[fieldName] !== undefined) {
                    if(fieldName == 'password') {
                        value = b64_md5(value);
                    }
                    submitData[fieldName] = value;
                }
            }
        });

    $("select").each(function (index, item) {
        var $this = $(this);
        var fieldName = $this.attr("id");
        submitData[fieldName] = $this.val();
    });


    console.log(submitData);
    return checkResult;
};

var submitRegisterInfo = function () {
    var checkResult = checkInput();
    if (checkResult == false) {
        console.log("检查没通过");
        return;
    }
    console.log("检查通过");
    var callback = function(data) {
        console.log(data);
        $("#dialog").dialog({
            title:"成功提示信息",
            show: true,
            hide: true,
            buttons : {
                '确定' : function () {
                    $("#dialog").dialog("close");
                }
            }
        })
        if(data.success == true) {
            $("#errorMsg").text("提交成功!");
        }
        else {
            $("#errorMsg").text(data.msg);
        }
    };
    $.qa.register(callback);
};

//dom ready
$(document).ready(function () {
    $("#submitRegisterInfo").on("click", function () {
        submitRegisterInfo();
    });
});