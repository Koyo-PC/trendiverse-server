const charCodes = (str="") => { //input: (文字列) output: (コードポインタ値の配列)
    var i, len, arr;
    for(i=0,len=str.length,arr=[]; i<len; i++) {
      arr.push(str.charCodeAt(i));
    }
    return arr;
  };
  
  const scalarValues = (arr="") => { //input: (文字列またはコードポイント値の配列)
    var scalars = [], i, len, c;
    if (typeof arr === 'string') arr = charCodes(arr);
    for(i=0,len=arr.length; c=arr[i],i<len; i++) {
      if (c >= 0xd800 && c <= 0xdbff) {
        scalars.push((c & 1023) + 64 << 10 | arr[++i] & 1023);
      } else {scalars.push(c);}
    }
    return scalars;
  };
  
  const encodeUTF8 = (str="") => { //input: (文字列) output: (UTF-8形式の配列 2bytesずつ)
    var codes = charCodes(str), i, len, arr, c;
    for(i=0,len=codes.length,arr=[]; c=codes[i],i<len; i++) {
      if (c <= 0x7f) arr.push(c); //1byte
      else if (c <= 0x7ff) arr.push(0xc0|c>>>6, 0x80|c&0xbf); //2byte
      else if (c <= 0xdbff && c >= 0xd800) { //4byte
        //utf16  110110wwwwxxxxxx  110111xxxxxxxxxx
        //utf8   11110uuu  10uuxxxx  10xxxxxx  10xxxxxx (uuuuu = wwww+1)
        arr.push(
          0xf0 | (c=(c & 1023) + 64) >>> 8,
          0x80 | c >>> 2 & 63,
          0x80 | (c & 3) << 4 | (c=codes[++i] & 1023) >>> 6,
          0x80 | c & 63
        );
      } else if (c <= 0xffff) { //3byte
        arr.push(0xe0|c>>>12, 0x80|c>>>6&0xbf, 0x80|c&0xbf);
      }
    }
    return arr;
  };
  
  const encodeUTF16 = (str="", endian="") => { //input: (文字列, endian(任意、空白可)) output: (UTF-16形式の配列 2bytesずつ)
    var codes = charCodes(str), i, len, arr, c;
    arr = endian ? endian === 'LE' ? [0xff,0xfe] : [0xfe,0xff] : []; //BOM endian指定無しの場合はBE
    for(i=0,len=codes.length; c=codes[i],i<len; i++) {
      if (endian === 'LE') {
        arr.push(c & 0xff, c >>> 8 & 0xff);
      } else {
        arr.push(c >>> 8 & 0xff, c & 0xff);
      }
    }
    return arr;
  };
  
  const decodeUTF8 = (arr=[]) => { //input: (コードポインタ値の配列) output: (文字列)
    var i, len, c, str, char = String.fromCharCode;
    for(i=0,len=arr.length,str=""; c=arr[i],i<len; i++) {
      if (c <= 0x7f) str += char(c);
      else if (c <= 0xdf && c >= 0xc2) {
        str += char((c&31)<<6 | arr[++i]&63);
      } else if (c <= 0xef && c >= 0xe0) {
        str += char((c&15)<<12 | (arr[++i]&63)<<6 | arr[++i]&63);
      } else if (c <= 0xf7 && c >= 0xf0) {
        //utf8   11110uuu  10uuxxxx  10xxxxxx  10xxxxxx
        //utf16  110110wwwwxxxxxx  110111xxxxxxxxxx (wwww = uuuuu-1)
        str += char(
          0xd800 | ((c&7)<<8 | (arr[++i]&63)<<2 | arr[++i]>>>4&3) - 64,
          0xdc00 | (arr[i++]&15)<<6 | arr[i]&63
        );
      } else str += char(0xfffd);
    }
    return str;
  };
  
  const decodeUTF16 = (arr=[]) => { //input: (コードポインタ値の配列) output: (文字列)
    var endian = 'BE', i = 0, len, str;
    if (arr[0]*arr[1] === 0xff*0xfe) { // remove BOM
      endian = arr[0] === 0xff ? 'LE' : 'BE';
      i = 2;
    }
    for(len=arr.length,str=""; i<len; i+=2) {
      str += String.fromCharCode(endian === 'LE' ? (arr[i+1]<<8|arr[i]) : (arr[i]<<8|arr[i+1]));
    }
    return str;
  };
  
  const array_to_string = (bytes=[]) => { //input: (バイトの配列) output: (例: "48,198,48,185,48,200,216,60,223,122")
    let res = "", len = bytes.length;
    for(let i = 0; i < len; i++){
      res += bytes[i].toString();
      if(i < len-1) res += ",";
    }
    return res;
  }
  
  const string_to_array = (string="") => { //input: (例: "48,198,48,185,48,200,216,60,223,122") output: (バイトの配列)
    return string.split(",");
  }
  
  module.exports={
    charCodes: charCodes,
    scalarValues: scalarValues,
    encodeUTF8: encodeUTF8,
    encodeUTF16: encodeUTF16,
    decodeUTF8: decodeUTF8,
    decodeUTF16: decodeUTF16,
    array_to_string: array_to_string,
    string_to_array: string_to_array
  }