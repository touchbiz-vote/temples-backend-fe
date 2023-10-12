import { defHttp } from '/@/utils/http/axios';

const tableId = 'cb26678c67b4465aa17a8a99e28c256a';

export enum Api {
  scheduleList = '/api/temples/schedule/list',
  disable = '/api/temples/schedule/disable/',
  enabled = '/api/temples/schedule/enabled/',
  save = '/online/cgform/api/form/' + tableId,
  get = '/online/cgform/api/form/',

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
 * 启用某一个活动schedule
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
