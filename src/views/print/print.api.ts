import { defHttp } from '/@/utils/http/axios';

const tableId = '20231016174250';

export enum Api {
  list = '/api/online/cgform/api/getData/',
  save = '/online/cgform/api/form/' + tableId,
  get = '/online/cgform/api/form/',
  delete = '/online/cgform/api/form/',
  printHost = '/sys/setting',
  enabled = '/api/temples/printTemplate/enabled/',
  disable = '/api/temples/printTemplate/disable/',
}
/**
 * 查询打印的系统配置
 * @param params
 */
export const getPrintHost = (params) => {
  return defHttp.get({ url: Api.printHost, params });
};

export const getTemplateContent = (id) => {
  const table = 't_print_template';
  return defHttp.get({ url: `/api/temples/data?table=${table}&id=${id}` });
};

export const getList = (params) => {
  return defHttp.get({ url: Api.list + tableId, params });
};

/**
 * 保存或者更新示例
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  return isUpdate ? defHttp.put({ url: Api.save, params }) : defHttp.post({ url: Api.save, params });
};

/**
 * 查询详情
 * @param id
 */
export const getById = (id) => {
  return defHttp.get({ url: Api.get + tableId + '/' + id });
};

/**
 * 查询详情
 * @param id
 */
export const enabled = (id) => {
  return defHttp.put({ url: Api.enabled + id });
};

/**
 * 查询详情
 * @param id
 */
export const disable = (id) => {
  return defHttp.put({ url: Api.disable + id });
};

/**
 * 删除示例
 * @param params
 */
export const deleteTemplate = (template, handleSuccess) => {
  return defHttp.delete({ url: Api.delete + tableId + '/' + template.jeecg_row_key }).then(() => {
    handleSuccess();
  });
};
