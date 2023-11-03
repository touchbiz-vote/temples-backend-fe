import { defHttp } from '/@/utils/http/axios';

const tableId = 'cb26678c67b4465aa17a8a99e28c256a';

export enum Api {
  cleanCase = '/api/biz/activity/case/clean/',
  generateImage = '/api/biz/activity/case/generateImage/',
  save = '/online/cgform/api/form/' + tableId,
  get = '/api/online/cgform/api/form/',
  searchAccount = '/api/online/cgform/api/getData/' + '4028f8c98ab5cd05018ab5cd05f30000',
  importExcel = '/api/biz/activity/case/import/',
  bindAccount = '/api/biz/activity/monitor/',
  deleteMonitor = '/api/biz/activity/monitor/',
}

/**
 * 查询详情
 * @param id
 */
export const searchAccount = (params) => {
  return defHttp.get({ url: Api.searchAccount, params });
};

/**
 * 查询详情
 * @param id
 */
export const getActivityDetail = (tableId, id) => {
  return defHttp.get({ url: Api.get + tableId + '/' + id });
};

export const cleanCase = (activityId) => {
  return defHttp.delete({ url: Api.cleanCase + activityId });
};

export const bindAccount = (activityId, ids, handleSuccess) => {
  return defHttp.post({ url: Api.bindAccount + activityId + '?ids=' + ids }).then(handleSuccess);
};

export const deleteMonitor = (id, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteMonitor + id }).then(handleSuccess);
};

export const generateImage = (caseId, handleSuccess) => {
  return defHttp.put({ url: Api.generateImage + caseId }).then(handleSuccess);
};
