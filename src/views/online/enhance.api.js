var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => (x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected));
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { defHttp } from '/@/utils/http/axios';
import { isArray } from '/@/utils/is';
function getEnhanceJsByCode(code, type, params) {
  return __async(this, null, function* () {
    let { success, result } = yield defHttp.get(
      {
        url: '/online/cgform/head/enhanceJs/' + code,
        params: __spreadProps(__spreadValues({}, params), {
          type,
        }),
      },
      { isTransformResponse: false }
    );
    if (!success) {
      result = { cgJs: '' };
    }
    return result;
  });
}
const saveEnhanceJs = (code, params, isUpdate) => {
  let url = `${'/online/cgform/head/enhanceJs/'}${code}`;
  if (isUpdate) {
    return defHttp.put({ url, params }, { successMessageMode: 'none' });
  } else {
    return defHttp.post({ url, params }, { successMessageMode: 'none' });
  }
};
function getEnhanceJavaByCode(code, params) {
  return __async(this, null, function* () {
    let btnRes = yield defHttp.get({ url: '/online/cgform/head/enhanceButton/' + code }, { isTransformResponse: false });
    let btnList = [];
    if (btnRes.success && isArray(btnRes.result)) {
      btnList = btnRes.result.filter((item) => item.optType == 'action');
    }
    let path = `${'/online/cgform/head/enhanceJava'}/${code}`;
    let dataSource = yield defHttp.get({ url: path, params });
    return { btnList, dataSource };
  });
}
function doEnhanceJavaBatchDelete(idList) {
  return defHttp.delete(
    {
      url: '/online/cgform/head/deleteBatchEnhanceJava',
      params: {
        ids: idList.join(','),
      },
    },
    { joinParamsToUrl: true }
  );
}
const saveEnhanceJava = (code, params, isUpdate) => {
  let url = `${'/online/cgform/head/enhanceJava'}/${code}`;
  if (isUpdate) {
    return defHttp.put({ url, params });
  } else {
    return defHttp.post({ url, params });
  }
};
function getEnhanceSqlByCode(code, params) {
  return __async(this, null, function* () {
    let btnRes = yield defHttp.get({ url: '/online/cgform/head/enhanceButton/' + code }, { isTransformResponse: false });
    let btnList = [];
    if (btnRes.success && isArray(btnRes.result)) {
      btnList = btnRes.result.filter((item) => item.optType == 'action');
    }
    let path = `${'/online/cgform/head/enhanceSql'}/${code}`;
    let dataSource = yield defHttp.get({ url: path, params });
    return { btnList, dataSource };
  });
}
function doEnhanceSqlBatchDelete(idList) {
  return defHttp.delete(
    {
      url: '/online/cgform/head/deletebatchEnhanceSql',
      params: {
        ids: idList.join(','),
      },
    },
    { joinParamsToUrl: true }
  );
}
const saveEnhanceSql = (code, params, isUpdate) => {
  let url = `${'/online/cgform/head/enhanceSql'}/${code}`;
  if (isUpdate) {
    return defHttp.put({ url, params });
  } else {
    return defHttp.post({ url, params });
  }
};
export {
  getEnhanceJavaByCode as a,
  saveEnhanceJava as b,
  getEnhanceSqlByCode as c,
  doEnhanceJavaBatchDelete as d,
  saveEnhanceSql as e,
  doEnhanceSqlBatchDelete as f,
  getEnhanceJsByCode as g,
  saveEnhanceJs as s,
};
