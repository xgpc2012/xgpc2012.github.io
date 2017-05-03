;(function($,W){

	W.T = {version:"1.5"};
	W.T.apply = function(obj,prop,defs){
		if(defs){
			W.T.apply(obj,prop);
		}
		if(obj && prop && typeof(prop) == "object"){
			for(var key in prop){
				obj[key] = prop[key];
			}
		}
		return obj;
	};
	var GUID = function(){
		this.date = new Date();
		/* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
		if (typeof this.newGUID != 'function') {

			/* 生成GUID码 */
			GUID.prototype.newGUID = function() {
				this.date = new Date();
				var guidStr = '';
				sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
				sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
				for (var i = 0; i < 9; i++) {
					guidStr += Math.floor(Math.random() * 16).toString(16);
				}
				guidStr += sexadecimalDate;
				guidStr += sexadecimalTime;
				while (guidStr.length < 32) {
					guidStr += Math.floor(Math.random() * 16).toString(16);
				}
				return this.formatGUID(guidStr);
			}

			/*
			 * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 返回值：返回GUID日期格式的字条串
			 */
			GUID.prototype.getGUIDDate = function() {
				return this.date.getFullYear()
						+ this.addZero(this.date.getMonth() + 1)
						+ this.addZero(this.date.getDay());
			}

			/*
			 * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 返回值：返回GUID日期格式的字条串
			 */
			GUID.prototype.getGUIDTime = function() {
				return this.addZero(this.date.getHours())
						+ this.addZero(this.date.getMinutes())
						+ this.addZero(this.date.getSeconds())
						+ this.addZero(parseInt(this.date.getMilliseconds() / 10));
			}

			/*
			 * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 参数:
			 * 参数表示准备再前面添加0的数字或可以转换成数字的字符串 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
			 */
			GUID.prototype.addZero = function(num) {
				if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
					return '0' + Math.floor(num);
				} else {
					return num.toString();
				}
			}

			/*
			 * 功能：将y进制的数值，转换为x进制的数值
			 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 返回值：返回转换后的字符串
			 */
			GUID.prototype.hexadecimal = function(num, x, y) {
				if (y != undefined) {
					return parseInt(num.toString(), y).toString(x);
				} else {
					return parseInt(num.toString()).toString(x);
				}
			}

			/*
			 * 功能：格式化32位的字符串为GUID模式的字符串 参数：第1个参数表示32位的字符串 返回值：标准GUID格式的字符串
			 */
			GUID.prototype.formatGUID = function(guidStr) {
				var str1 = guidStr.slice(0, 8), str2 = guidStr.slice(8, 12), str3 = guidStr.slice(12, 16), str4 = guidStr
						.slice(16, 20), str5 = guidStr.slice(20);
				return str1 + str2 + str3 + str4 + str5;
			}
		}
	};
	var loading = function(message){
		var tpl = [],self = this,runCallback = function(temp){
			if(callback && typeof(callback) == "function"){
				callback.apply(self,[temp]);
			}
		};
		tpl.push('<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="my-modal-loading">');
		tpl.push('<div class="am-modal-dialog" style="border-radius: 5px;">');
		tpl.push('<div class="am-modal-hd">'+message+'</div>');
		tpl.push('<div class="am-modal-bd loader">');
		tpl.push('<div class="loader-inner pacman action loaded">');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('</div>');
		tpl.push('</div>');
		tpl.push('</div>');
		tpl.push('</div>');
		self.tplString = tpl.join("");
		self.show = function(){
			self.el = $(self.tplString).appendTo(document.body);
			$(self.el).modal({
				onConfirm:function(){
					runCallback(true);
					$(self.el).remove();
					$(".am-dimmer").hide();
				},
				onCancel:function(){
					runCallback(false);
					$(self.el).remove();
					$(".am-dimmer").hide();
				}
			});
			return self;
		};
		self.close = function(){
			$(self.el).remove();
			$(".am-dimmer").hide();
		};
	};


	var submitDialog = function(message,url){
		var tpl = [],self = this,runCallback = function(temp){
			if(callback && typeof(callback) == "function"){
				callback.apply(self,[temp]);
			}
		};
		tpl.push('<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="my-modal-loading">');
		tpl.push('<div class="am-modal-dialog" style="border-radius: 5px;">');
		tpl.push('<div class="am-modal-hd">'+message+'</div>');
		tpl.push('<div class="am-modal-bd loader">');
		tpl.push('<div class="loader-inner pacman action loaded">');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('<div></div>');
		tpl.push('</div>');
		tpl.push('</div>');
		tpl.push('</div>');
		tpl.push('</div>');
		self.tplString = tpl.join("");
		self.show = function(){
			self.el = $(self.tplString).appendTo(document.body);
			$(self.el).modal({
				onConfirm:function(){
					runCallback(true);
					$(self.el).remove();
					$(".am-dimmer").hide();
				},
				onCancel:function(){
					runCallback(false);
					$(self.el).remove();
					$(".am-dimmer").hide();
				}
			});

			$(".am-dimmer").delay(1500).hide(200);
			$(self.el).delay(1500).hide(200);
			setTimeout("top.location.href='" + url + "'", 1000);
//			window.location..delay(1000).href(100) = '../../index.html';
		};
//		self.close = function(){
//			$(self.el).remove();
//			$(".am-dimmer").hide();
//		};
		return true;
	};
	var win = function(title,message,callback,unsingle){
		if(!title){
			title = "新网服";
		}
		var tpl = [],self = this,runCallback = function(temp){
			if(callback && typeof(callback) == "function"){
				callback.apply(self,[temp]);
			}
		};
		tpl.push("<div class='am-modal am-modal-confirm alert' tabindex='-1' id='customer_dialog'>");
			tpl.push("<div class='am-modal-dialog am-margin-left-xs am-margin-right-xs'>");
				if(title && title.length != 0){
					tpl.push("<div class='am-modal-hd' style='background-color:#004280;vertical-align: middle;color: white'>");
					tpl.push(title);
					tpl.push("</div>");
				}
				if(message && message.length != 0){
					tpl.push("<div class='am-modal-bd' style='padding-top:1rem!important;'>");
						tpl.push("<span style='vertical-align:middle;height:55px;line-height:35px;text-align:center;color:black;font-weight:600;'>");
						tpl.push(message);
						tpl.push("</span>");
					tpl.push("</div>");
				}
				tpl.push("<div class='am-modal-footer'>");
					if(unsingle){
						tpl.push("<span class='am-modal-btn' data-am-modal-cancel>取消</span>");
					}
					tpl.push("<span class='am-modal-btn' data-am-modal-confirm>确定</span>");
				tpl.push("</div>");
			tpl.push("</div>");
		tpl.push("</div>");
		self.tplString = tpl.join("");
		self.show = function(){
			var el = $("#customer_dialog");
			if(el.length == 0){
				el = $(self.tplString).appendTo(document.body);
			}else{
				$(".alert div").empty();
				el = $(self.tplString).appendTo(document.body);
			}
			self.el = $(el);
			$(self.el).modal({
				onConfirm:function(){
					runCallback(true);
					$(self.el).hide();
					$(".am-dimmer").hide();
				},
				onCancel:function(){
					runCallback(false);
					$(self.el).hide();
					$(".am-dimmer").hide();
				}
			});
		}
	};

	W.T.apply(W.T,{
		MessageBox:win,
		LoadingBox:loading,
		SubmitDialog:submitDialog,
		GUID:function(){
			var id = new GUID().newGUID();
			return id;
		}
	});

})(jQuery,window);

	function add_zero(temp){
if(temp<10) return "0"+temp;
else return temp;
}
	var uri = "/v1/forward";
	var appId = "10037e6f521b07a201521b4933f40001";
	var bid_type = '';//申办类型
	var fendian_id = '';//分店id
	var zhongduan_id = '';//终端id
	var now=new Date()
    //替换div内容
    var year = now.getFullYear();
    var month = add_zero(now.getMonth()+1);
    var day = add_zero(now.getDate());
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var mydate = JSON.stringify(year) + month+day+JSON.stringify(hour)+JSON.stringify(minutes)+JSON.stringify(seconds);
    //等待一秒钟后调用time方法，由于settimeout在time方法内，所以可以无限调用
var kERRORCODETOINFO = {
	"00":"提交成功待处理",
	"01":"处理中",
	"02":"处理失败",
	"09":"处理成功",
	"12":"匹配原交易失败",
	"13":"流水检查失败",
	"14":"重复提交",
	"15":"无此交易",
	"16":"超额退款",
	"20":"待审核",
	"21":"审核不通过",
	"80":"验签失败",
	"81":"参数信息有误",
	"92":"无此权限",
	"94":"提交非法商户编号",
	"95":"不能处理该交易日退货",
	"96":"商户未开通退货",
	"98":"会话超时",
	"99":"系统异常",
	"30":"请求时间过期",
	"31":"接入方不存在",
	"32":"接入方狀態異常",
	"33":"服务不支持",
	"34":"签名方式不匹配",
	"35":"商户退货流水号重复",
	"36":"接入方id无法对应一个有效的网服用户",
	"100":"查询不到记录",
}

/**
 * @param {查询错误信息} errCode
 */
var errInfo = function (errCode) {
	return kERRORCODETOINFO[errCode] || "错误码不存在,请核查!";
}
var getHashName = function(key, url) {
	var hash;
	if (!!url) {
		hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
		hash = (hash == url) ? "" : hash;
	} else {
		hash = self.location.hash;
	}

	hash = "" + hash;
	hash = hash.replace(/^[?#]/, '');
	hash = "&" + hash;
	var val = hash.match(new RegExp("[\&]" + key + "=([^\&]+)", "i"));
	if (val == null || val.length < 1) {
		return null;
	} else {
		return decodeURIComponent(val[1]);
	}
}


;(function (W) {
	W.Tool = {
		"user_id":"023928dfd5b14f1680739b7510b80bab",
		"partner":"21A360BF64D6D0A2E0437F000001D0A20002",
		"input_charset":"gbk",
		"sign_type":"SHA",
		"key":"1234567890abc123456",
		};
	W.Tool.apply = function(obj,prop,defs){
		if(defs){
			W.Tool.apply(obj,prop);
		}
		if(obj && prop && typeof(prop) == "object"){
			for(var key in prop){
				obj[key] = prop[key];
			}
		}
		return obj;
	};
	var setData = function(a,b){
		var store = $.AMUI.store;
		if(b!=''&&b!=null&&b!=undefined){
			return store.set(a, b);
		}
		
	};
	var getData = function(a){
//		var store = $.AMUI.store;
		return $.AMUI.store.get(a);
	};
	
	var clearData = function(){
		$.AMUI.store.clear();
	};
	var removeData = function(key){
		if($.AMUI.store.get(key)!=undefined){
			$.AMUI.store.remove(key);
		}
		
	}
	var getNetWorkStatus = function(){
	try {
		var netStatus = UmsApi.globalization.getNetworkStatus();
		if (netStatus == undefined || netStatus == null) {
					return '0';
		} else {
					return '1';
		}
	} catch (e) {
		UmsApi.notification.error(e.message);
	}
	}
	
	
	var varifyUser = function(url,code){
//		if(Tool.Get('user_app_type')=='0'||Tool.Get('user_app_type')==undefined){
//			alert('用户无角色');
//		} else if(Tool.Get('user_app_type')=='1'){
//			alert('老板');
//		} else if(Tool.Get('user_app_type')=='2'){
//			alert('财务');
//		}else if(Tool.Get('user_app_type')=='3'){
//			alert('收银员');
//		}
		if(Tool.Get('user_app_type')=='0'||Tool.Get('user_app_type')==undefined){
			var json = {};
			json.code = code;
			json.url = url;
			if (url == 'dataInfo.html'){
				json.needboss = 'Y';
			}
			UmsApi.page.forwardBizPageByAbsoluteUrl('BIZ-WF-ROLEBINDING','role.html',json);
		}else if(Tool.Get('user_app_type')=='3'){
			//收银员不能查账
			if(url == 'checkEarnings.html'){
			var json = {};
			json.code = code;
			json.url = url;
			UmsApi.page.forwardBizPageByAbsoluteUrl('BIZ-WF-ROLEBINDING','role.html',json);
			}
			//收银员不能退货
			else if(url == 'returnSearch.html'){
			var json = {};
			json.code = code;
			json.url = url;
			UmsApi.page.forwardBizPageByAbsoluteUrl('BIZ-WF-ROLEBINDING','role.html',json);
			}
			//收银员不能看数据模仿
			else if (url == 'dataInfo.html') {
				isBoss(url,code);
			}else {
				var json = {};
				json.code = code;
				json.url = url;
				UmsApi.page.forwardBizPageByAbsoluteUrl(code,url,'');
			}
		}
		else if(Tool.Get('user_app_type')=='2'){
			//财务不能看数据模仿
			if (url == 'dataInfo.html'){
				isBoss(url,code);
			} else {
				var json = {};
				json.code = code;
				json.url = url;
				UmsApi.page.forwardBizPageByAbsoluteUrl(code,url,'');
			}
		}else {
				var json = {};
				json.code = code;
				json.url = url;
				UmsApi.page.forwardBizPageByAbsoluteUrl(code,url,'');
		}
	}
	
	var dialog = '';
	var isBoss = function(url,code){
		
		
		//先判断缓存数据
		if(Tool.Get('haveBoss') == '1'){
			UmsApi.notification.tip('您的老板说只有他才能看');
			return false;
		}
		
	if (Tool.GetNetWorkStatus() == '1') {
		dialog = new TipBox({
			type: 'load',
			str: "更多服务，为您而来",
			setTime: 30000,
			callBack: function() {

			}
		});
		haveBoss(url,code);
	} else {

		Tool.AlertInfo('网络异常  尝试重新连接网络后重试');
	}
		
	}
	
	
	//验证是否可以升级老板
	var	haveBoss = function(URL,CODE){
		
		var param = {
		"appRequestDate": (new Date()).format("yyyyMMddhhmmss"), //20160113141400
		"service": "qryMchntHaveBossForApp", //服务名
		"mchntId":  Tool.Get('merchant_id')
		};
	console.log('param:'+JSON.stringify(param));
	UmsApi.base.call(uri, param,function(data) {
		
		dialog.close();
		try {
			if (data == null || data == undefined) {
				UmsApi.notification.error("Data Error!");
			}
			data = data["response"];
			console.log("SUCCESS:" + data);
			data = JSON.parse(data);
			if (data.responseCode == '000000') {
				
				//已经存在
				if(data.haveBoss == '1'){
					Tool.removeData('haveBoss');	
					Tool.Set('haveBoss',data.haveBoss);
					UmsApi.notification.tip('您的老板说只有他才能看');
				}else{
				var json = {};
				json.code = CODE;
				json.url = URL;
				UmsApi.page.forwardBizPageByAbsoluteUrl("BIZ-WF-ROLEBINDING",'role.html',json);
				}
				
			}
			
		} catch (e) {
			//TODO handle the exception
		}
	}, function(data) {
		dialog.close();
		UmsApi.notification.tip(JSON.stringify(data.errInfo));
	});
		
	}
	
	
	var alertInfo = function(message){
		UmsApi.notification.tip(message);
	}
	
	var loadData = function (params, callback,fialback) {
		params["partner"] = W.Tool["partner"];
		params["input_charset"] = W.Tool["input_charset"];
		params["sign_type"] = W.Tool["sign_type"];
		params["key"] = W.Tool["key"];
		params["request_date"] = (new Date()).format("yyyyMMddhhmmss");
		console.log("request:" + JSON.stringify(params));
		UmsApi.base.call(uri, params, function (data) {
			try{
				if (data == null || data == undefined) {
					UmsApi.notification.error("Data Error!");
				}
				data = data["response"];
				data = JSON.parse(data);
				console.log("DATA:" + JSON.stringify(data));
//				if(data["result_code"]=='00'){
//					console.log("SUCCESS:" + JSON.stringify(data));
					callback && callback(data);
//				} else {
//					UmsApi.notification.tip(JSON.stringify(data.result_desc));
//				}
				
			}catch(e){
				//TODO handle the exception
			}
		},function (data) {
			try{
				if (data == null || data == undefined) {
					UmsApi.notification.error("Data Error!");
				}
//				data = data["response"];
//				console.log("SUCCESS:" + data);
				data = JSON.parse(data);
				UmsApi.notification.tip("failture>>>>>>>>" +JSON.stringify(data));
				fialback && fialback(data);
			}catch(e){
				//TODO handle the exception
			}
		});
	}
	
	/** 
 * 模仿android里面的Toast效果，主要是用于在不打断程序正常执行的情况下显示提示数据 
 * @param config 
 * @return 
 */  
var Toast = function(config){  
    this.context = config.context==null?$('body'):config.context;//上下文  
    this.message = config.message;//显示内容  
    this.time = config.time==null?1500:config.time;//持续时间  
    this.left = config.left;//距容器左边的距离  
    this.top = config.top;//距容器上方的距离  
    this.init();  
}  
var msgEntity;  
Toast.prototype = {  
    //初始化显示的位置内容等  
    init : function(){  
        $("#toastMessage").remove();  
        //设置消息体  
        var msgDIV = new Array();  
        msgDIV.push('<div id="toastMessage">');  
        msgDIV.push('<span>'+this.message+'</span>');  
        msgDIV.push('</div>');  
        msgEntity = $(msgDIV.join('')).appendTo(this.context);  
        //设置消息样式  
        var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;  
        var top = this.top == null ? '220px' : this.top;  
        msgEntity.css({position:'absolute',top:top,'z-index':'99',left:left,'background-color':'black','border-radius':'10px',color:'white','font-size':'18px',padding:'10px',margin:'6px'});  
        msgEntity.hide();  
    },  
    //显示动画  
    show :function(){  
        msgEntity.fadeIn(this.time/2);  
        msgEntity.fadeOut(this.time/2);  
    }  
          
}  


	W.Tool.apply(W.Tool, {
		LoadData:loadData,
		Get:getData,
		Set:setData,
		ClearData:clearData,
		removeData:removeData,
		Toast:Toast,
		GetNetWorkStatus:getNetWorkStatus,
		AlertInfo:alertInfo,
		VarifyUser:varifyUser
	});
})(window);
