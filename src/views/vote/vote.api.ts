import { defHttp } from '/@/utils/http/axios';

const tableId = 'cb26678c67b4465aa17a8a99e28c256a';

export enum Api {
  cleanCase = '/api/biz/activity/case/clean/',
  generateImage = '/api/biz/activity/case/generateImage/',
  save = '/online/cgform/api/form/' + tableId,
  importExcel = '/api/biz/activity/case/import/',
  get = '/online/cgform/api/form/',
}

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

export const generateImage = (caseId, handleSuccess) => {
  return defHttp.put({ url: Api.generateImage + caseId }).then(handleSuccess);
};
