import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

const tableId = 'c37247320d744855bf85fac76f0cebfa';

export enum Api {
  list = '/online/cgform/api/getData/',
  save = '/api/temples/product',
  get = '/online/cgform/api/form/',
  enabled = '/api/temples/product/enabled/',
  disable = '/api/temples/product/disable/',
  delete = '/api/temples/product/',
  batchDelete = '/online/cgform/api/form/',
  importExcel = '/api/online/cgform/api/importXls/',
  exportExcel = '/sys/common/exportXls/',
}

/**
 * 根据code获取字典数值
 * @param params
 */
export const ajaxGetDictItems = (params) => defHttp.get({ url: `/sys/dict/getDictItems/${params.code}` });

/**
 * 导入api
 */
export const getImportUrl = Api.importExcel + tableId;

export const getExportUrl = Api.exportExcel + tableId;
/**
 * 查询示例列表
 * @param params
 */
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

/**
 * 删除示例
 * @param params
 */
export const batchDelete = (ids, handleSuccess) => {
  return defHttp.delete({ url: Api.batchDelete + tableId + '/' + ids }).then(() => {
    handleSuccess();
  });
};

/**
 * 上架
 * @param params
 */
export const enable = (product, handleSuccess) => {
  return defHttp.put({ url: Api.enabled + product.jeecg_row_key }).then(() => {
    handleSuccess();
  });
};

/**
 * 下架
 * @param params
 */
export const disable = (product, handleSuccess) => {
  return defHttp.put({ url: Api.disable + product.jeecg_row_key }).then(() => {
    handleSuccess();
  });
};

