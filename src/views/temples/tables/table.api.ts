import { unref } from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

export enum Api {
  queryTreeSync = '/api/temples/location/queryTreeSync',
  save = '/sys/sysDepart/add',
  edit = '/sys/sysDepart/edit',
  delete = '/sys/sysDepart/delete',
  deleteBatch = '/sys/sysDepart/deleteBatch',
  exportXlsUrl = '/sys/sysDepart/exportXls',
  importExcelUrl = '/sys/sysDepart/importExcel',

  roleQueryTreeList = '/sys/role/queryTreeList',
  queryDepartPermission = '/sys/permission/queryDepartPermission',
  saveDepartPermission = '/sys/permission/saveDepartPermission',

  dataRule = '/sys/sysDepartPermission/datarule',

  getCurrentUserDeparts = '/sys/user/getCurrentUserDeparts',
  selectDepart = '/sys/selectDepart',
  getUpdateDepartInfo = '/sys/user/getUpdateDepartInfo',
  doUpdateDepartInfo = '/sys/user/doUpdateDepartInfo',
  changeDepartChargePerson = '/sys/user/changeDepartChargePerson',
}

/**
 * 获取部门树列表
 */
export const queryTreeSync = (params?) => defHttp.get({ url: Api.queryTreeSync, params });

/**
 * 切换选择部门
 */
export const selectDepart = (params?) => defHttp.put({ url: Api.selectDepart, params });

/**
 * 编辑部门前获取部门相关信息
 * @param id
 */
export const getUpdateDepartInfo = (id) => defHttp.get({ url: Api.getUpdateDepartInfo, params: {id} });

/**
 * 编辑部门
 * @param params
 */
export const doUpdateDepartInfo = (params) => defHttp.put({ url: Api.doUpdateDepartInfo, params });

