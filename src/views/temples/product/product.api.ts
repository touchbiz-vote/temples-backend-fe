import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

const tableId = 'c37247320d744855bf85fac76f0cebfa';

enum Api {
  list = '/online/cgform/api/getData/',
  save = '/api/temples/product',
  get = '/online/cgform/api/form/',
  enabled = '/api/temples/product/enabled/',
  disable = '/api/temples/product/disable/',
  delete = '/api/temples/product/',
  deleteBatch = '/test/jeecgDemo/deleteBatch',
  exportXls = '/test/jeecgDemo/exportXls',
  importExcel = '/online/cgform/api/importXls/',
}

/**
 * 根据code获取字典数值
 * @param params
 */
export const ajaxGetDictItems = (params) => defHttp.get({ url: `/sys/dict/getDictItems/${params.code}` });

/**
 * 导出api
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel + tableId;
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


/**
 * 批量删除示例
 * @param params
 */
export const batchDeleteDemo = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
