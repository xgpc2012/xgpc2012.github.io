(function($){

    $.qa = {};

    $.qa.apiServer = 'http://172.16.2.207:8080';
    //$.qa.apiServer = 'http://172.16.2.206:8080';
    //$.qa.apiServer = 'http://localhost:8080';

//账户相关
$.qa.register = function(callback) {
    $.ajax({
        url: $.qa.apiServer + '/QAdemoWebApp/register.do',
        type: 'post',
        data: submitData,
        dataType: "jsonp",
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        },
        error: function () {
            alert("请求失败");
        }
    });
};

$.qa.login = function(username, passwordPlain, callback) {
    var password = b64_md5(passwordPlain);
    var clientRandom = b64_md5(uuid());
    $.ajax({
        url: $.qa.apiServer + '/QAdemoWebApp/getRandom.do',
        type: 'POST',
        data: {nonce: clientRandom},
        dataType: "jsonp",
        jsonp: 'jsoncallback',
        success: function (data) {
            var serverRandom = data.result;
            if(serverRandom != null) {
                var md5Password = b64_md5(clientRandom + password + serverRandom);
                $.ajax({
                    url: $.qa.apiServer + '/QAdemoWebApp/login.do',
                    type: 'POST',
                    data: {username: username, password: md5Password},
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    success: function(data){
                        if(callback != undefined){
                            callback(data);
                        }
                    }
                });
            }
        }
    });
};

$.qa.refreshAccount = function(data){
    if(data.success && data.result!=null) {
        var realname = data.result.realname;
        $('a.login').replaceWith('<a id="account" href="personalInfo.html">'+realname+'</a>');
        $('.header-user-wrap').css('width', '102px');
        //$('.login').addClass('active');
        $('.personalInfo').show();
        $('.register').hide();
    }else{
        $('.personalInfo').hide();
        $('.register').show();
        //$('.login').removeClass('active');
    }
    $('#account').on('mouseenter',function(){
        $('#accountPulldown').show();
    });
    $('#accountPulldown').skOuterClick(function(){
        $('#accountPulldown').hide();
    });
};

$.qa.logout = function(callback){
    $.ajax({
        type: 'GET',
        url: $.qa.apiServer + '/QAdemoWebApp/logout.do',
        data: {},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            $.qa.refreshAccount(data);
            location.href = 'index.html';
        }
    });
};

$.qa.updatePassword = function(username, password, callback) {
    var md5Password = b64_md5(password);
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/updatePassword.do',
        data: {username: username, password: md5Password},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        }
    });
};

$.qa.getLoginedInfo = function(callback){
    $.ajax({
        type: 'GET',
        url: $.qa.apiServer + '/QAdemoWebApp/loginedInfo.do',
        data: {},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined) {
                callback(data);
            }
            $.qa.refreshAccount(data);
        }
    });
};

$.qa.getPhoneFilterList = function(callback){
    $.ajax({
        type: 'GET',
        url: $.qa.apiServer + '/QAdemoWebApp/phoneFilterList.do',
        data: {},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        }
    });
};

$.qa.search = function (searchParams, callback) {
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/phoneSearch.do',
        data: searchParams,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        }
    });
};

$.qa.getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return '';
};

$.qa.changeOwner = function (uuid, owner) {
    var apiURL = $.qa.apiServer + '/QAdemoWebApp/phoneUpdateOwner.do';
    $.ajax({
        type: 'POST',
        url: apiURL,
        data: {uuid: uuid, owner: owner},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(!data.success){
                alert('你没有权限修改此手机的持有人!\n必须登陆人与手机持有人一致才能修改！');
            }
            window.location.reload();
        },

    });
};

$.qa.getPhoneDetails = function(uuid, callback) {
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/phoneDetails.do',
        data: {'recordUUID': uuid},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data.result);
            }
        }
    });
};

$.qa.getPhoneHistory = function(uuid, callback) {
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/phoneHistory.do',
        data: {'uuid': uuid},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data.result);
            }
        }
    });
};

$.qa.getPersonalInfo = function(username, callback){
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/personalInfo.do',
        data: {username: username},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        }
    });
};

$.qa.getPhoneHistoryByOwner = function(realname, callback){
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/phoneHistoryByOwner.do',
        data: {owner: realname},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        }
    });
};

$.qa.getRealnameList = function(callback){
    $.ajax({
        type: 'POST',
        url: $.qa.apiServer + '/QAdemoWebApp/getRealnames.do',
        data: {},
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function (data) {
            if(callback != undefined){
                callback(data);
            }
        }
    });
};

$.fn.skOuterClick = function(method) {
    var methods = {
        init : function (handler) {
            var inners = new Array();
            if (arguments.length > 1) for (i = 1; i < arguments.length; i++) {
                inners.push(arguments[i]);
            }
            return this.each(function() {
                var self = $(this);
                var _this = this;
                var isInner = false;
                    // Bind click event to suppress
                    function onInnerClick(e){
                        isInner = true;
                    };
                    self.click(onInnerClick);
                    for (var idx in inners) inners[idx].click(onInnerClick);
                    // Bind click elsewhere
                $(document).click(function(e){
                    if (!isInner) handler.call(_this, e);
                    else isInner = false;
                });
            });
        }
    };
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'function') {
        return methods.init.apply(this, arguments);
    } else {
        $.error('Method "' + method + '" does not exist in skOuterClick plugin!');
    }
};


})(jQuery);