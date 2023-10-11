import { defHttp } from '/@/utils/http/axios';

const tableId = 'cb26678c67b4465aa17a8a99e28c256a';

export enum Api {
  scheduleList = '/api/temples/client/schedule/list',
  disable = '/api/temples/client/schedule/disable/',
  enabled = '/api/temples/client/schedule/enabled/',
  save = '/online/cgform/api/form/' + tableId,
  get = '/online/cgform/api/form/',

  searchOrder = '/api/temples/order/search',
  assign = '/api/temples/tablets/assign/byOrder',
}

/**
 * 查询日历列表
 * @param params
 */
export const getScheduleList = (params) => {
  return defHttp.get({ url: Api.scheduleList, params });
};

/**
 * 查询详情
 * @param id
 */
export const getById = (id) => {
  return defHttp.get({ url: Api.get + tableId + '/' + id });
};

/**
 * 获取牌位位置列表
 */
export const queryTreeSync = (params?) => defHttp.get({ url: Api.queryTreeSync, params });

/**
 * 获取牌位位置列表
 */
export const searchOrder = (params?) => {
  params.bizCode = 'tablets';
  return defHttp.get({ url: Api.searchOrder, params });
};

/**
 * 保存或者更新示例
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  return isUpdate ? defHttp.put({ url: Api.save, params }) : defHttp.post({ url: Api.save, params });
};

/**
 * 禁用某一个活动schedule
 * @param params
 */
export const enabled = (id, handleSuccess) => {
  return defHttp.post({ url: Api.enabled + id }).then(() => {
    handleSuccess();
  });
};

/**
 * 禁用某一个活动schedule
 * @param params
 */
export const disable = (id, handleSuccess) => {
  return defHttp.delete({ url: Api.disable + id }).then(() => {
    handleSuccess();
  });
};
