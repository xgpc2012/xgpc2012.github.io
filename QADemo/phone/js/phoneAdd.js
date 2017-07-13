/**
 * Created by pc on 2017/3/9.
 */
jQuery(function ($) {
    $.datepicker.regional['zh-CN'] = {
        closeText: '关闭',
        prevText: '<上月',
        nextText: '下月>',
        currentText: '今天',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        weekHeader: '周',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'
    };
    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});

$(document).ready(function () {
    //jq对象缓存
    var $brand = $("#brand"),
        $timeToMarket = $("#timeToMarket"),
        $osCategory = $("#osCategory"),
        $screenInches = $("#screenInches"),
        $ram = $("#ram"),
        $chargingPortType = $("#chargingPortType"),
        $buyTime = $("#buyTime"),
        $submitDevice = $("#submitDevice");

    $timeToMarket.datepicker({
        changeMonth: true,
        changeYear: true,
    });
    $buyTime.datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $submitDevice.on("click", function () {
        submitDevice();
    })

    $screenInches.blur(function () {
        console.log($(this).val());
    })

    //提交的业务方法
    function submitDevice() {
        var checkResult = checkInput();
        if (checkResult == false) {
            console.log("检查没通过");
            return;
        }
        console.log("检查通过");
        if ($brand.val() == "Apple") {
            submitData["osVersion"] = "i" + submitData["osVersion"];
        } else {
            submitData["osVersion"] = "a" + submitData["osVersion"];
        }
        $.ajax({
            url: "http://172.16.2.206:8080/QAdemoWebApp/phoneAddRecord.do",
            type: "post",
            data: submitData,
            dataType: "jsonp",
            jsonp: 'jsoncallback',
            success: function (data) {
                console.log(data);
                $("#dialog").dialog({
                    title: "成功提示信息",
                    show: true,
                    hide: true,
                    buttons: {
                        '确定': function () {
                            $("#dialog").dialog("close");
                        }
                    }
                })
                $("#errorMsg").text("提交成功!");
            },
            error: function () {
                console.log("请求失败");
            }
        })
    }


    function checkInput() {
        var checkResult = true;
        $("input").each(function (index, item) {
            var fieldName = $(this).attr("id");
            var value1 = $(this).val();
            var optional = $(this).hasClass("optional");
            if (value1 == "") {
                if (!optional) {
                    $("#dialog").dialog({
                        title: "错误提示信息",
                        show: true,
                        hide: true,
                        buttons: {
                            '确定': function () {
                                $("#dialog").dialog("close");
                            }
                        }
                    })
                    $("#errorMsg").text("手机" + InfoCons[fieldName] + "不能为空");
                    console.log("手机" + InfoCons[fieldName] + "不能为空");
                    checkResult = false;
                    //提前停止循环
                    return false;
                }
            } else {
                if (fieldName == "timeToMarket" || fieldName == "buyTime") {
                    submitData[fieldName] = value1.substring(0, 4);
                } else {
                    submitData[fieldName] = value1;
                }
            }
        })
        $("select").each(function (index, item) {
            var fieldName = $(this).attr("id");
            submitData[fieldName] = $(this).val();
        })
        console.log(submitData);
        return checkResult;
    }

    //提示语常量
    var InfoCons = (function () {
        return {
            "phoneVersion": "型号",
            "phoneVersionDetails": "具体型号",
            "timeToMarket": "上市时间",
            "osVersion": "系统版本号",
            "customizeOSName": "定制系统名称",
            "customizeOSVersion": "定制系统版本号",
            "screenInches": "屏幕尺寸",
            "screenResolution": "屏幕分辨率",
            "screenPpi": "屏幕ppi",
            "ram": "运行内存",
            "owner": "持有人",
            "price": "金额",
            "buyTime": "购买时间"
        }
    })()

    var submitData = {
        "brand": "",
        "phoneVersion": "",
        "phoneVersionDetails": "",
        "timeToMarket": "",
        "osCategory": "",
        "osVersion": "",
        "customizeOSName": "",
        "customizeOSVersion": "",
        "screenInches": "",
        "screenResolution": "",
        "screenPpi": "",
        "ram": "",
        "chargingPortType": "",
        "owner": "",
        "location": "",
        "state": "",
        "price": "",
        "buyTime": ""
    }


    //监听方法
    $brand.on("change", function (e) {
        var brand = $brand.val();
        if (brand == "Apple") {
            //苹果设备
            $osCategory.val("iOS");
            $chargingPortType.val("Lightning");
            $('.customize').hide();
        } else {
            //安卓设备
            $osCategory.val('Android');
            $chargingPortType.val("Micro USB");
            $('.customize').show();
        }
        $osCategory.attr("disabled", "disabled");
        //$chargingPortType.attr("disabled", "disabled");
    })

    $ram.on("keyup", function () {
        this.value = this.value.replace(/[^1-9]/g, '');
    })

    $(".price").on("keyup", function (event) {
        this.value = this.value.replace(/\D/g, '')
    })
})
