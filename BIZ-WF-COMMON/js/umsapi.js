/**
   * 银联商务内置浏览器的js api
   *
   * @author 开放平台项目组
   */
javascript: (function(window) {
    var UmsApi = {
        version : "1.0.0",
        versionDetail : {
            major : 1,
            minor : 0,
            patch : 0
        }
    };

    // 将UmsApi暴露到window下，使其全局可以使用。
    window.UmsApi = UmsApi;

    // ///////////////////////// base function /////////////////////////////////
    var UmsTool = (function() {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            .split('');
        var isEmpty = function(obj) {
            if (obj === 0) {
                return true;
            } else {
                return obj == null || !obj || typeof obj == undefined
                    || obj == "";
            }
        };
        var isObject = function(obj) {
            if (isEmpty(obj))
                return false;
            return (typeof (obj) == "object");
        };
        var isString = function(obj) {
            if (isEmpty(obj))
                return false;
            return (typeof (obj) == "string");
        };
        var isArray = function(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        };
        var obj2Str = function(obj) {
            if (obj == undefined) {
                return "";
            } else if (isString(obj)) {
                return obj;
            } else if (isObject(obj)) {
                return "Object " + JSON.stringify(obj);
            } else {
                return obj.toString().replace(/\"\:/g, '":""');
            }
        };
        Math.uuid = function(len, radix) {
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                for (i = 0; i < len; i++)
                    uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        };
        Date.prototype.format = function(fmt) {
            var o = {
                "M+" : this.getMonth() + 1, // 月份
                "d+" : this.getDate(), // 日
                "h+" : this.getHours(), // 小时
                "m+" : this.getMinutes(), // 分
                "s+" : this.getSeconds(), // 秒
                "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
                "S" : this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1,
                        (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                            .substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };
        var Base64 = function() {
            var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            this.encode = function(input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = _utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output + _keyStr.charAt(enc1)
                        + _keyStr.charAt(enc2) + _keyStr.charAt(enc3)
                        + _keyStr.charAt(enc4);
                }
                return output;
            };
            this.decode = function(input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = _utf8_decode(output);
                return output;
            };
            var _utf8_encode = function(input) {
                var output = "";
                input = input.replace(/\r\n/g, "\n");
                for (var i = 0; i < input.length; i++) {
                    var chr = input.charCodeAt(i);
                    if (chr < 128) {
                        output += String.fromCharCode(chr);
                    } else if ((chr > 127) && (chr < 2048)) {
                        output += String.fromCharCode((chr >> 6) | 192);
                        output += String.fromCharCode((chr & 63) | 128);
                    } else {
                        output += String.fromCharCode((chr >> 12) | 224);
                        output += String.fromCharCode(((chr >> 6) & 63) | 128);
                        output += String.fromCharCode((chr & 63) | 128);
                    }
                }
                return output;
            };
            var _utf8_decode = function(input) {
                var output = "";
                var i = 0;
                var chr1 = 0, chr2 = 0, chr3 = 0;
                while (i < input.length) {
                    chr1 = input.charCodeAt(i);
                    if (chr1 < 128) {
                        output += String.fromCharCode(chr1);
                        i++;
                    } else if ((chr1 > 191) && (chr1 < 224)) {
                        chr2 = input.charCodeAt(i + 1);
                        output += String.fromCharCode(((chr1 & 31) << 6)
                            | (chr2 & 63));
                        i += 2;
                    } else {
                        chr2 = input.charCodeAt(i + 1);
                        chr3 = input.charCodeAt(i + 2);
                        output += String.fromCharCode(((chr1 & 15) << 12)
                            | ((chr2 & 63) << 6) | (chr3 & 63));
                        i += 3;
                    }
                }
                return output;
            };
        };
        var HashMap = function() {
            var map = {};
            this.put = function(key, value) {
                map[key] = value;
            };
            this.get = function(key) {
                if (map.hasOwnProperty(key)) {
                    return map[key];
                }
                return null;
            };
            this.remove = function(key) {
                if (map.hasOwnProperty(key)) {
                    return delete map[key];
                }
                return false;
            };
        };
        var Log = function() {
            var messages = new Array();
            this.log = function() {
                var msg = new Date().format("yyyy-MM-dd hh:mm:ss.S") + ">>";
                for (var i = 0; i < arguments.length; i++) {
                    msg = msg + " " + obj2Str(arguments[i]);
                }
                messages.push(msg);
                console.log(arguments);
            };
            this.clear = function() {
                messages.splice(0, messages.length);
            };
            this.print = function() {
                var msg = "";
                for (var i = 0; i < messages.length; i++) {
                    msg = msg + "\n" + messages[i];
                }
                return msg;
            };
        };
        var base64 = new Base64();
        var eventMap = new HashMap();
        var requestMap = new HashMap();
        var log = new Log();
        return {
            console : {
                log : log.log,
                debug : log.log,
                error : log.log,
                clear : log.clear,
                print : log.print
            },
            base64 : {
                encode : base64.encode,
                decode : base64.decode
            },
            eventMap: {
                put : eventMap.put,
                remove : eventMap.remove,
                get : eventMap.get
            },
            requestMap : {
                put : requestMap.put,
                remove : requestMap.remove,
                get : requestMap.get
            },
            common : {
                uuid : Math.uuid
            },
            data : {
                check : {
                    isEmpty : isEmpty,
                    isObject : isObject,
                    isArray : isArray,
                    isString : isString
                },
                convert : {
                    base64Str2Json : function(str) {
                        log.log("convert base64Str2Json [old str] = ", str);
                        try {
                            if (isEmpty(str)) {
                                return null;
                            }
                            str = base64.decode(str);
                            log.log("convert base64Str2Json [str] = ", str);
                            return JSON.parse(str);
                        } catch (e) {
                            log.log("convert base64Str2Json 转换失败", e);
                        }
                        return null;
                    },
                    json2Base64Str : function(obj) {
                        log.log("convert json2Base64Str [old obj] = ", obj);
                        try {
                            if (isEmpty(obj)) {
                                return null;
                            }
                            return base64.encode(JSON.stringify(obj));
                        } catch (e) {
                            log.log("convert json2Base64Str 转换失败", e);
                        }
                        return null;
                    },
                    json2Str : function(obj) {
                        log.log("convert json2Str [old obj] = ", obj);
                        try {
                            if (isEmpty(obj)) {
                                return null;
                            }
                            return JSON.stringify(obj);
                        } catch (e) {
                            log.log("convert json2Str 转换失败", e);
                        }
                        return null;
                    },
                    obj2Str : obj2Str,
                    mergeJson : function(obj1, obj2) {
                        var result = {};
                        obj1 = obj1 || {};
                        obj2 = obj2 || {};
                        for (var i in obj1) {
                            result[i] = obj1[i];
                        }
                        for (var i in obj2) {
                            var temp = result[i];
                            if (isEmpty(temp)) {
                                result[i] = obj2[i];
                            }
                        }
                        return result;
                    },
                    convertArray2Str : function(obj, convertColIndex) {
                        if (isEmpty(obj)) {
                            return "";
                        } else if (isArray(obj)
                            && (isEmpty(convertColIndex) || convertColIndex <= 0)) {
                            return obj.join(",");
                        } else if (isArray(obj) && convertColIndex >= 1) {
                            var ret = new Array();

                            for (var i = 0; i < obj.length; i++) {
                                if (isEmpty(obj[i])
                                    || obj[i].length < convertColIndex) {
                                    continue;
                                }
                                ret.push(obj[i][convertColIndex - 1]);
                            }
                            return ret.join(",");
                        }
                        return obj;
                    }
                }
            }
        };
    })();

    // 将UmsTool暴露到window下，使其全局可以使用。
    window.UmsTool = UmsTool;

    // ////////////////////// static constant//////////////////////////////
    var UmsCons = (function() {
        return {
            CALL_RESULT_STATUS : {
                SUCCESS : "success",
                ERROR : "error",
                TIMEOUT : "timeout",
                CANCEL : "cancel"
            },
            NOTIFICATION : {
                ALERT_TYPE : {
                    DIALOG : "dialog",
                    TOAST : "toast"
                },
                MSG_TYPE : {
                    TIP : "0",
                    WARNING : "1",
                    ERROR : "2"
                },
                DEFAULT : {
                    TITLE_TIP : "提示",
                    TITLE_WARNING : "警告",
                    TITLE_ERROR : "错误",
                    TITLE : "提示",
                    BTNNAMES : "确定",
                    MSG : "提示信息",
                    SELECT_INDEX : 0
                }
            },
            LOCATION : {
                METHOD : {
                    GET_LOCATION : "getLocation",
                    GET_AREA : "getArea"
                }
            },
            LOG : {
                LOG_TYPE : {
                    INFO : "info",
                    ERROR : "error",
                    DEBUG : "debug",
                    WARNING : "warning"
                }
            },
            PAGE : {
                DEFAULT_FORWARD_TYPE : {
                    BIZ : "ums://biz/",
                    NATIVE : "ums://page/"
                },
                URL_PARAM_TAG : "?param=",
                URL_SEPARATOR : "/",
                BACK_METHOD : {
                    PAGE_BACK: "goBack",
                    GO_HOME : "goHome"
                }
            },
            VOICE : {
                QUEUE_MODE : {
                    ADD : "add",
                    FLUSH : "flush"
                }
            },
            OPEN_WEB_PAGE : {
                METHOD : {
                    BY_SELF : "bySelf",
                    BY_SYSBROWSER : "bySysBrowser"
                }
            },
            GET_CARD_INFO : {
                BOX_TYPE : {
                    SQUARE : "square",
                    MPOS : "mpos"
                }
            },
            GET_CARD_DETAIL : {
                METHOD : {
                    BY_CARD_NUMBER : "byCardNumber",
                    BY_TRACK : "byTrack"
                }
            },
            FILE_TRANSFER : {
                DEFAULT : {
                    FILE_TYPE : "png",
                    FILE_NAME : "file",
                    MIME_TYPE : "image/png"
                },
                METHOD : {
                    UPLOAD : "upload"
                }
            },
            ENCRYPT_BY_PIN_PAD : {
                SECURITY_KEY_TYPE : {
                    OPEN_FRONT : 100001,
                    VA_FRONT : 100002,
                    MOBILE_FRONT: 100003
                }
            },
            APDU : {
                METHOD : {
                    POWER_ON : "powerOn",
                    POWER_OFF : "powerOff",
                    SEND_APDU : "sendApdu"
                }
            },
            IBEACONS : {
                METHOD : {
                    START_IBEACONS : "startIBeacons",
                    STOP_IBEACONS : "stopIBeacons"
                }
            },
            SHARE : {
                METHOD : {
                    SHOW_SHARE : "showShare",
                    SHOW_SHARE_VIEW : "showShareView"
                }
            },
            CONTACTS : {
                METHOD : {
                    PICK_CONTACT : "select",
                    FILTER_CONTACTS : "find"
                }
            },
            POSITION : {
                METHOD : {
                    GET_LOCATION: "getLocation",
                    GET_AREA : "getArea",
                    GET_LOCATION_AND_AREA : "getLocationAndArea"
                }
            },
            ERROR_INFO : {
                SHOW_SELECT_DATA_NULL : "选择列表参数为空",
                SET_TITLE_DATA_NULL: "要设置的页面title为空",
                UMSAPI_ONCALLBACK_RESPONSE_NULL : "API响应信息为空",
                UMSAPI_ONCALLBACK_RESPONSE_INFO_NULL : "API响应的INFO为空",
                UMSAPI_ONCALLBACK_RESPONSE_DATA_NULL : "API响应的DATA为空",
                UMSAPI_ONCALLBACK_RESPONSE_BIZ_DATA_NULL : "API响应的BIZDATA为空",
                UMSAPI_ONCALLBACK_RESPONSE_CANCEL : "API响应为取消状态",
                UMSAPI_ONCALLBACK_RESPONSE_ERROR : "API响应为错误状态",
                UMSAPI_ONCALLBACK_RESPONSE_TIMEOUT : "请求超时",
                UMSAPI_ONCALLBACK_RESPONSE_UNKNOWN : "未知错误",
                UMSAPI_RESPONSE_EVENTNAME_NULL : "通知的事件名称为空",
                SET_GLOBAL_REQUEST_DATA_NULL : "要设置的全局变量为空",
                SET_GLOBAL_REQUEST_DATA_NOT_JSON : "要设置的全局变量不是一个json",
                LOCAL_DATA_REQUEST_DATA_KEY_NULL : "请求的KEY为空",
                LOCAL_DATA_REQUEST_DATA_SUBKEY_NULL : "请求的SUBKEY为空",
                LOCAL_DATA_REQUEST_DATA_SUBVALUE_NOT_JSON : "请求的SUBVALUE不是一个json",
                REGISTER_API_REQUEST_TYPE_NULL : "请求的TYPE为空",
                REGISTER_API_REQUEST_ACTION_NULL : "请求的ACTION为空",
                REGISTER_API_REQUEST_REFLECT_CLAZZ_NULL : "请求的REFLECT_CLAZZ为空",
                CALL_REQUEST_URI_NULL : "请求的URI为空",
                CALL_REQUEST_APPID_NULL : "请求的APPID为空",
                CALL_RESPONSE_DATA_NULL : "网络通讯异常,请稍后再试",
                CALL_RESPONSE_BIZ_DATA_NULL : "网络通讯返回报文数据异常,请稍后再试",
                CALL_RESPONSE_CANCEL : "主动取消请求",
                CALL_RESPONSE_TIMEOUT : "网络通讯异常,请稍后再试",
                FORWARD_REQUEST_URL_NULL : "要打开的页面地址为空",
                FORWARD_REQUEST_PAGE_NULL : "要打开的页面名称为空",
                FORWARD_REQUEST_CODE_NULL : "要打开的页面业务编码为空",
                FORWARD_REQUEST_DATA_NOT_JSON : "要打开的页面请求参数不是json",
                FORWARD_SALESLIP_REQUEST_ORDERID_NULL : "跳转到签购单的订单号为空",
                PAY_REQUEST_DATA_NULL : "打开支付页面时请求参数为空",
                PAY_REQUEST_DATA_NOT_JSON : "打开支付页面时请求参数不是json",
                PAY_RESPONSE_DATA_NULL : "支付返回异常,请稍后再试",
                PAY_RESPONSE_BIZ_DATA_NULL : "支付返回报文数据异常,请稍后再试",
                PAY_RESPONSE_PAY_RESULT_NULL : "支付返回报文数据异常,请稍后再试",
                PAY_RESPONSE_CANCEL : "主动取消请求",
                PAY_RESPONSE_TIMEOUT : "网络通讯异常,请稍后再试",
                PAY_RESPONSE_UNKNOWN : "网络通讯异常,请稍后再试",
                PAY_RESPONSE_ERROR : "网络通讯异常,请稍后再试",
                OFFLINE_REQUEST_IDENTIFIER_NULL : "请求脱机数据的唯一标识为空",
                PRINT_REQUEST_CONTEXT_NULL : "要打印的内容为空",
                VOICE_REQUEST_QUEUEMODE_ERROR : "播放语音的播放模式不正确",
                OPENTEL_REQUEST_PHONENUMBER_NULL : "要拨打的电话号码为空",
                GETCARD_REQUEST_BOX_TYPE_ERROR : "盒子类型不正确",
                GETCARD_REQUEST_CARD_NUMBER_NULL : "卡号信息为空",
                GETCARD_REQUEST_TRACK2_NULL : "二磁道为空",
                GETCARD_REQUEST_BOX_ID_NULL : "设备号为空",
                GETCARD_REQUEST_TRACK_KSN_NULL : "磁道KSN为空",
                GETCARD_REQUEST_TRACK2_DATA_KSN_NULL : "二磁道数据KSN为空",
                FILETRANSFER_REQUEST_FILE_URI_NULL : "文件地址为空",
                FILETRANSFER_REQUEST_SERVER_URI_NULL : "服务器上传地址为空",
                ENCRYPT_BY_PIN_PAD_REQUEST_SECURITY_KEY_TYPE_ERROR : "密钥类型不正确",
                ENCRYPT_BY_PIN_PAD_REQUEST_INPUT_MAX_LESS_THAN_MIN_ERROR : "最大长度小于最小长度",
                APDU_REQUEST_APDU_NULL : "apdu为空",
                IBEACONS_UUID_ARR_NULL: "iBeacons设备的UUID数组为空",
                SHARE_REQUEST_PROC_STATUS_NULL : "业务状态为空",
                SHARE_REQUEST_SHARE_TYPE_NULL : "分享类型为空",
                POS_TONG_FAST_PAY_REQUEST_DATA_NULL : "POS通远程快捷支付请求参数为空",
                POS_TONG_FAST_PAY_REQUEST_DATA_NOT_JSON : "POS通远程快捷支付请求参数不是json",
                SHOW_PAYMENT_CENTER_REQUEST_DATA_NULL : "打开支付中心时请求参数为空",
                SHOW_PAYMENT_CENTER_REQUEST_DATA_NOT_JSON : "打开支付中心时请求参数不是json",
                FILTER_CONTACTS_FIELDS_NOT_ARRAY : "要查找的联系人的属性不是数组",
                COPY_TO_CLIPBOARD_CONTENT_NULL : "要复制到剪贴板的内容为空",
                UMENG_EVENT_REQUEST_EVENT_ID_NULL : "用户行为统计事件ID为空"
            }
        };
    })();

    // ///////////////////////// js to app /////////////////////////////////
    var UmsApiDefaultFunc = (function() {
        return {
            syncFunc : function(data, funcName, msgs, successCallbackFunc, isBizDataCanEmpty) {
                UmsTool.console.log("call default sync callback func", funcName);
                successCallbackFunc = successCallbackFunc || this.nothingFunc;
                msgs = UmsTool.data.convert.mergeJson(msgs, {
                    dataIsNull : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_DATA_NULL,
                    bizDataIsNull : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_BIZ_DATA_NULL,
                    cancel : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_CANCEL,
                    error : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_ERROR,
                    timeout : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_TIMEOUT,
                    unknown : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_UNKNOWN
                });
                var errInfo = !UmsTool.data.check.isEmpty(data)
                    && !UmsTool.data.check.isEmpty(data.errInfo) ? data.errInfo
                    + "(" + data.errCode + ")"
                    : null;
                if (UmsTool.data.check.isEmpty(data)) {
                    throw new Error(msgs.dataIsNull);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.CANCEL) {
                    throw new Error(msgs.cancel);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.TIMEOUT) {
                    throw new Error(msgs.timeout);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.ERROR) {
                    return new Error(errInfo || msgs.error);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.SUCCESS) {
                    if ((UmsTool.data.check.isEmpty(isBizDataCanEmpty) || isBizDataCanEmpty == false)
                        && UmsTool.data.check.isEmpty(data.bizData)) {
                        throw new Error(msgs.bizDataIsNull);
                    } else {
                        return successCallbackFunc(data.bizData, funcName);
                    }
                } else {
                    throw new Error(errInfo || msgs.unknown);
                }
            },
            syncBoolFunc : function(data, funcName, msgs, successCallbackFunc, isBizDataCanEmpty) {
                UmsTool.console.log("call default sync bool callback func", funcName);
                msgs = UmsTool.data.convert.mergeJson(msgs, {
                    dataIsNull : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_DATA_NULL,
                    bizDataIsNull : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_BIZ_DATA_NULL,
                    cancel : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_CANCEL,
                    error : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_ERROR,
                    timeout : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_TIMEOUT,
                    unknown : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_UNKNOWN
                });
                var errInfo = !UmsTool.data.check.isEmpty(data)
                    && !UmsTool.data.check.isEmpty(data.errInfo) ? data.errInfo
                    + "(" + data.errCode + ")"
                    : null;
                if (UmsTool.data.check.isEmpty(data)) {
                    UmsTool.console.log(msgs.dataIsNull);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.CANCEL) {
                    UmsTool.console.log(msgs.cancel);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.TIMEOUT) {
                    UmsTool.console.log(msgs.timeout);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.ERROR) {
                    UmsTool.console.log(errInfo || msgs.error);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.SUCCESS) {
                    if ((UmsTool.data.check.isEmpty(isBizDataCanEmpty) || isBizDataCanEmpty == false)
                        && UmsTool.data.check.isEmpty(data.bizData)) {
                        UmsTool.console.log(msgs.bizDataIsNull);
                    } else if (UmsTool.data.check.isEmpty(successCallbackFunc)) {
                        return true;
                    } else {
                        return successCallbackFunc(data.bizData);
                    }
                } else {
                    UmsTool.console.log(errInfo || msgs.unknown);
                }
                return false;
            },
            asyncFunc : function(data, funcName, msgs, successCallbackFunc,
                errorCallbackFunc, timeoutCallbackFunc, cancelCallbackFunc,
                isBizDataCanEmpty) {
                UmsTool.console.log("call default sync callback func", funcName);
                successCallbackFunc = successCallbackFunc || this.nothingFunc;
                errorCallbackFunc = errorCallbackFunc || this.defaultErrorFunc;
                timeoutCallbackFunc = timeoutCallbackFunc || this.defaultTimeoutFunc;
                cancelCallbackFunc = cancelCallbackFunc || this.defaultCancelFunc;
                msgs = UmsTool.data.convert.mergeJson(msgs, {
                    dataIsNull : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_DATA_NULL,
                    bizDataIsNull : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_BIZ_DATA_NULL,
                    cancel : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_CANCEL,
                    error : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_ERROR,
                    timeout : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_TIMEOUT,
                    unknown : UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_UNKNOWN
                });
                var errInfo = !UmsTool.data.check.isEmpty(data)
                    && !UmsTool.data.check.isEmpty(data.errInfo) ? data.errInfo
                    + "(" + data.errCode + ")"
                    : null;
                if (UmsTool.data.check.isEmpty(data)) {
                    return errorCallbackFunc(data, msgs.dataIsNull, funcName);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.TIMEOUT) {
                    return timeoutCallbackFunc(data, msgs.timeout, funcName);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.CANCEL) {
                    return cancelCallbackFunc(data, msgs.cancel, funcName);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.ERROR) {
                    return errorCallbackFunc(data, errInfo || msgs.error, funcName);
                } else if (data.callResultStatus === UmsCons.CALL_RESULT_STATUS.SUCCESS) {
                    if ((UmsTool.data.check.isEmpty(isBizDataCanEmpty) || !isBizDataCanEmpty)
                        && UmsTool.data.check.isEmpty(data.bizData)) {
                        return errorCallbackFunc(data, msgs.bizDataIsNull, funcName);
                    } else {
                        return successCallbackFunc(data.bizData, funcName);
                    }
                } else {
                    return errorCallbackFunc(data, errInfo || msgs.unknown, funcName);
                }
            },
            nothingFunc : function(data, funcName) {
                UmsTool.console.log("call default nothing func", funcName);
                return data;
            },
            defaultErrorFunc : function(data, msg, funcName) {
                UmsTool.console.log("call default timeout func", msg, funcName);
                UmsApi.notification.toast(msg);
                return data;
            },
            defaultTimeoutFunc : function(data, msg, funcName) {
                UmsTool.console.log("call default timeout func", msg, funcName);
                UmsApi.notification.toast(msg);
                return data;
            },
            defaultCancelFunc : function(data, msg, funcName) {
                UmsTool.console.log("call default cancel func", msg, funcName);
                return data;
            }
        };
    })();

    // ////////////////////// js to app//////////////////////////////
    var UmsApiBridge = (function() {
        var syncCallback = function(requestId, responseDataStr, callbackFunc) {
            UmsTool.console.log("call mySyncCallbackFunc start");
            var responseData = UmsTool.data.convert
                .base64Str2Json(responseDataStr);
            if (UmsTool.data.check.isEmpty(responseData)) {
                // 如果返回的内容不能被解析成json，则认为是一个异步操作
                return;
            }
            // 该请求是同步响应的，直接调用返
            UmsTool.requestMap.remove(requestId);
            if (UmsTool.data.check.isEmpty(responseData.data)) {
                // 如果返回的报文中没有数据，则提示
                UmsApi.notification
                    .toast(UmsCons.ERROR_INFO.UMSAPI_ONCALLBACK_RESPONSE_DATA_NULL);
                return;
            }
            return callbackFunc(responseData.data);
        };
        var callUms = function(type, action, requestData, customCallbackFunc) {
            UmsTool.console.log("call UmsApiBridge start");
            var requestParam = {};
            var requestId = UmsTool.common.uuid();
            var myCallbackFunc = undefined;
            var requestParamStr = undefined;
            var responseDataStr = undefined;
            requestParam.info = {
                "type" : type,
                "action" : action || "",
                "requestId" : requestId
            };
            requestParam.data = requestData || {};
            myCallbackFunc = customCallbackFunc
                || UmsApiDefaultFunc.nothingFunc;
            UmsTool.console.log("[requestId] = ", requestId, "[param] = ",
                requestParam, "[customCallbackFunc] = ", myCallbackFunc);
            UmsTool.requestMap.put(requestId, myCallbackFunc);
            requestParamStr = UmsTool.data.convert.json2Base64Str(requestParam);
            if (UmsTool.data.check.isEmpty(requestParamStr)) {
                alert("call UmsApiBridge error, request is empty");
                return;
            }
            responseDataStr = window.prompt(requestParamStr, UmsTool.base64
                .encode("umsApi"));
            UmsTool.console.log("call UmsApiBridge sync callback",
                "[responseDataStr] =", responseDataStr);
            return syncCallback(requestId, responseDataStr, myCallbackFunc);
        };
        return {
            invoke : callUms
        };
    })();

    // ////////////////////// app to js//////////////////////////////

    /**
     * app的异步回调该js函数
     *
     * 1.判断响应对象是否是经过base64转码的json字符串，如果不是则退出
     *
     * 2.判断响应对象里是否有info属性，如果没有则退出
     *
     * 3.根据响应对象的info里的requestId值，从请求堆栈中获得处理方法
     *
     * 4.如果处理方法为空，则退出，如果不为空则进行处理。
     */
    UmsApi.onCallback = function(responseData, customCallbackFunc) {
        UmsTool.console.log("UmsApi onCallback start", "[responseData] = ", responseData);

        setTimeout(function() {
        	if (!UmsTool.data.check.isEmpty(customCallbackFunc)) {
        		customCallbackFunc(responseData);
        	}
        }, 500);

        UmsTool.console.log("UmsApi onCallback end");
    };

    /**
     * 发送通知
     *
     * 1.判断通知名称是否为空，如果为空则退出
     *
     * 2.判断通知参数是否是经过base64转码的json字符串，如果是则转成json，如果出错则为空json对象
     *
     * 3.创建通知并发送
     */
    UmsApi.dispatchEvent = function(eventName, eventParam) {
        UmsTool.console.log("[eventName] = ", eventName, "[eventParam] = ", eventParam);

        var event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
        event.eventType = "message";
        event.eventParam = eventParam;

        setTimeout(function() {
            document.dispatchEvent(event);
        }, 500);

        UmsTool.console.log("UmsApi dispatchEvent end");
    };

    // ///////////////////////// js to app /////////////////////////////////
    UmsApi.notification = {
        dialog : function(msgType, title, msg, btnNames, customCallbackFunc) {
            // 异步 显示带确认的提示框
            alert(msg);
        },
        toast : function(msg) {
            // 异步 显示不带确认的提示框,延时后消失
        	alert(msg);
        },
        confirm : function(msg, btnNames, customCallbackFunc) {
            // 异步 显示带确认的提示框
            this.dialog(UmsCons.NOTIFICATION.MSG_TYPE.TIP,
                UmsCons.NOTIFICATION.DEFAULT.TITLE_TIP, msg, btnNames,
                customCallbackFunc);

            var data = {
                "info": {
                    "action": "dialog",
                    "type": "5001"
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "selectIndex": 0
                    }
                }
            };

            UmsApi.onCallback(data.data, customCallbackFunc);
        },
        tip : function(msg) {
            // 异步 显示带确认的提示框
            return this.dialog(UmsCons.NOTIFICATION.MSG_TYPE.TIP,
                UmsCons.NOTIFICATION.DEFAULT.TITLE_TIP, msg);
        },
        warning : function(msg) {
            // 异步 显示带确认的提示框
            return this.dialog(UmsCons.NOTIFICATION.MSG_TYPE.WARNING,
                UmsCons.NOTIFICATION.DEFAULT.TITLE_WARNING, msg);
        },
        error : function(msg) {
            // 异步 显示带确认的提示框
            return this.dialog(UmsCons.NOTIFICATION.MSG_TYPE.ERROR,
                UmsCons.NOTIFICATION.DEFAULT.TITLE_ERROR, msg);
        },
        showSelect : function(options, selectIndex, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 显示选择列表
            var data = {
                "info": {
                    "action": null,
                    "type": 5002
                },
                "data": {
                    "bizData": {
                        "selectIndex": 0
                    }
                }
            };

            UmsApi.onCallback(data.data.bizData, customSuccessCallbackFunc);
        },
        showSlidPane : function() {
            // 异步 显示侧滑列表
        },
        showTab : function() {
            // 异步 显示tab标签
        },
        setTitle : function(title, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 设置页面title
            if (UmsTool.data.check.isEmpty(title)) {
                this.toast(UmsCons.ERROR_INFO.SET_TITLE_DATA_NULL);
                return;
            }

            var param = {};
            param.title = title;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "setTitle", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc, true);
                } catch (e) {
                    this.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 1001
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        }
    };

    // ///////////////////////// js api /////////////////////////////////
    UmsApi.globalization = {
        getClientInfo : function(customSuccessCallbackFunc, customProcessFunc) {
            // 同步 获得客户端信息
            var data = {
                "info": {
                    "action": null,
                    "type": 1001
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "boxId": null,
                        "appName": "OPENSDKDEMO",
                        "screenDisplayWidth": "960",
                        "screenOrientation": "portrait",
                        "imei": "862652020636465",
                        "imsi": "460016541607233",
                        "type": "ANDROID",
                        "screenDisplayHeight": "1920",
                        "sysCode": "",
                        "version": "1.0.0"
                    }
                }
            };

            return data.data.bizData;
        },
        getUserInfo : function(customSuccessCallbackFunc, customProcessFunc) {
            // 同步 获得用户信息
            var data = {
                "info": {
                    "action": null,
                    "type": 1002
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "sex": "1",
                        "provinceCode": "31",
                        "countryCode": "0086",
                        "cityCode": "01",
                        "code": "000020019035",
                        "certificateType": "",
                        "country": "中华人民共和国",
                        "city": "上海市",
                        "certificateNumber": "",
                        "districtCode": "",
                        "nickName": "",
                        "email": "",
                        "isAuth": "01",
                        "address": "",
                        "name": "",
                        "province": "上海市",
                        "district": "",
                        "mobile": "18317159188"
                    }
                }
            };

            return data.data.bizData;
        },
        getLocation : function(customSuccessCallbackFunc, customProcessFunc) {
            // 同步 获得定位信息
            var data = {
                "info": {
                    "action": null,
                    "type": 1003
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "country": "中国",
                        "province": "江苏",
                        "city": "南京",
                        "district": "玄武区",
                        "latitude": "111.11",
                        "longitude": "22.22",
                        "coorType": "bd0911"
                    }
                }
            };

            return data.data.bizData;
        },
        getBoxInfo : function(customSuccessCallbackFunc, customProcessFunc) {
            // 同步 获得设备信息
            var data = {
                "info": {
                    "action": null,
                    "type": 1004
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "model": "ME31",
                        "isSupportedLCD": true,
                        "isUsbConnected": false,
                        "isSupportedIC": true,
                        "isSupportedBluetooth": true,
                        "isSupportedPrinter": true,
                        "isSupportedTrack2": true,
                        "isSupportedTrack1": true,
                        "isOldDevice": false,
                        "manufacturer": "Newland",
                        "batteryLevel": 2,
                        "isSupportedTrack3": true,
                        "firmwareVersion": "2.4",
                        "isSupportedPINPad": true,
                        "isCharging": false,
                        "hardwareVersion": "ME31FW_FULL_V2",
                        "isAIDLoaded": false,
                        "isRIDLoaded": false
                    }
                }
            };

            return data.data.bizData;
        },
        getNetworkStatus : function(customSuccessCallbackFunc, customProcessFunc) {
            // 同步 获得网络状态信息
            var data = {
                "info": {
                    "action": null,
                    "type": 1005
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "networkStatus": "wifi"
                    }
                }
            };

            return data.data.bizData;
        }
    };

    UmsApi.base = {
        log : {
            _print : function(action, logArguments) {
                // 同步 日志打印
                console.log(logArguments);
            },
            info : function() {
                return this._print(UmsCons.LOG.LOG_TYPE.INFO, arguments);
            },
            error : function() {
                return this._print(UmsCons.LOG.LOG_TYPE.ERROR, arguments);
            },
            debug : function() {
                return this._print(UmsCons.LOG.LOG_TYPE.DEBUG, arguments);
            },
            warning : function() {
                return this._print(UmsCons.LOG.LOG_TYPE.WARNING, arguments);
            }
        },
        registerApi : function(type, action, reflectClazz) {
            // 同步 注册api
            var data = {
                "info": {
                    "action": null,
                    "type": 2002
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            return true;
        },
        call : function(uri, options, appId, bizSuccessCallbackFunc,
            bizErrorCallbackFunc, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 网络通讯
            options.appName = "OPEN";

            options.customerId = "000070005051";

            // 伊利订购
//            options.boxId = "00011003130000579277";
//            options.billsMID = "123456789111115";
//            options.billsTID = "11115009";

            // 农产品额度充值和支付
            options.boxId = "00011003130000579253";
            options.billsMID = "103290070111234";
            options.billsTID = "77777777";

            if (UmsTool.data.check.isEmpty(uri)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.CALL_REQUEST_URI_NULL);
                return;
            } else if (UmsTool.data.check.isEmpty(appId)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.CALL_REQUEST_APPID_NULL);
                return;
            }

			bizSuccessCallbackFunc = bizSuccessCallbackFunc || UmsApiDefaultFunc.nothingFunc;
			bizErrorCallbackFunc = bizErrorCallbackFunc || UmsApiDefaultFunc.nothingFunc;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(
                        data,
                        "netcall",
                        {
                            dataIsNull : UmsCons.ERROR_INFO.CALL_RESPONSE_DATA_NULL,
                            bizDataIsNull : UmsCons.ERROR_INFO.CALL_RESPONSE_BIZ_DATA_NULL,
                            cancel : UmsCons.ERROR_INFO.CALL_RESPONSE_CANCEL,
                            timeout : UmsCons.ERROR_INFO.CALL_RESPONSE_TIMEOUT
                        },
                        customSuccessCallbackFunc || function(dataBiz) {
                            if (dataBiz.errCode === "0000") {
                                return bizSuccessCallbackFunc(dataBiz);
                            } else {
                                return bizErrorCallbackFunc(dataBiz);
                            }
                        },
                        customErrorCallbackFunc,
                        customTimeoutCallbackFunc,
                        customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var userInfo = sessionStorage.getItem("userInfo");

            if (UmsTool.data.check.isEmpty(userInfo)) {
                var clientInfo = {
                    "clientInfo": {
                        "clientId": "01",
                        "clientType": "IPHONE",
                        "clientVersion": "1.0.0"
                    }
                };

                var loginInfo = {
                    "loginName": "15827044798",
                    "password": "111111"
                };

                // 握手
                $.ajax({
                    type: "post",
                    url: "http://144.131.254.239:9822/api-portal-js-front/v1/session/handshake",
                    contentType: "text/plain",
                    dataType: "json",
                    data: JSON.stringify(clientInfo),
                    success: function(data) {
                        var sessionId = data.sessionId;

                        sessionStorage.setItem("sessionId", sessionId);

                        var param1 = {};
                        param1.bizData = loginInfo;
                        param1.envData = {};

                        // 获取用户信息
                        $.ajax({
                            type: "post",
                            url: "http://144.131.254.239:9822/api-portal-js-front/v1/cpuser/login",
                            contentType: "text/plain",
                            dataType: "json",
                            data: JSON.stringify(param1),
                            headers: {
                                "X-Session-ID": sessionId
                            },
                            success: function(data) {
                                console.log(data);

                                sessionStorage.setItem("userInfo", data.userInfo);

                                var param2 = {};
                                param2.appId = appId;
                                param2.bizData = options;
                                param2.envData = {};

                                // 获取具体数据
                                $.ajax({
                                    type: "post",
                                    url: "http://144.131.254.239:9822/api-portal-js-front" + uri,
                                    contentType: "text/plain;charset=UTF-8",
                                    dataType: "json",
                                    data: JSON.stringify(param2),
                                    headers: {
                                        "X-Session-ID": sessionId
                                    },
                                    success: function(data) {
                                        console.log(data);

                                        var bizData = data;

                                        data = {};

                                        data.callResultStatus = "success";
                                        data.errCode = "0000";
                                        data.errInfo = "成功";

                                        data.bizData = bizData;

                                        myProcessFunc(data);
                                    },
                                    error: function(data) {
                                        alert("error when get data : " + JSON.stringify(data));
                                    }
                                });
                            },
                            error: function(data) {
                                alert("error when login : " + JSON.stringify(data));
                            }
                        });
                    },
                    error: function(data) {
                        alert("error when get sessionId : " + JSON.stringify(data));
                    }
                });
            } else {
                var sessionId = sessionStorage.getItem("sessionId");

                var param = {};
                param.appId = appId;
                param.bizData = options;
                param.envData = {};

                // 获取具体数据
                $.ajax({
                    type: "post",
                    url: "http://144.131.254.239:9822/api-portal-js-front" + uri,
                    contentType: "text/plain;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(param),
                    headers: {
                        "X-Session-ID": sessionId
                    },
                    success: function(data) {
                        console.log(data);

                        var bizData = data;

                        data = {};

                        data.callResultStatus = "success";
                        data.errCode = "0000";
                        data.errInfo = "成功";

                        data.bizData = bizData;

                        myProcessFunc(data);
                    },
                    error: function(data) {
                        alert("error when get data : " + JSON.stringify(data));
                    }
                });
            }
        }
    };

    UmsApi.data = {
        global : {
            get : function() {
                // 同步 获得全局变量数据
                var data = {
                    "info": {
                        "action": "get",
                        "type": 4001
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "key": "value"
                        }
                    }
                };

                return data.data.bizData;
            },
            set : function(globalData) {
                // 同步 设置全局数据
                var data = {
                    "info": {
                        "action": "set",
                        "type": 4001
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success"
                        }
                    }
                };

                return true;
            }
        },
        local : {
            get : function(key, customSuccessCallbackFunc, customProcessFunc) {
                // 同步 获取本地静态数据
                var data = {
                    "info": {
                        "action": "get",
                        "type": 4002
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "key": "value"
                        }
                    }
                };

                return data.data.bizData;
            },
            set : function(key, subKey, subValue, customSuccessCallbackFunc, customProcessFunc) {
                // 同步 更新或新增本地静态数据
                var data = {
                    "info": {
                        "action": "set",
                        "type": 4001
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success"
                        }
                    }
                };

                return true;
            },
            remove : function(key, subKey, customSuccessCallbackFunc, customProcessFunc) {
                // 同步 删除本地静态数据
                var data = {
                    "info": {
                        "action": "set",
                        "type": 4001
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success"
                        }
                    }
                };

                return true;
            }
        }
    };

    UmsApi.page = {
        forward : function(url) {
            // 异步 页面跳转
        	var indexOfBIZ = url.indexOf("BIZ");

        	if (indexOfBIZ != -1) {
        		url = "http://localhost:8080/qmf-biz-resource-open/test/"
                    + url.substring(indexOfBIZ);
        	}

            window.location.href = url;
        },
        forwardBizPageByRelativeUrl : function(page, data) {
            // 异步 打开资源包页面
            data = data || {};
            if (UmsTool.data.check.isEmpty(page)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_REQUEST_PAGE_NULL);
                return;
            } else if (!UmsTool.data.check.isObject(data)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_REQUEST_DATA_NOT_JSON);
                return;
            }
            return this.forward(page + UmsCons.PAGE.URL_PARAM_TAG
                + UmsTool.data.convert.json2Base64Str(data));
        },
        forwardBizPageByAbsoluteUrl : function(code, path, data) {
            // 异步 打开资源包页面
            data = data || {};
            if (UmsTool.data.check.isEmpty(code)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_REQUEST_CODE_NULL);
                return;
            } else if (UmsTool.data.check.isEmpty(path)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_REQUEST_PAGE_NULL);
                return;
            } else if (!UmsTool.data.check.isObject(data)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_REQUEST_DATA_NOT_JSON);
                return;
            }
            return this.forward(UmsCons.PAGE.DEFAULT_FORWARD_TYPE.BIZ + code
                + UmsCons.PAGE.URL_URL_SEPARATOR + path + UmsCons.PAGE.URL_PARAM_TAG
                + UmsTool.data.convert.json2Base64Str(data));
        },
        forwardNativePage : function(name, data) {
            // 异步 打开本地页面
            data = data || {};
            if (!UmsTool.data.check.isObject(data)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_REQUEST_DATA_NOT_JSON);
                return;
            }
            return this.forward(UmsCons.PAGE.DEFAULT_FORWARD_TYPE.NATIVE + name
                + UmsCons.PAGE.URL_PARAM_TAG + UmsTool.data.convert.json2Base64Str(data));
        },
        back : function(backNum) {
            // 异步 回退页面
            window.history.back();
        },
        backToNativeHome : function() {
            // 异步 回退到客户端首页
            window.history.back();
        },
        pay : function(requestData, customSuccessCallbackFunc,
           customErrorCallbackFunc, customTimeoutCallbackFunc,
           customCancelCallbackFunc, customProcessFunc) {
            // 异步 打开支付页面
            var data = {
                "info":{
                    "action": "",
                    "type": 3003,
                    "requestId": "65F75C70-431B-4368-888D-4FF39984F2C1"
                },
                "data":{
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "payResult": {
                            "billsMercName": "",
                            "respCode": "00",
                            "errInfo": "[更新订单成功,订单支付成功]",
                            "pAccount": "6214830271460111",
                            "balance": "20000",
                            "PAN": "6214830271460111",
                            "CLoadLimit": "100000",
                            "SingleLimit": "50000",
                            "Balance": "52000",
                            "discount": "500",
                            "totalMoney": "42000",
                            "Transactions": [{
                                "Amount": "1983",
                                "Time": "2015-06-30 14:22:08",
                                "Type": "消费",
                                "Merchant": "CHINAUMS MPOS"
                            }, {
                                "Amount": "9830",
                                "Time": "2015-07-15 17:35:42",
                                "Type": "消费",
                                "Merchant": "CHINAUMS MPOS"
                            }],
                            "refId": "000105400335",
                            "voucherNo": "006369",
                            "voucherDate": "0603",
                            "termId": "sj000002",
                            "batchNo": "000004",
                            "merchantId": "shouji000000002",
                            "callResultStatus": "success",
                            "orderId": "222015060328368301",
                            "operType": "22",
                            "acqNo": "48023010",
                            "txnType": "消费",
                            "issNo": "90880038",
                            "icCardData": "3F778E1DD49CB824EF03F61A714C288426B33BDDB26762B0E57B3F526306207DE7EA14DB247D1BBF",
                            "currencyCode": "156",
                            "liqDate": "",
                            "errCode": "0000",
                            "authNo": "",
                            "billsMID": "",
                            "dealDate": "2015\/06\/03 16:32:00",
                            "billsTID": "",
                            "expireDate": "1512",
                            "icCardDataKsn": "2000000000000495",
                            "voucherTime": "163012",
                            "salesSlip": "0",
                            "salesSlipDetails":[]
                        }
                    }
                }
            };

            UmsApi.onCallback(data.data.bizData, customSuccessCallbackFunc);
        },
        forwardSalesSlip : function(orderId, needSendSms,
            customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 打开签购单页面
			if (UmsTool.data.check.isEmpty(orderId)) {
				UmsApi.notification.toast(UmsCons.ERROR_INFO.FORWARD_SALESLIP_REQUEST_ORDERID_NULL);
				return;
			}

            var param = {};
			param.orderId = orderId;
			param.needSendSms = UmsTool.data.check.isEmpty(needSendSms) ? "0" : needSendSms;
			customSuccessCallbackFunc = customSuccessCallbackFunc || UmsApiDefaultFunc.nothingFunc;
			customErrorCallbackFunc = customErrorCallbackFunc || function(data, msg, funcName) {
                UmsApiDefaultFunc.defaultErrorFunc(data, msg, funcName);
                UmsApi.page.back(-1);
            };
			customTimeoutCallbackFunc = customTimeoutCallbackFunc || function(data, msg, funcName) {
                UmsApiDefaultFunc.defaultTimeoutFunc(data, msg, funcName);
                UmsApi.page.back(-1);
            };
			customCancelCallbackFunc = customCancelCallbackFunc || function(data, msg, funcName) {
                UmsApiDefaultFunc.defaultCancelFunc(data, msg, funcName);
                UmsApi.page.back(-1);
            };

			var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "netcall", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 3004
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        SPABack : function(backNum) {
            // 异步 回退页面
            window.history.back();
        },
        showShare : function(procStatus, shareType, mode, cipherNo,
            customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 打开客户端的分享页面
            if (UmsTool.data.check.isEmpty(procStatus)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.SHARE_REQUEST_PROC_STATUS_NULL);
                return;
            } else if (UmsTool.data.check.isEmpty(shareType)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.SHARE_REQUEST_SHARE_TYPE_NULL);
                return;
            }

            var param = {};
            param.procStatus = procStatus;
            param.shareType = shareType;
            param.mode = mode;
            param.cipherNo = cipherNo;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "showShare", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc, true);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "showShare",
                    "type": 3006
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        showShareView : function(procStatus, shareType, params,
            shareUrl, picPath, title, context, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 调用客户端的分享接口
            if (UmsTool.data.check.isEmpty(procStatus)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.SHARE_REQUEST_PROC_STATUS_NULL);
                return;
            } else if (UmsTool.data.check.isEmpty(shareType)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.SHARE_REQUEST_SHARE_TYPE_NULL);
                return;
            }

            var param = {};
            param.procStatus = procStatus;
            param.shareType = shareType;
            param.params = params;
            param.shareUrl = shareUrl;
            param.picPath = picPath;
            param.title = title;
            param.context = context;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "showShareView", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc, true);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "showShareView",
                    "type": 3006
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        showPaymentCenter : function(requestData, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 打开支付中心(第三方支付)
            if (UmsTool.data.check.isEmpty(requestData)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.SHOW_PAYMENT_CENTER_REQUEST_DATA_NULL);
                return;
            } else if (!UmsTool.data.check.isObject(requestData)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.SHOW_PAYMENT_CENTER_REQUEST_DATA_NOT_JSON);
                return;
            }

            var data = {
                "info":{
                    "action": "",
                    "type": 3007
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功"
                    }
                }
            };

            UmsApi.onCallback(data.data.bizData, customSuccessCallbackFunc);
        },
        posTongFastPay : function(requestData, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 POS通远程快捷(第三方支付)
            if (UmsTool.data.check.isEmpty(requestData)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.POS_TONG_FAST_PAY_REQUEST_DATA_NULL);
                return;
            } else if (!UmsTool.data.check.isObject(requestData)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.POS_TONG_FAST_PAY_REQUEST_DATA_NOT_JSON);
                return;
            }

            var data = {
                "info":{
                    "action": "",
                    "type": 3101
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功"
                    }
                }
            };

            UmsApi.onCallback(data.data.bizData, customSuccessCallbackFunc);
        }
    };

    UmsApi.device = {
        scanBarcode : function(customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 扫描二维码或条码
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "scanBarcode", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 6001
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "barCode": "123123123"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        getCardInfoBySwipingCard : function(customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 刷卡获得卡号和磁道号
            // 一代盒子 (cardNumber、track2)
            // 二代盒子 (cardNumber、trackKsn、track2DataKsn、boxSid)
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "getCardInfoBySwipingCard", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 6011
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "cardNumber": "6222 00** **** **** 448",
                        "trackKsn": "abc",
                        "track2DataKsn": "def",
                        "boxSid": "1231234234123123123"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        getOfflineData : function(identifier, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 获得脱机数据
            if (UmsTool.data.check.isEmpty(identifier)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.OFFLINE_REQUEST_IDENTIFIER_NULL);
                return;
            }

            var param = {};
            param.identifier = identifier;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "getOfflineData", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 6012
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "boxId": "12312323134123",
                        "offlineTransactionData": [{
                            "cardNumber": "482342123123",
                            "identifier": "012931023123023",
                            "orderId": "612015020326961342",
                            "transactionAmount": "12500",
                            "transactionId": "20150203201256",
                            "transactionTime": "20150203201256"
                        }]
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        print : function(printContext, printPageCount,
             customSuccessCallbackFunc, customErrorCallbackFunc,
             customTimeoutCallbackFunc, customCancelCallbackFunc,
             customProcessFunc) {
            // 异步 打印纸质签购单
            if (UmsTool.data.check.isEmpty(printContext)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.PRINT_REQUEST_CONTEXT_NULL);
                return;
            }

            var param = {};
            param.pageCount = printPageCount || 1;
            param.context = printContext;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "print", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 6021
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        synthesizeVoice : function(text, queueMode, options,
            customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 播放语音
            queueMode = queueMode || UmsCons.VOICE.QUEUE_MODE.FLUSH

            if (!(queueMode === UmsCons.VOICE.QUEUE_MODE.FLUSH || queueMode === UmsCons.VOICE.QUEUE_MODE.ADD)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.VOICE_REQUEST_QUEUEMODE_ERROR);
                return;
            }

            var param = options || {};
            param.defaultText = text || "";
            param.queueMode = queueMode;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "synthesizeVoice", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 6032
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "android": {
                            "text": "语音"
                        },
                        "ios": {
                            "text": "语音"
                        },
                        "defaultText": "语音",
                        "queueMode": "add"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        iBeacons : {
            startIBeacons : function(bizCode, uuidArr, customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步, 注册iBeacons监听
                if (UmsTool.data.check.isEmpty(uuidArr)) {
                    UmsApi.notification.toast(UmsCons.ERROR_INFO.IBEACONS_UUID_ARR_NULL);
                    return;
                }

                var param = {};
                param.bizCode = bizCode;
                param.uuidArr = uuidArr;

                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "startIBeacons", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc, true);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "startIBeacons",
                        "type": 6041
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功"
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            },
            stopIBeacons : function(uuidArr, customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步, 停止iBeacons监听
                if (UmsTool.data.check.isEmpty(uuidArr)) {
                    UmsApi.notification.toast(UmsCons.ERROR_INFO.IBEACONS_UUID_ARR_NULL);
                    return;
                }

                var param = {};
                param.UUIDArr = uuidArr;

                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "stopIBeacons", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc, true);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "stopIBeacons",
                        "type": 6041
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功"
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            }
        }
    };

    UmsApi.system = {
        openWebPage : {
            bySelf : function(url, title, isUseOriginalViewPort, customSuccessCallbackFunc) {
                // 异步 使用自带浏览器打开网页
                window.location.href = url;
            },
            bySysBrowser : function(url, title, isUseOriginalViewPort, customSuccessCallbackFunc) {
                // 异步 使用系统浏览器打开网页
                window.location.href = url;
            }
        },
        openTel : function(phoneNumber, customSuccessCallbackFunc) {
            // 异步 打开拨号盘
            if (UmsTool.data.check.isEmpty(phoneNumber)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.OPENTEL_REQUEST_PHONENUMBER_NULL);
                return;
            }

            var param = {};
            param.phoneNumber = phoneNumber;

            var myProcessFunc = customSuccessCallbackFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "openTel", null,
                        customSuccessCallbackFunc, null, null, null, true);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 7002
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        contacts : {
            choose : function(customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 打开通讯录, 从中选择电话号码信息
                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "pickContactPhone", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "select",
                        "type": 7003
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "phoneNumber": "13597454767",
                            "userName": "张三"
                        }
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            },
            query : function(filter, matchType, fields, maxNum,
                customSuccessCallbackFunc, customErrorCallbackFunc,
                customTimeoutCallbackFunc, customCancelCallbackFunc,
                customProcessFunc) {
                // 异步 根据参数对本地通讯录进行模糊查询
                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "filterContactPhones", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "find",
                        "type": 7003
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": [{
                            "phoneNumber": "13597454767",
                            "userName": "张三"
                        }, {
                            "phoneNumber": "13572315243",
                            "userName": "李四"
                        }]
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            }
        },
        position : {
            getLocation : function(customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 主动定位, 获取定位信息
                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "getLocation", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "getLocation",
                        "type": 7006
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "country": "中国",
                            "province": "江苏省",
                            "city": "南京市",
                            "district": "玄武区",
                            "street": "街道",
                            "latitude": "111.11",
                            "longitude": "22.22",
                            "coorType": "bd0911"
                        }
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            },
            getArea : function(customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 主动定位, 获取区域信息
                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "getArea", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "getArea",
                        "type": 7006
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "country": "中国",
                            "province": "江苏省",
                            "city": "南京市",
                            "cityCode": "0f0101"
                        }
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            },
            getLocationAndArea : function(customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 主动定位, 获取定位信息和区域信息
                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "getLocationAndArea", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "getLocationAndArea",
                        "type": 7006
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "location": {
                                "country": "中国",
                                "province": "江苏省",
                                "city": "南京市",
                                "district": "玄武区",
                                "street": "街道",
                                "latitude": "111.11",
                                "longitude": "22.22",
                                "coorType": "bd0911"
                            },
                            "area": {
                                "country": "中国",
                                "province": "江苏省",
                                "city": "南京市",
                                "cityCode": "0f0101"
                            }
                        }
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            },
            getLocationCity : function(customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 主动定位, 获取城市定位信息
                var myProcessFunc = customProcessFunc || function(data) {
                    try {
                        return UmsApiDefaultFunc.asyncFunc(data, "getLocationCity", null,
                            customSuccessCallbackFunc, customErrorCallbackFunc,
                            customTimeoutCallbackFunc, customCancelCallbackFunc);
                    } catch (e) {
                        UmsApi.notification.toast(e.message);
                    }
                };

                var data = {
                    "info": {
                        "action": "getLocationCity",
                        "type": 7006
                    },
                    "data": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "errInfo": "成功",
                        "bizData": {
                            "errCode": "0000",
                            "callResultStatus": "success",
                            "country": "中国",
                            "province": "江苏省",
                            "city": "南京市",
                            "district": "玄武区",
                            "street": "街道"
                        }
                    }
                };

                UmsApi.onCallback(data.data, myProcessFunc);
            }
        },
        getSoundState : function(customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 获取声音状态
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "getSoundState", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "",
                    "type": 7007
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "soundState": "muted"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        refreshWebView : function(customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 刷新WebView
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "refreshWebView", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc, true);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "",
                    "type": 7008
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        copyToClipboard : function(copyString, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 同步 蒋内容复制到剪贴板
            if (UmsTool.data.check.isEmpty(copyString)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.COPY_TO_CLIPBOARD_CONTENT_NULL);
                return;
            }

            var param = {};
            param.copyString = copyString;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.syncFunc(data, "copyToClipboard", null,
                        customSuccessCallbackFunc, true);
                } catch (e) {
                    UmsTool.console.log("call copyToClipboard default func error", e);
                    throw e;
                }
            };

            var data = {
                "info": {
                    "action": "",
                    "type": 7009
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            return data.data.bizData;
        }
    };

    UmsApi.service = {
        getCardDetail : {
            byCardNumber : function(cardNumber, customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 根据卡号获取卡片详情
                if (UmsTool.data.check.isEmpty(cardNumber)) {
                    UmsApi.notification.toast(UmsCons.ERROR_INFO.GETCARD_REQUEST_CARD_NUMBER_NULL);
                    return;
                }

                var param = {
                    "msgType": "71000018",
                    "account": cardNumber
                };

                UmsApi.base.call("/v1/mobile/generic/info", param, "appId", function(data) {
                    data.cardNumber = data.account;
                    customSuccessCallbackFunc(data);
                }, function(data) {
                    UmsApi.notification.error("获取卡信息出错");
                });
            },
            byTrack : function(track2, trackKsn, track2DataKsn, boxSid,
                customSuccessCallbackFunc, customErrorCallbackFunc,
                customTimeoutCallbackFunc, customCancelCallbackFunc,
                customProcessFunc) {
                // 异步 根据磁道号获取卡片详情
                var param = {};

                if (!UmsTool.data.check.isEmpty(track2)) {
                    // 一代盒子
                    param.msgType = "71000018";
                    param.track2 = track2;
                } else {
                    // 二代盒子
                    if (UmsTool.data.check.isEmpty(trackKsn)) {
                        UmsApi.notification.toast(UmsCons.ERROR_INFO.GETCARD_REQUEST_TRACK_KSN_NULL);
                        return;
                    }
                    if (UmsTool.data.check.isEmpty(track2DataKsn)) {
                        UmsApi.notification.toast(UmsCons.ERROR_INFO.GETCARD_REQUEST_TRACK2_DATA_KSN_NULL);
                        return;
                    }
                    if (UmsTool.data.check.isEmpty(boxSid)) {
                        UmsApi.notification.toast(UmsCons.ERROR_INFO.GETCARD_REQUEST_BOX_ID_NULL);
                        return;
                    }

                    param.msgType = "71000018";
                    param.trackKsn = trackKsn;
                    param.track2DataKsn = track2DataKsn;
                    param.boxSid = boxSid;
                }

                UmsApi.base.call("/v1/mobile/generic/info", param, "appId", function(data) {
                    data.cardNumber = data.account;
                    customSuccessCallbackFunc(data);
                }, function(data) {
                    UmsApi.notification.error("获取卡信息出错");
                });
            },
            bySwipingCard : function(customSuccessCallbackFunc,
                customErrorCallbackFunc, customTimeoutCallbackFunc,
                customCancelCallbackFunc, customProcessFunc) {
                // 异步 刷卡获取卡片详情
                UmsApi.device.getCardInfoBySwipingCard(function(data) {
                    UmsApi.service.getCardDetail.byCardNumber(data.cardNumber, function(data) {
                        data.cardNumber = data.account;
                        customSuccessCallbackFunc(data);
                    }, function(data) {
                        UmsApi.notification.error("获取卡信息出错");
                    });
                });
            }
        },
        uploadOfflineData : function(identifier, transactionId, boxId,
            customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 脱机数据上送
            if (UmsTool.data.check.isEmpty(identifier)) {
                UmsApi.notification
                    .toast(UmsCons.ERROR_INFO.OFFLINE_REQUEST_IDENTIFIER_NULL);
                return;
            }

            var param = {};
            param.identifier = identifier;
            param.transactionId = transactionId || "";
            param.boxId = boxId || "";

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "uploadOfflineData", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 8002
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "detail":{
                            "amount": 3,
                            "successCount": 1,
                            "errorCount": 1,
                            "timeoutCount":1
                        }
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        umengEvent : function(eventId, eventParam, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 同步 用户行为统计
            if (UmsTool.data.check.isEmpty(eventId)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.UMENG_EVENT_REQUEST_EVENT_ID_NULL);
                return;
            }

            var param = {};
            param.eventId = eventId;
            param.eventParam = eventParam;

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "umengEvent", null,
                        customSuccessCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 8004
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success"
                    }
                }
            };

            return data.data.bizData;
        }
    };

    UmsApi.file = {
        getPicture : function(options, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 获取图像媒体文件
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "getPicture", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 7004
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "imgData": "KDLSKJDFLSDJFLEIKLDLKFLILASLDKFLSKDKFJLSDKFJLIEFKDSFDSLF=",
                        "imgUri": "/var/mobile/Applications/017323CA-35C1-4D50-9CBA-DCC7C697FAF1/Documents/photos/file.jpg"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        getLocalFile : function(options, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 获取本地文件
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "getLocalFile", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 7005
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "fileUri": "/var/mobile/Applications/017323CA-35C1-4D50-9CBA-DCC7C697FAF1/Documents/photos/file.jpg"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        fileTransfer : function(fileUri, serverUri, options,
            customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 文件上传
            if (UmsTool.data.check.isEmpty(fileUri)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FILETRANSFER_REQUEST_FILE_URI_NULL);
                return;
            }

            if (UmsTool.data.check.isEmpty(serverUri)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.FILETRANSFER_REQUEST_SERVER_URI_NULL);
                return;
            }

            var param = {};
            param.fileUri = fileUri;
            param.serverUri = serverUri;
            param.options = UmsTool.data.convert.mergeJson(options || {}, {
                "fileType" : UmsCons.FILE_TRANSFER.DEFAULT.FILE_TYPE,
                "fileName" : UmsCons.FILE_TRANSFER.DEFAULT.FILE_NAME,
                "mimeType" : UmsCons.FILE_TRANSFER.DEFAULT.MIME_TYPE
            });

            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "fileTransfer", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 8003
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "errInfo": "成功",
                    "bizData": {
                        "errCode": "0000",
                        "callResultStatus": "success",
                        "fileUrl": "http://op.com/file/hello.png"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        }
    };

    UmsApi.security = {
        encryptByPinPad : function(options, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 根据密码键盘加密
            var param = UmsTool.data.convert.mergeJson(options || {}, {
                "securityKeyType" : UmsCons.ENCRYPT_BY_PIN_PAD.SECURITY_KEY_TYPE.VA_FRONT,
                "inputMinLength" : 3,
                "inputMaxLength" : 3,
                "inputType" : "1000"
            });

            if (!(param.securityKeyType === UmsCons.ENCRYPT_BY_PIN_PAD.SECURITY_KEY_TYPE.OPEN_FRONT
                || param.securityKeyType === UmsCons.ENCRYPT_BY_PIN_PAD.SECURITY_KEY_TYPE.VA_FRONT
                || param.securityKeyType === UmsCons.ENCRYPT_BY_PIN_PAD.SECURITY_KEY_TYPE.MOBILE_FRONT)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.ENCRYPT_BY_PIN_PAD_REQUEST_SECURITY_KEY_TYPE_ERROR);
                return;
            }
            if (param.inputMaxLength < param.inputMinLength) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.ENCRYPT_BY_PIN_PAD_REQUEST_INPUT_MAX_LESS_THAN_MIN_ERROR);
                return;
            }
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "encryptByPinPad", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": null,
                    "type": 8003
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "bizData": {
                        "encryptedContent": "abc"
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        }
    };

    UmsApi.apdu = {
        powerOn : function(customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 对IC卡进行加电
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "powerOn", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "powerOn",
                    "type": 6013
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "bizData": {

                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        powerOff : function(customSuccessCallbackFunc, customErrorCallbackFunc,
            customTimeoutCallbackFunc, customCancelCallbackFunc,
            customProcessFunc) {
            // 异步 对IC卡进行下电
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "powerOff", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "powerOn",
                    "type": 6013
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "bizData": {

                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        },
        sendApdu : function(apdu, customSuccessCallbackFunc,
            customErrorCallbackFunc, customTimeoutCallbackFunc,
            customCancelCallbackFunc, customProcessFunc) {
            // 异步 发送apdu
            if (UmsTool.data.check.isEmpty(apdu)) {
                UmsApi.notification.toast(UmsCons.ERROR_INFO.APDU_REQUEST_APDU_NULL);
                return;
            }
            var param = {};
            param.apdu = apdu;
            var myProcessFunc = customProcessFunc || function(data) {
                try {
                    return UmsApiDefaultFunc.asyncFunc(data, "sendApdu", null,
                        customSuccessCallbackFunc, customErrorCallbackFunc,
                        customTimeoutCallbackFunc, customCancelCallbackFunc);
                } catch (e) {
                    UmsApi.notification.toast(e.message);
                }
            };

            var data = {
                "info": {
                    "action": "powerOn",
                    "type": 6013
                },
                "data": {
                    "errCode": "0000",
                    "callResultStatus": "success",
                    "bizData": {
                        "apdu": "ABCDEFG",
                        "apduLength": 9
                    }
                }
            };

            UmsApi.onCallback(data.data, myProcessFunc);
        }
    };
})(window);

setTimeout(function() {
    UmsApi.dispatchEvent("deviceready", {param: "{\"city\":\"苏州\"}"});
}, 1000);
