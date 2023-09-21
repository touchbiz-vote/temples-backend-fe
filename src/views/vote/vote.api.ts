import { defHttp } from '/@/utils/http/axios';

const tableId = 'cb26678c67b4465aa17a8a99e28c256a';

export enum Api {
  queryTreeSync = '/api/temples/location/queryTreeSync',
  save = '/online/cgform/api/form/' + tableId,

  get = '/online/cgform/api/form/',
}

// /**
//  * 查询示例列表
//  * @param params
//  */
// export const getList = (params) => {
//   return defHttp.get({ url: Api.list + tableId, params });
// };

/**
 * 查询详情
 * @param id
 */
export const getActivityDetail = (tableId, id) => {
  return defHttp.get({ url: Api.get + tableId + '/' + id });
};
