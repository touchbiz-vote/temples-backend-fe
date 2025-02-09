import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  listNoCareTenant = '/sys/user/listAll',
  list = '/sys/user/list',
  save = '/sys/user/add',
  edit = '/sys/user/edit',
  agentSave = '/sys/sysUserAgent/add',
  agentEdit = '/sys/sysUserAgent/edit',
  getUserRole = '/sys/user/queryUserRole',
  duplicateCheck = '/sys/duplicate/check',
  deleteUser = '/sys/user/delete',
  deleteBatch = '/sys/user/deleteBatch',
  importExcel = '/sys/user/importExcel',
  exportXls = '/sys/user/exportXls',
  recycleBinList = '/sys/user/recycleBin',
  putRecycleBin = '/sys/user/putRecycleBin',
  deleteRecycleBin = '/sys/user/deleteRecycleBin',
  allRolesList = '/sys/role/queryall',
  allRolesListNoByTenant = '/sys/role/queryallNoByTenant',
  userDepartList = '/sys/user/userDepartList',
  changePassword = '/sys/user/changePassword',
  frozenBatch = '/sys/user/frozenBatch',
  getUserAgent = '/sys/sysUserAgent/queryByUserName',
  syncUser = '/act/process/extActProcess/doSyncUser',
  userQuitAgent = '/sys/user/userQuitAgent',
  getQuitList = '/sys/user/getQuitList',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口(查询用户，通过租户隔离)
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 列表接口(查询全部用户，不通过租户隔离)
 * @param params
 */
export const listNoCareTenant = (params) => defHttp.get({ url: Api.listNoCareTenant, params });

/**
 * 用户角色接口
 * @param params
 */
export const getUserRoles = (params) => defHttp.get({ url: Api.getUserRole, params }, { errorMessageMode: 'none' });

/**
 * 删除用户
 */
export const deleteUser = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteUser, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除用户
 * @param params
 */
export const batchDeleteUser = (params, handleSuccess) => {
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
/**
 * 保存或者更新用户
 * @param params
 */
export const saveOrUpdateUser = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 唯一校验
 * @param params
 */
export const duplicateCheck = (params) => defHttp.get({ url: Api.duplicateCheck, params }, { isTransformResponse: false });
/**
 * 获取全部角色（租户隔离）
 * @param params
 */
export const getAllRolesList = (params) => defHttp.get({ url: Api.allRolesList, params });
/**
 * 获取全部角色（不租户隔离）
 * @param params
 */
export const getAllRolesListNoByTenant = (params) => defHttp.get({ url: Api.allRolesListNoByTenant, params });
/**
 * 获取指定用户负责部门
 */
export const getUserDepartList = (params) => defHttp.get({ url: Api.userDepartList, params }, { successMessageMode: 'none' });
/**
 * 获取全部职务
 */
export const getAllPostList = (params) => {
  return new Promise((resolve) => {
    defHttp.get({ url: Api.allPostList, params }).then((res) => {
      resolve(res.records);
    });
  });
};
/**
 * 回收站列表
 * @param params
 */
export const getRecycleBinList = (params) => defHttp.get({ url: Api.recycleBinList, params });
/**
 * 回收站还原
 * @param params
 */
export const putRecycleBin = (params, handleSuccess) => {
  return defHttp.put({ url: Api.putRecycleBin, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 回收站删除
 * @param params
 */
export const deleteRecycleBin = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteRecycleBin, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 修改密码
 * @param params
 */
export const changePassword = (params) => {
  return defHttp.put({ url: Api.changePassword, params });
};
/**
 * 冻结解冻
 * @param params
 */
export const frozenBatch = (params, handleSuccess) => {
  return defHttp.put({ url: Api.frozenBatch, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 获取用户代理
 * @param params
 */
export const getUserAgent = (params) => defHttp.get({ url: Api.getUserAgent, params }, { isTransformResponse: false });
/**
 * 保存或者更新用户代理
 * @param params
 */
export const saveOrUpdateAgent = (params) => {
  const url = params.id ? Api.agentEdit : Api.agentSave;
  return defHttp.post({ url: url, params });
};

/**
 * 用户同步流程
 * @param params
 */
export const syncUser = () => defHttp.put({ url: Api.syncUser });

/**
 * 用户离职(新增代理人和用户状态变更操作)
 * @param params
 */
export const userQuitAgent = (params) => {
  return defHttp.put({ url: Api.userQuitAgent, params });
};

/**
 * 用户离职列表
 * @param params
 */
export const getQuitList = (params) => {
  return defHttp.get({ url: Api.getQuitList, params });
};
