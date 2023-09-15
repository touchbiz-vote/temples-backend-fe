import { getAuthCache } from '/@/utils/auth';
import { DB_DICT_DATA_KEY } from '/@/enums/cacheEnum';
import { defHttp } from '/@/utils/http/axios';

/**
 * 从缓存中获取字典配置
 * @param code
 */
export const getDictItemsByCode = (code) => {
  if (getAuthCache(DB_DICT_DATA_KEY) && getAuthCache(DB_DICT_DATA_KEY)[code]) {
    return getAuthCache(DB_DICT_DATA_KEY)[code];
  }
};

/**
 * 获取字典数组
 * @param dictCode 字典Code
 * @return List<Map>
 */
export const initDictOptions = (code) => {
  //1.优先从缓存中读取字典配置
  if (getDictItemsByCode(code)) {
    return new Promise((resolve) => {
      resolve(getDictItemsByCode(code));
    });
  }
  //2.获取字典数组
  //update-begin-author:taoyan date:2022-6-21 for: 字典数据请求前将参数编码处理，但是不能直接编码，因为可能之前已经编码过了
  if (code.indexOf(',') > 0 && code.indexOf(' ') > 0) {
    // 编码后类似sys_user%20where%20username%20like%20xxx' 是不包含空格的,这里判断如果有空格和逗号说明需要编码处理
    code = encodeURI(code);
  }
  //update-end-author:taoyan date:2022-6-21 for: 字典数据请求前将参数编码处理，但是不能直接编码，因为可能之前已经编码过了
  return defHttp.get({ url: `/sys/dict/getDictItems/${code}` });
};

export async function fetchDataWithCache<T>(table: string, id: string): Promise<T> {
  const cacheKey = `${table}&id=${id}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    // 如果缓存中有数据，返回它
    return JSON.parse(cachedData);
  } else {
    try {
      // 如果缓存中没有数据，调用接口获取数据
      const data = await defHttp.get({ url: `/api/temples/data?table=${table}&id=${id}` });
      // 将获取的数据存入缓存
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching or caching data:', error);
      throw error;
    }
  }
}

/**
 * 获取字典数组
 * @param code 字典Code
 * @param params 查询参数
 * @param options 查询配置
 * @return List<Map>
 */
export const ajaxGetDictItems = (code, params, options?) => defHttp.get({ url: `/sys/dict/getDictItems/${code}`, params }, options);
