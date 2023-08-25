import { defHttp } from "/@/utils/http/axios";
const authFieldLoadData = (cgformId, params) => defHttp.get({ url: `${"/online/cgform/api/authColumn"}/${cgformId}`, params });
const authFieldUpdateStatus = (params) => defHttp.put({ url: "/online/cgform/api/authColumn", params });
const authFieldUpdateCheckbox = (params) => defHttp.post({ url: "/online/cgform/api/authColumn", params });
const authButtonLoadData = (cgformId, params) => defHttp.get({ url: `${"/online/cgform/api/authButton"}/${cgformId}`, params });
const authButtonEnable = (params) => defHttp.post({ url: "/online/cgform/api/authButton", params });
const authButtonDisable = (id, params) => defHttp.put({ url: `${"/online/cgform/api/authButton"}/${id}`, params });
const authDataLoadData = (cgformId, params) => defHttp.get({ url: `${"/online/cgform/api/authData"}/${cgformId}`, params });
const authDataUpdateStatus = (params) => defHttp.put({ url: "/online/cgform/api/authData", params });
const authDataSaveOrUpdate = (params, isUpdate) => {
  if (isUpdate) {
    return defHttp.put({ url: "/online/cgform/api/authData", params });
  } else {
    return defHttp.post({ url: "/online/cgform/api/authData", params });
  }
};
const authDataDelete = (id, params) => defHttp.delete({ url: `${"/online/cgform/api/authData"}/${id}`, params });
const authFieldLoadTree = (cgformId, authType, params) => {
  let url = `${"/online/cgform/api/authPage"}/${cgformId}/${authType}`;
  return defHttp.get({ url, params });
};
const authDataLoadTree = (cgformId, params) => {
  let url = `${"/online/cgform/api/validAuthData"}/${cgformId}`;
  return defHttp.get({ url, params });
};
const authButtonLoadTree = (cgformId, authType, params) => {
  let url = `${"/online/cgform/api/authPage"}/${cgformId}/${authType}`;
  return defHttp.get({ url, params });
};
const loadRoleAuthChecked = (params) => defHttp.get({ url: "/online/cgform/api/roleAuth", params });
const saveAuthField = (roleId, cgformId, params) => {
  let url = `${"/online/cgform/api/roleColumnAuth"}/${roleId}/${cgformId}`;
  return defHttp.post({ url, params });
};
const saveAuthData = (roleId, cgformId, params) => {
  let url = `${"/online/cgform/api/roleDataAuth"}/${roleId}/${cgformId}`;
  return defHttp.post({ url, params });
};
const saveAuthButton = (roleId, cgformId, params) => {
  let url = `${"/online/cgform/api/roleButtonAuth"}/${roleId}/${cgformId}`;
  return defHttp.post({ url, params });
};
export { authFieldLoadData as a, authFieldUpdateStatus as b, authFieldUpdateCheckbox as c, authButtonLoadData as d, authButtonEnable as e, authButtonDisable as f, authDataLoadData as g, authDataSaveOrUpdate as h, authDataUpdateStatus as i, authDataDelete as j, authFieldLoadTree as k, loadRoleAuthChecked as l, authButtonLoadTree as m, saveAuthButton as n, authDataLoadTree as o, saveAuthData as p, saveAuthField as s };
