import { defHttp } from '/@/utils/http/axios';

const tableId = '20231016174250';

export enum Api {
  list = '/online/cgform/api/getData/',
  save = '/online/cgform/api/form/' + tableId,
  get = '/online/cgform/api/form/',
  delete = '/api/temples/product/',
  printHost = '/sys/setting',
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
 * 删除示例
 * @param params
 */
export const deleteProduct = (product, handleSuccess) => {
  return defHttp.delete({ url: Api.delete + product.jeecg_row_key }).then(() => {
    handleSuccess();
  });
};
