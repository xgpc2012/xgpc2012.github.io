//添加cookie
function addCookie(name,value,expireDays){
	var cookieString=name+"="+escape(value);
	//判断是否设置过期时间
	if(expireDays>0){
		var date=new Date();
		date.setTime(date.getTime()+expireDays*24*3600*1000);
		cookieString=cookieString+"; expires="+date.toGMTString();
	}
	document.cookie=cookieString;
}
//获取指定名称的cookie
function getCookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split("; ");
	for(var i=0;i<arrcookie.length;i+=1){
		var arr=arrcookie[i].split("=");
		if(arr[0]==name) return unescape(arr[1]);
	}
	return null;
}
//删除指定名称的cookie
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+escape(cval)+";expires="+exp.toGMTString();
}



