/**
 * 加密解密
 */

var crypto = require('crypto');
var authcode = function (str, operation, key, expiry){
    var operation = operation ? operation : 'DECODE';
    var key = key ? key : 'jkxy!@#$123';
    var ckey_length = 4;
    var expiry = expiry ? expiry : 0;

    key = md5(key);                             // 264a9be6908adca152cac7e8cebe2f2b
    var keya = md5(key.substr(0, 16));          // 密匙a会参与加解密
    var keyb = md5(key.substr(16, 16));         // 密匙b会用来做数据完整性验证
    var keyc = operation == 'DECODE' ?          // 密匙c用于变化生成的密文
        str.substr(0, ckey_length) :
        md5(microtime()).substr(-ckey_length);
    var cryptkey = keya + md5(keya + keyc);     // 参与运算的密匙

    var strbuf;                                 //str的base64
    if (operation == 'DECODE') {
        str = str.substr(ckey_length);
        strbuf = new Buffer(str, 'base64');
    }
    else {
        expiry = expiry ? expiry + time() : 0;
        tmpstr = expiry.toString();
        if (tmpstr.length >= 10)
            str = tmpstr.substr(0, 10) + md5(str + keyb).substr(0, 16) + str;
        else {
            var count = 10 - tmpstr.length;
            for (var i = 0; i < count; i++) {
                tmpstr = '0' + tmpstr;
            }
            str = tmpstr + md5(str + keyb).substr(0, 16) + str;
        }
        strbuf = new Buffer(str);
    }

    // 密匙簿
    var box    = new Array(256);
    var rndkey = new Array(256);
    for (var i = 0; i < 256; i++) {
        box[i] = i;
        rndkey[i] = cryptkey.charCodeAt(i % cryptkey.length);
    }
    // 用固定的算法，打乱密匙簿，增加随机性，好像很复杂，实际上对并不会增加密文的强度
    for (var j = i = 0; i < 256; i++) {
        j      = (j + box[i] + rndkey[i]) % 256;
        tmp    = box[i];
        box[i] = box[j];
        box[j] = tmp;
    }

    // 核心加解密部分
    var s = '';
    for (var a = j = i = 0; i < strbuf.length; i++) {
        a = (a + 1) % 256;
        j = (j + box[a]) % 256;
        tmp = box[a];
        box[a] = box[j];
        box[j] = tmp;
        // 从密匙簿得出密匙进行异或，再转成字符
        strbuf[i] = strbuf[i] ^ (box[(box[a] + box[j]) % 256])
    }

    if (operation == 'DECODE') {
        var s = strbuf.toString();
        if ((s.substr(0, 10) == 0 || s.substr(0, 10) - time() > 0) && s.substr(10, 16) == md5(s.substr(26) + keyb).substr(0, 16)) {
            s = s.substr(26);
        } else {
            s = '';
        }
    }
    else {
        var s = strbuf.toString('base64');
        var regex = new RegExp('=', "g");
        s = s.replace(regex, '');
        s = keyc + s;
    }
    return s;
}

// 32位MD5加密
function md5(str) {
    var hash = crypto.createHash('md5');
    return hash.update(str + "").digest('hex');
}

// UNIX时间戳和微秒数
function microtime(get_as_float) {
    var unixtime_ms = new Date().getTime();
    var sec = parseInt(unixtime_ms / 1000);
    return get_as_float ? (unixtime_ms / 1000) : (unixtime_ms - (sec * 1000)) / 1000 + ' ' + sec;
}

// UNIX时间戳
function time() {
    var unixtime_ms = new Date().getTime();
    return parseInt(unixtime_ms / 1000);
}

module.exports = authcode;