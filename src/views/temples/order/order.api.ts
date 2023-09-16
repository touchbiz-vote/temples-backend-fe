import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

const tableId = '4028f8c98a844d8c018a844d8ca40000';

enum Api {
  list = '/online/cgform/api/getData/',
  save = '/test/jeecgDemo/add',
  edit = '/test/jeecgDemo/edit',
  get = '/test/jeecgDemo/queryById',
  enabled = '/api/temples/product/enabled/',
  disable = '/api/temples/product/disable/',
  delete = '/api/temples/product/',
  deleteBatch = '/test/jeecgDemo/deleteBatch',
  exportXls = '/test/jeecgDemo/exportXls',
  importExcel = '/test/jeecgDemo/importExcel',
}
/**
 * 导出api
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
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
export const saveOrUpdateDemo = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

/**
 * 查询示例详情
 * @param params
 */
export const getDemoById = (params) => {
  return defHttp.get({ url: Api.get, params });
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
