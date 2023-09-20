import { defHttp } from '/@/utils/http/axios';

const tableId = 'cb26678c67b4465aa17a8a99e28c256a';

export enum Api {
  queryTreeSync = '/api/temples/location/queryTreeSync',
  save = '/online/cgform/api/form/' + tableId,
  delete = '/online/cgform/api/form/' + tableId,
  get = '/online/cgform/api/form/',
  exportXlsUrl = '/sys/sysDepart/exportXls',
  importExcelUrl = '/sys/sysDepart/importExcel',
  list = '/online/cgform/api/getData/',
  searchOrder = '/api/temples/order/search',
  assign = '/api/temples/tablets/assign/byOrder',
}

/**
 * 查询示例列表
 * @param params
 */
export const getList = (params) => {
  return defHttp.get({ url: Api.list + tableId, params });
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

export const assign = (params, handleSuccess) => {
  return defHttp.post({ url: Api.assign, params }).then(() => {
    handleSuccess();
  });
};

/**
 * 删除示例
 * @param params
 */
export const deleteTable = (table, handleSuccess) => {
  return defHttp.delete({ url: Api.delete + '/' + table.jeecg_row_key }).then(() => {
    handleSuccess();
  });
};
