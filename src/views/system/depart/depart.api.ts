import { defHttp } from '/@/utils/http/axios';

export enum Api {
  queryDepartTreeSync = '/sys/sysDepart/queryDepartTreeSync',
}

/**
 * 获取部门树列表
 */
export const queryDepartTreeSync = (params?) => defHttp.get({ url: Api.queryDepartTreeSync, params });
