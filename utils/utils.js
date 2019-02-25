import moment from 'moment';
import Intl from 'react-intl-universal';

// 判断是否不为空
export function _isNotNull(val){

  if (val === null || val === undefined) {
    return false;
  }
  if (typeof val === "string" && (val === "" || val.trim() === "")) {
    return false;
  }
  if (typeof val === "object" && val.length <= 0) {
    return false;
  }
  if(typeof val === "object") {
    return Object.keys(val).length !== 0;
  }
  return true;
}

// 时间格式化
export function _dateFormat(dataStr,format){

  //YYYY-MM-DD HH:mm
  format = format||'YYYY-MM-DD HH:mm:ss';
  if(dataStr){
    return moment(dataStr).format(format);
  }
  return moment().format(format);

}

// 链接下载
export function _download(sUrl) {

  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
    var link = document.createElement('a');
    link.href = sUrl;

    if (link.download !== undefined) {
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }

    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download';
  }

  window.open(sUrl, '_self');
  return true;
}
// 文件流下载文件生成;参数说明 binaryData:必传, fileName:必传(fileName加后缀mimeType可以不传), mimeType:非必传
export function _streamDownload(binaryData,fileName,mimeType) {

  if (mimeType) {
    let blob = new Blob([binaryData], {type: mimeType});
    let objectUrl = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = objectUrl;
    a.download = fileName||'Untitled';
    a.click();
    document.body.removeChild(a);
  }else {
    const blob = new Blob([binaryData]);
    let objectUrl = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = objectUrl;
    a.download = fileName||'Untitled';
    a.click();
    document.body.removeChild(a);
  }
}

// 删除为空的属性，isNotDel为true时 置为 ''
export function _delObjectUndefinedKey(obj,isNotDel) {
  let parsedValues = {};
  Object.keys(obj).reduce(function(total, currentKey){
    if( obj[currentKey] !== undefined && obj[currentKey] !== '' && obj[currentKey] !== null) {
      parsedValues[currentKey] = obj[currentKey];
    }else {
      if (isNotDel) {
        parsedValues[currentKey] = '';
      }
    }
  },parsedValues);
  return parsedValues;
}


/*
 * 将一个数组分成几个同等长度的数组
 * array[分割的原数组]
 * size[每个子数组的长度]
 */
export function sliceArray(array, size) {
  let result = [];
  for (let x = 0; x < Math.ceil(array.length / size); x++) {
    let start = x * size;
    let end = start + size;
    result.push(array.slice(start, end));
  }
  return result;
}

/**
 * [delUndefinedKey 删除JSON中values为undefined的属性]
 * @param  {JSON} obj 需要处理的JSON对象
 * @return {JSON}     处理后的JSON对象
 */
export function delUndefinedKey(obj) {
  let parsedValues = {};
  Object.keys(obj).reduce(function(total, currentKey){
    if( obj[currentKey] !== undefined ) {
      parsedValues[currentKey] = obj[currentKey];
    }
  },parsedValues)
  return parsedValues;
}

/**
 * 链式获取对象元素
 * @param  {Object} obj          顶级对象 parentObj
 * @param  {String} objUrl       链式获取的字符串 'parentObj.prop1.prop2.prop3'
 * @param  {any} defaultValue  取不到值时的默认返回，可以是任意类型
 * @return {any}              能到的值 或者 默认值
 */
export function _dataProp(obj, objUrl, defaultValue) {
  if (!obj) {
    return defaultValue;
  }
  const objList = objUrl.toString().split('.');
  objList.shift();
  let prop;
  const unGet = objList.some((item) => {
    prop = prop ? prop[item] : obj[item];
    return prop === undefined;
  });
  return unGet ? defaultValue : prop;
}
