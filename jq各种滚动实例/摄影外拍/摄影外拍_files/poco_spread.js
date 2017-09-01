/**
 * Poco Spread srcipt
 * ÍÆ¹ã½Å±¾
 */
var spread_deal = {};
spread_deal['spread_oReq'] = null
spread_deal.crc32 = function(str) {
	var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

	var crc = 0;
	var x = 0;
	var y = 0;
	crc = crc ^ (-1);
	for(var i = 0, iTop = str.length; i < iTop; i++) {
		y = (crc ^ str.charCodeAt(i)) & 0xFF;
		x = "0x" + table.substr(y * 9, 8);
		crc = (crc >>> 8) ^ x;
	}
	var _int = crc ^ (-1);
	return _int < 0 ? (4294967296 + _int) : _int;
}

spread_deal.utf8_encode = function(argString) {
	if(argString === null || typeof argString === "undefined") {
		return "";
	}

	var string = (argString + '');
	var utftext = "", start, end, stringl = 0;
	start = end = 0;
	stringl = string.length;
	for(var n = 0; n < stringl; n++) {
		var c1 = string.charCodeAt(n);
		var enc = null;

		if(c1 < 128) {
			end++;
		}
		else
		if(c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
		}
		else {
			enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
		}
		if(enc !== null) {
			if(end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if(end > start) {
		utftext += string.slice(start, stringl);
	}

	return utftext;
}

spread_deal.base64_encode = function(data) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];

	if(!data) {
		return data;
	}
	data = spread_deal.utf8_encode(data + '');
	do {
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);
		bits = o1 << 16 | o2 << 8 | o3;
		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	}
	while (i < data.length);
	enc = tmp_arr.join('');

	var r = data.length % 3;

	return ( r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

spread_deal.simple_encode = function(string) {
	string = spread_deal.base64_encode(string);
	var verify_code = this.crc32(string);
	string = verify_code + '-' + string;
	var hash_str=spread_deal.create_hash() , new_str = '', str_length = string.length;
	hash_str = '034d97d5b3f39b6edbe42b4550d2a4897a789dec5e084163d60357887cb69c4c37f3d4d39f187f44';
	if( typeof (string) != 'string') {
		return false;
	}
	for(var i = 0; str_length > i; i++) {
		j = i % 80;
		new_str += String.fromCharCode(string.charCodeAt(i) ^ hash_str.charCodeAt(j));
	}
	return spread_deal.base64_encode(new_str);
}

spread_deal.get_spread_id = function(query) {
	var tmp = query.match(/spread_id=([0-9a-zA-Z]{4,})/);
	return tmp===null ? false : tmp[1];
	
}
function spread_clean() {
	spread_deal = __spread_id = __spread_str = spread_UA = null;
	setTimeout(function() {
		document.body.removeChild(document.getElementById('spread_tmp_i_tag'));
	}, 500)
}

function spread_set_info() {

	var element_obj = document.createElement('iframe');
	element_obj.src = 'http://imgtj.poco.cn/spread_iframe.html' + '?' + Math.random() + ( __spread_str ? ('&param=' + __spread_str) : '');
	element_obj.style.display = 'none';
	element_obj.id = 'spread_tmp_i_tag';
	if(spread_UA.indexOf('IE') > 0) {
		element_obj.attachEvent('onload', spread_clean);
	}
	else {
		element_obj.setAttribute('onload', 'spread_clean()');
	}

	document.body.appendChild(element_obj);
}

spread_deal.get_time = function(is_float) {
	if( typeof (is_float) == "undefined") {
		return Math.round(new Date().getTime() / 1000);
	}
	return new Date().getTime() / 1000 + Math.random() / 1000;
}

spread_deal.switch_time = function(spread_time, spread_now) {
	if( typeof (spread_time) != "string" || spread_time.indexOf(',') < 0) {
		return false;
	}
	var t = spread_time.split(',');
	return t[1] + "," + spread_now;
}

spread_deal.get_last_visit_time = function(spread_time) {
	if( typeof (spread_time) != "string" || spread_time.indexOf(',') < 0) {
		return false;
	}
	var t = spread_time.split(',');
	return t[1];
}

spread_deal.setcookie = function(name, value, expires, path, domain, secure) {
	var today = new Date();
	today.setTime(today.getTime());

	if(expires) {
		expires = Math.round(expires * 1000 * 60 * 60 * 24);
	}
	var expires_date = new Date(today.getTime() + (expires));
	document.cookie = name + "=" + escape(value) + ((expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + ((path ) ? ";path=" + path : "" ) + ((domain ) ? ";domain=" + domain : "" ) + ((secure ) ? ";secure" : "" );
}

spread_deal.get_cookie = function(check_name) {
	var a_all_cookies = document.cookie.split(';');
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false;
	for( i = 0; i < a_all_cookies.length; i++) {
		a_temp_cookie = a_all_cookies[i].split('=');
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		if(cookie_name == check_name) {
			b_cookie_found = true;
			if(a_temp_cookie.length > 1) {
				cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
			}
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if(!b_cookie_found) {
		return null;
	}
}

spread_deal.sha1 = function(str) {
	var rotate_left = function(n, s) {
		var t4 = (n << s) | (n >>> (32 - s));
		return t4;
	};
	var cvt_hex = function(val) {
		var str = "";
		var i;
		var v;

		for( i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
	str = this.utf8_encode(str);
	var str_len = str.length;

	var word_array = [];
	for( i = 0; i < str_len - 3; i += 4) {
		j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (str_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
			break;
		case 2:
			i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
			break;
		case 3:
			i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
			break;
	}

	word_array.push(i);

	while((word_array.length % 16) != 14) {
		word_array.push(0);
	}

	word_array.push(str_len >>> 29);
	word_array.push((str_len << 3) & 0x0ffffffff);

	for( blockstart = 0; blockstart < word_array.length; blockstart += 16) {
		for( i = 0; i < 16; i++) {
			W[i] = word_array[blockstart + i];
		}
		for( i = 16; i <= 79; i++) {
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
		}
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for( i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for( i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for( i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for( i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
	}
	temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	return temp.toLowerCase();
}

spread_deal.create_hash = function() {
	var d = new Date();
	if(d.getHours() <= 4) {
		d.setTime(d.getTime() - 86400000);
	}
	return spread_deal.sha1(d.getFullYear()+'-'+(d.getMonth() + 1)+'-'+d.getDate())+spread_deal.sha1((d.getMonth() + 1)+'-'+d.getDate()+'-'+d.getDay());
}
spread_deal.create_hash()
//start
var __spread_id = spread_deal.get_spread_id(location.href);
var __spread_now = spread_deal.get_time();
var __spread_expires = 0.125;
var __spread_ver = 10;
var __spread_domain = 'poco.cn';
var __spraed = spread_deal.get_cookie("__spread_str");

if( typeof (__spraed) == 'string' && __spraed.length > 0 && __spread_now - spread_deal.get_last_visit_time(spread_deal.get_cookie('__spread_time')) > 5 && spread_deal.crc32(document.referrer) != spread_deal.get_cookie('ref_hash')) {
	spread_deal.setcookie("__spread_time", spread_deal.switch_time(spread_deal.get_cookie('__spread_time'), __spread_now), __spread_expires, '/', __spread_domain);
	spread_deal.setcookie("__spread_frequency", parseInt(spread_deal.get_cookie('__spread_frequency')) + 1, __spread_expires, '/', __spread_domain);
	spread_deal.setcookie('ref_hash', spread_deal.crc32(document.referrer), __spread_expires, '/', __spread_domain);
}

else if( typeof (__spread_id) == 'string' && __spread_id.length >= 4 && typeof (__spraed) != 'string') {
	var __spread_str = __spread_id + "~" + document.referrer + "~" + spread_deal.get_time(true);
	__spread_str = spread_deal.simple_encode(__spread_str);
	spread_deal.setcookie("__spread_str", __spread_str, __spread_expires, '/', __spread_domain);
	spread_deal.setcookie("__spread_time", __spread_now+"," + __spread_now, __spread_expires, '/', __spread_domain);
	spread_deal.setcookie("__spread_frequency", "1", __spread_expires, '/', __spread_domain);
	spread_deal.setcookie('__spread_ti_out', __spread_now + 10800, 30, '/', __spread_domain);
	spread_deal.setcookie('__spread_ver', __spread_ver, __spread_expires, '/', __spread_domain);
	spread_deal.setcookie('ref_hash', spread_deal.crc32(document.referrer), __spread_expires, '/', __spread_domain);
	
}

if(typeof (__spread_id) == 'string' && __spread_id.length >= 4)
{
	var __spread_tmp_img = new Image();
	setTimeout(function() {
		__spread_tmp_img.src = "http://imgtj.poco.cn/imgtj_spread_first.css?referer_outside="+encodeURIComponent(document.referrer);
	}, 700);
}


if( typeof (__spraed) == 'string' && parseInt(spread_deal.get_cookie('__spread_ti_out')) <= __spread_now) {
	spread_deal.setcookie("__spread_str", '', -1, '/', __spread_domain);
	spread_deal.setcookie("__spread_time", '', -1, '/', __spread_domain);
	spread_deal.setcookie("__spread_frequency", '', -1, '/', __spread_domain);
	spread_deal.setcookie('__spread_ti_out', '', -1, '/', __spread_domain);
	spread_deal.setcookie('__spread_ver', '', -1, '/', __spread_domain);
}
/**
 * END
 */