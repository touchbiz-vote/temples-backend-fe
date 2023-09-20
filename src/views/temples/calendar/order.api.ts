import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

const tableId = '4028f8c98a844d8c018a844d8ca40000';

enum Api {
  list = '/online/cgform/api/getData/',
  save = '/test/jeecgDemo/add',
  edit = '/test/jeecgDemo/edit',
  get = '/test/jeecgDemo/queryById',
  cancel = '/api/temples/order/',
  confirm = '/api/temples/order/confirm/',
  delete = '/api/temples/product/',
  deleteBatch = '/test/jeecgDemo/deleteBatch',
  exportXls = '/test/jeecgDemo/exportXls',
  importExcel = '/test/jeecgDemo/importExcel',
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
export const getImportUrl = Api.importExcel;
/**
 * 查询示例列表
 * @param params
 */
export const getList = (params) => {
  return defHttp.get({ url: Api.list + tableId, params });
};

/**
 * 上架
 * @param params
 */
export const cancel = (order, handleSuccess) => {
  return defHttp.delete({ url: Api.cancel + order.jeecg_row_key }).then(() => {
    handleSuccess();
  });
};

/**
 * 下架
 * @param params
 */
export const confirmOrder = (order, handleSuccess) => {
  return defHttp.post({ url: Api.confirm + order.jeecg_row_key }).then(() => {
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
